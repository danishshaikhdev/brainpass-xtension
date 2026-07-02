// src/background.js
//
// The always-on enforcer. It:
//   1. keeps a live copy of the blocklist + access window from Supabase,
//   2. redirects any visit to a blocked site to the quiz page,
//   3. grants a temporary "pass" when the child solves the quiz.
//
// Where state lives:
//   - Blocklist + settings: source of truth is Supabase (a child can't change
//     them without the parent's password). We keep a copy only in memory and in
//     chrome.storage.session (RAM only, wiped on browser restart, invisible to
//     web pages) — never on disk.
//   - Passes: also RAM-only, so restarting the browser re-locks everything.

import { supabase } from "./lib/supabaseClient";
import { listBlockedSites } from "./lib/sites";
import { getPassDuration } from "./lib/settings";
import { hostFromUrl, matchedDomain } from "./lib/domain";

console.log("BrainPass background running.");

// --- Quiz redirect target ---------------------------------------------------

function getQuizResource() {
  const resources = chrome.runtime.getManifest().web_accessible_resources || [];
  for (const entry of resources) {
    const list = Array.isArray(entry.resources) ? entry.resources : [];
    const match = list.find((r) => r.includes("quiz") && r.endsWith(".html"));
    if (match) return match;
  }
  return "public/quiz.html";
}

const QUIZ_URL = chrome.runtime.getURL(getQuizResource());
const quizUrlFor = (target) =>
  `${QUIZ_URL}?target=${encodeURIComponent(target)}`;

// --- In-memory state (mirrored to chrome.storage.session) -------------------

let blockedUrls = [];
let passDurationMs = 30 * 60 * 1000;
let passes = {}; // { [domain]: expiryTimestamp }

const CACHE = {
  blocked: "cache_blocked",
  duration: "cache_duration",
  passes: "cache_passes",
};

async function restoreCache() {
  const c = await chrome.storage.session.get(Object.values(CACHE));
  if (Array.isArray(c[CACHE.blocked])) blockedUrls = c[CACHE.blocked];
  if (typeof c[CACHE.duration] === "number") passDurationMs = c[CACHE.duration];
  if (c[CACHE.passes]) passes = c[CACHE.passes];
}

async function saveCache() {
  await chrome.storage.session.set({
    [CACHE.blocked]: blockedUrls,
    [CACHE.duration]: passDurationMs,
    [CACHE.passes]: passes,
  });
}

// Pull the latest blocklist + access window from Supabase into memory.
async function syncFromSupabase() {
  try {
    await supabase.auth.getSession(); // make sure the parent session is loaded
    const [sites, minutes] = await Promise.all([
      listBlockedSites(),
      getPassDuration(),
    ]);
    blockedUrls = sites;
    passDurationMs = minutes * 60 * 1000;
    await saveCache();
    console.log(`[BrainPass] synced ${sites.length} blocked site(s).`);
  } catch (err) {
    console.warn("[BrainPass] sync failed (using cached copy):", err?.message);
  }
}

// Fast: restore the RAM cache so we can enforce immediately after a worker wake,
// then refresh from Supabase in the background.
const cacheReady = restoreCache();
cacheReady.then(syncFromSupabase);

function passActive(domain) {
  const expiry = passes[domain];
  return typeof expiry === "number" && expiry > Date.now();
}

// --- The blocker ------------------------------------------------------------

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  const url = changeInfo.url;
  if (!url || !/^https?:/i.test(url)) return; // ignore non-web + our own pages

  await cacheReady; // ensure the in-memory list is populated
  const domain = matchedDomain(hostFromUrl(url), blockedUrls);
  if (domain && !passActive(domain)) {
    chrome.tabs.update(tabId, { url: quizUrlFor(url) });
  }
});

// --- Pass expiry + periodic re-sync (both via alarms) -----------------------

chrome.alarms.create("sync", { periodInMinutes: 2 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "sync") {
    await syncFromSupabase();
    return;
  }
  if (!alarm.name.startsWith("pass:")) return;

  // A pass expired: drop it and send any tab still on that domain to the quiz.
  const domain = alarm.name.slice("pass:".length);
  if (passes[domain]) {
    const { [domain]: _expired, ...rest } = passes;
    passes = rest;
    await saveCache();
  }
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.url && matchedDomain(hostFromUrl(tab.url), [domain])) {
      chrome.tabs.update(tab.id, { url: quizUrlFor(tab.url) });
    }
  }
});

// --- Messages ---------------------------------------------------------------

// Quiz solved: unlock the target's domain for the configured window.
async function grantPass(targetUrl) {
  await cacheReady;
  const domain = matchedDomain(hostFromUrl(targetUrl), blockedUrls);
  if (!domain) return { success: false };

  const expiry = Date.now() + passDurationMs;
  passes = { ...passes, [domain]: expiry };
  await saveCache();
  chrome.alarms.create(`pass:${domain}`, { when: expiry });

  console.log(
    `Pass granted for ${domain} until ${new Date(expiry).toLocaleTimeString()}`,
  );
  return { success: true };
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GRANT_PASS") {
    grantPass(request.url).then(sendResponse);
    return true; // async response
  }
  if (request.type === "SYNC") {
    syncFromSupabase().then(() => sendResponse({ success: true }));
    return true;
  }
});
