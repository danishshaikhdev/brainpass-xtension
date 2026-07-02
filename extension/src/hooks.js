// src/hooks.js
//
// React hooks that connect components to the Supabase data layer. Components
// only use these hooks; they never import Supabase directly.

import { useCallback, useEffect, useState } from "react";
import { listBlockedSites, addBlockedSite, removeBlockedSite } from "./lib/sites";
import { getPassDuration, setPassDuration, DEFAULT_DURATION } from "./lib/settings";

// Tell the background worker to re-sync its copy of the blocklist/settings.
export function notifyBackground() {
  try {
    chrome.runtime.sendMessage({ type: "SYNC" }, () => void chrome.runtime.lastError);
  } catch {
    /* background may be asleep; the periodic sync will catch up */
  }
}

// Live blocklist plus add/remove helpers. Every mutation reloads the list and
// pings the background so blocking updates immediately.
export function useBlockedSites() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    setSites(await listBlockedSites());
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const add = useCallback(
    async (raw) => {
      const res = await addBlockedSite(raw);
      if (res.success) {
        await reload();
        notifyBackground();
      }
      return res;
    },
    [reload],
  );

  const remove = useCallback(
    async (domain) => {
      const res = await removeBlockedSite(domain);
      if (res.success) {
        await reload();
        notifyBackground();
      }
      return res;
    },
    [reload],
  );

  return { sites, loading, add, remove };
}

// Access-window setting as [minutes, update].
export function usePassDuration() {
  const [minutes, setMinutes] = useState(DEFAULT_DURATION);

  useEffect(() => {
    getPassDuration().then(setMinutes);
  }, []);

  const update = useCallback(async (value) => {
    setMinutes(value);
    await setPassDuration(value);
    notifyBackground();
  }, []);

  return [minutes, update];
}
