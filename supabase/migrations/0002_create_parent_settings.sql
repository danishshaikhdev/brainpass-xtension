-- Migration 0002 — parent_settings
--
-- Per-parent preferences. Right now this holds only the "access window": how
-- long a child may stay on a blocked site after passing the quiz.

create table if not exists public.parent_settings (
  user_id               uuid        primary key
                                    references auth.users (id) on delete cascade,
  pass_duration_minutes int         not null default 30
                                    check (pass_duration_minutes between 1 and 240),
  updated_at            timestamptz not null default now()
);

-- Row Level Security: a parent reads/writes only their own settings row.
alter table public.parent_settings enable row level security;

create policy "read own settings"
  on public.parent_settings for select
  using (auth.uid() = user_id);

create policy "insert own settings"
  on public.parent_settings for insert
  with check (auth.uid() = user_id);

create policy "update own settings"
  on public.parent_settings for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
