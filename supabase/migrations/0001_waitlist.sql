-- Waitlist table + security posture for FoodLoop.
-- Apply with the Supabase CLI:  supabase db push
-- (Demo mode needs none of this — it uses browser localStorage.)

create table if not exists public.waitlist_signups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 2 and 80),
  email       text not null unique,
  role        text not null check (role in ('customer', 'partner')),
  city        text,
  created_at  timestamptz not null default now()
);

-- Row Level Security: anonymous visitors may INSERT their own signup, but the
-- table is NOT readable by the anon key. Reading the list is reserved for the
-- service role (used by a protected admin surface), never the public client.
alter table public.waitlist_signups enable row level security;

drop policy if exists "anon can insert signups" on public.waitlist_signups;
create policy "anon can insert signups"
  on public.waitlist_signups
  for insert
  to anon
  with check (true);

-- No SELECT policy for anon -> the admin view must use the service role.
create index if not exists waitlist_signups_created_at_idx
  on public.waitlist_signups (created_at desc);
