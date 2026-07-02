// src/lib/config.js
//
// Supabase connection details. These are injected at build time by Parcel from
// the .env file (see .env.example). The anon key is safe to ship in a client —
// data is protected by Row Level Security, not by hiding the key.

// Parcel inlines process.env.* from the .env file at build time.
// (This is a Parcel project, so we use process.env — not Vite's import.meta.env.)
export const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
export const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error(
    "[BrainPass] Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY. " +
      "Copy extension/.env.example to extension/.env and fill them in.",
  );
}
