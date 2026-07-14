-- Paste this into the Supabase SQL editor (Project -> SQL Editor -> New query) and run it once.

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  approved boolean not null default true,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

-- Anyone (anon key) can read only approved messages -- used by the /display TV wall.
-- Dropped and recreated so this file can be safely re-run (e.g. after adding a new table below).
drop policy if exists "Public can read approved messages" on messages;
create policy "Public can read approved messages"
  on messages for select
  using (approved = true);

-- No public insert policy: all inserts go through the server-side Server Action
-- using the service role key, so the anon key stays read-only.

-- Enable realtime push updates for this table (skip if already added — re-adding errors).
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table messages;
  end if;
end $$;

-- Community Matters 2 intake survey, asked before guests post to the wall.
-- This is internal planning data for CM2, not shown on the /display wall, so it
-- has no public read/insert policy: all access goes through the server-side
-- Server Action using the service role key.
create table if not exists survey_responses (
  id uuid primary key default gen_random_uuid(),
  visited_before boolean not null,
  desired_programs text[] not null default '{}',
  desired_programs_other text,
  priority_spaces text[] not null default '{}',
  priority_spaces_other text,
  likely_users text[] not null default '{}',
  best_times text[] not null default '{}',
  trust_answer text not null,
  city_needs_center boolean not null,
  created_at timestamptz not null default now()
);

alter table survey_responses enable row level security;
