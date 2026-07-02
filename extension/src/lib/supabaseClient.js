// src/lib/supabaseClient.js
//
// A single shared Supabase client for the whole extension. Import `supabase`
// from here anywhere you need to talk to the database or auth.

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_KEY } from "./config";
import { chromeStorageAdapter } from "./chromeStorageAdapter";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: chromeStorageAdapter,
    persistSession: true, // keep the parent logged in for the background worker
    autoRefreshToken: true, // Supabase rotates the token; we never hand-roll one
    detectSessionInUrl: false, // no OAuth redirect URL in an extension
  },
});
