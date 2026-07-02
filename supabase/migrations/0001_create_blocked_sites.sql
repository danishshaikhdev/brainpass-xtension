-- Migration 0001 — blocked_sites
--
-- One row per (parent, domain) that should be blocked. This is the single
-- source of truth for the blocklist, so a child cannot bypass it by clearing
-- the browser's local storage — they'd need the parent's login to change it.

create table if not exists public.blocked_sites (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users (id) on delete cascade,
  domain     text        not null,
  created_at timestamptz not null default now(),

  -- A parent can't block the same domain twice.
  unique (user_id, domain)
);

-- Fast lookups of "all domains for this parent".
create index if not exists blocked_sites_user_id_idx
  on public.blocked_sites (user_id);

-- Row Level Security: every parent sees and edits ONLY their own rows.
alter table public.blocked_sites enable row level security;

create policy "read own blocked sites"
  on public.blocked_sites for select
  using (auth.uid() = user_id);

create policy "add own blocked sites"
  on public.blocked_sites for insert
  with check (auth.uid() = user_id);

create policy "delete own blocked sites"
  on public.blocked_sites for delete
  using (auth.uid() = user_id);
