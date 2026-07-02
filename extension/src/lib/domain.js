// src/lib/domain.js
//
// Tiny pure helpers for working with domains. No Supabase, no chrome APIs —
// just string logic, so they're easy to read, reuse, and test.

// "https://www.youtube.com/feed" -> "youtube.com"
export function normalizeDomain(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/i, "")
    .split("/")[0];
}

// Bare hostname of a full URL, or "" if it can't be parsed.
export function hostFromUrl(url) {
  try {
    return new URL(url).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return "";
  }
}

// The blocked domain that `host` belongs to (exact or subdomain), or null.
export function matchedDomain(host, blockedList) {
  return blockedList.find((d) => host === d || host.endsWith("." + d)) || null;
}
