# BrainPass — Supabase backend

BrainPass uses [Supabase](https://supabase.com) instead of a custom server:
Supabase provides the auth (parent accounts) and the database (blocklist +
settings), and **Row Level Security** guarantees each parent only ever sees
their own data.

## Tables

| Table              | Migration                              | Purpose                                        |
| ------------------ | -------------------------------------- | ---------------------------------------------- |
| `blocked_sites`    | `0001_create_blocked_sites.sql`        | One row per (parent, domain) to block          |
| `parent_settings`  | `0002_create_parent_settings.sql`      | Per-parent access window (minutes)             |

Parent accounts themselves live in Supabase's built-in `auth.users` — we don't
manage passwords ourselves.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run each file in `migrations/` in order
   (`0001…` then `0002…`). Or, with the Supabase CLI:
   ```bash
   supabase db push          # applies everything in migrations/
   ```
3. **Auth settings** (Authentication → Providers → Email): for the smoothest
   parent experience, turn **"Confirm email" OFF** so signup logs in instantly.
   Leave it on if you prefer verified emails (parents then confirm via email
   before their first login).
4. Copy **Project URL** and **anon public key** (Project Settings → API) into
   `extension/.env`.

## Why the data is safe from a "savvy kid"

- The blocklist lives in Supabase, not in browser storage. Clearing local
  storage does **not** unblock anything — the extension re-syncs from Supabase.
- Every table has RLS: reads/writes require the parent's session
  (`auth.uid() = user_id`). A child can't add or remove sites without the
  parent's password.
- The extension caches the list only in RAM (`chrome.storage.session`), which is
  wiped on restart and never written to disk.

> Note: no purely client-side control is 100% tamper-proof against someone with
> full developer access to the browser. This raises the bar significantly; it is
> not a guarantee.
