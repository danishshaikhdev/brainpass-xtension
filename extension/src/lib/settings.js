// src/lib/settings.js
//
// Read/write the parent's preferences (currently just the access window),
// backed by the Supabase `parent_settings` table.

import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./auth";

export const DEFAULT_DURATION = 30;

// Minutes a child may stay on a site after passing the quiz. Falls back to the
// default if there's no row yet or the read fails.
export async function getPassDuration() {
  const { data, error } = await supabase
    .from("parent_settings")
    .select("pass_duration_minutes")
    .maybeSingle();

  if (error || !data) return DEFAULT_DURATION;
  return data.pass_duration_minutes;
}

export async function setPassDuration(minutes) {
  const user = await getCurrentUser();
  if (!user) return { success: false, message: "Please log in first." };

  const { error } = await supabase.from("parent_settings").upsert(
    {
      user_id: user.id,
      pass_duration_minutes: minutes,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) return { success: false, message: error.message };
  return { success: true };
}
