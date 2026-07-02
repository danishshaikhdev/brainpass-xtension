// src/lib/sites.js
//
// CRUD for the blocklist, backed by the Supabase `blocked_sites` table.
// Row Level Security guarantees a parent only ever touches their own rows, so
// these functions don't need to filter by user themselves (except on insert,
// where the user_id must be supplied).

import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./auth";
import { normalizeDomain } from "./domain";

// Returns an array of blocked domains, e.g. ["youtube.com", "reddit.com"].
export async function listBlockedSites() {
  const { data, error } = await supabase
    .from("blocked_sites")
    .select("domain")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[BrainPass] listBlockedSites:", error.message);
    return [];
  }
  return data.map((row) => row.domain);
}

export async function addBlockedSite(rawDomain) {
  const domain = normalizeDomain(rawDomain);
  if (!domain) return { success: false, message: "Please enter a valid site." };

  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Please log in first." };

  const { error } = await supabase
    .from("blocked_sites")
    .insert({ user_id: user.id, domain });

  if (error) {
    // 23505 = unique_violation (domain already blocked)
    if (error.code === "23505") {
      return { success: false, message: "That site is already blocked." };
    }
    return { success: false, message: error.message };
  }
  return { success: true, domain };
}

export async function removeBlockedSite(domain) {
  const { error } = await supabase
    .from("blocked_sites")
    .delete()
    .eq("domain", domain);

  if (error) return { success: false, message: error.message };
  return { success: true };
}
