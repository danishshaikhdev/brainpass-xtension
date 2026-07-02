// src/lib/chromeStorageAdapter.js
//
// Supabase needs somewhere to persist the logged-in session. In an extension
// there is no localStorage in the service worker, so we give it chrome.storage.
// The same storage is shared by the popup and the background worker, which is
// how the background can read the parent's blocklist after they log in once.

export const chromeStorageAdapter = {
  async getItem(key) {
    const result = await chrome.storage.local.get(key);
    return result[key] ?? null;
  },
  async setItem(key, value) {
    await chrome.storage.local.set({ [key]: value });
  },
  async removeItem(key) {
    await chrome.storage.local.remove(key);
  },
};
