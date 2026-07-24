-- Paste this into the Supabase SQL editor (Project -> SQL Editor -> New query) and run it once.

-- `status` is tri-state rather than a plain `approved` boolean because
-- filter-flagged (unreviewed) and moderator-rejected are different states a
-- boolean can't hold — flagged submissions are held for review instead of
-- being silently dropped. Fresh installs get this directly; the DO block
-- below upgrades any existing deployment that still has the old `approved`
-- boolean column, and is a no-op once the upgrade has run once.
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  status text not null default 'approved' check (status in ('approved', 'pending', 'rejected')),
  created_at timestamptz not null default now()
);

do $$
begin
  if exists (select 1 from information_schema.columns where table_name = 'messages' and column_name = 'approved') then
    execute 'alter table messages add column if not exists status text';
    execute $sql$update messages set status = case when approved then 'approved' else 'rejected' end where status is null$sql$;
    execute $sql$alter table messages alter column status set default 'approved'$sql$;
    execute 'alter table messages alter column status set not null';
    if not exists (select 1 from pg_constraint where conname = 'messages_status_check') then
      execute $sql$alter table messages add constraint messages_status_check check (status in ('approved', 'pending', 'rejected'))$sql$;
    end if;
    -- The old policy references `approved` directly, so it has to go before
    -- the column does (re-created further down using `status` instead).
    execute 'drop policy if exists "Public can read approved messages" on messages';
    execute 'alter table messages drop column approved';
  end if;
end $$;

alter table messages enable row level security;

-- Anyone (anon key) can read only approved messages -- used by the /display TV wall.
-- Dropped and recreated so this file can be safely re-run (e.g. after adding a new table below).
drop policy if exists "Public can read approved messages" on messages;
create policy "Public can read approved messages"
  on messages for select
  using (status = 'approved');

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

-- Share-event log for the "Community Voice: Shape Poughkeepsie" share feature.
-- Row-per-event (not a single incrementing counter): every insert is an
-- independent row under Postgres MVCC, so concurrent shares never contend on
-- a shared row lock the way `UPDATE counters SET count = count + 1` would.
-- Reads (counts) are server-side only via the service role, so there's no
-- need to expose a public select policy on raw timestamped rows.
create table if not exists share_events (
  id uuid primary key default gen_random_uuid(),
  target_type text not null,
  target_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists share_events_target_idx on share_events (target_type, target_id);

alter table share_events enable row level security;

drop policy if exists "Public can log share events" on share_events;
create policy "Public can log share events"
  on share_events for insert
  with check (true);

-- CM2 Insider accounts — no email/SMS verification by design (a low-stakes
-- community perk, not a security boundary). All reads/writes go through
-- service-role server actions since there's no auth.uid() to key RLS off of.
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact text not null,
  contact_type text not null check (contact_type in ('email', 'phone')),
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table accounts enable row level security;
-- Intentionally no policies (default-deny): every access path is a
-- service-role server action, so RLS just needs to keep the anon key out.

alter table messages add column if not exists account_id uuid references accounts(id) on delete set null;

-- Emoji reactions. The TV's flying-particle effect is driven entirely by
-- Supabase Realtime Broadcast (ephemeral, no DB write in the hot path — see
-- lib/hooks/useReactionBroadcast.ts); this table is only the debounced,
-- batched *persistence* of aggregate counts, flushed client-side every ~2s.
create table if not exists message_reactions (
  message_id uuid not null references messages(id) on delete cascade,
  emoji text not null check (emoji in ('🔥', '❤️', '👏', '😂')),
  count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (message_id, emoji)
);

alter table message_reactions enable row level security;

drop policy if exists "Public can read reaction counts" on message_reactions;
create policy "Public can read reaction counts"
  on message_reactions for select
  using (true);

-- No public insert/update policy: anon can only ever increment counts for one
-- of the 4 whitelisted emoji via the SECURITY DEFINER function below, never
-- write arbitrary rows directly.
create or replace function increment_reaction(p_message_id uuid, p_emoji text, p_delta integer)
returns void
language sql
security definer
set search_path = public
as $$
  insert into message_reactions (message_id, emoji, count, updated_at)
  values (p_message_id, p_emoji, greatest(p_delta, 1), now())
  on conflict (message_id, emoji)
  do update set count = message_reactions.count + greatest(excluded.count, 1), updated_at = now();
$$;

grant execute on function increment_reaction(uuid, text, integer) to anon;

-- Single-row "Golden Opinion" pick, recomputed every 15 minutes by a Vercel
-- Cron job (see app/api/cron/golden-opinion/route.ts) so every screen shows
-- the same spotlighted opinion at the same time instead of each client
-- picking independently.
create table if not exists golden_opinion (
  id boolean primary key default true,
  message_id uuid references messages(id) on delete set null,
  updated_at timestamptz not null default now(),
  constraint golden_opinion_singleton check (id)
);

alter table golden_opinion enable row level security;

drop policy if exists "Public can read the golden opinion" on golden_opinion;
create policy "Public can read the golden opinion"
  on golden_opinion for select
  using (true);

-- No public write policy — only the cron route (service role) updates this.

-- Postgres-backed rate limiting (Vercel functions are stateless/multi-instance,
-- so an in-memory counter wouldn't survive across invocations). See proxy.ts
-- for the device_id cookie and lib/rateLimit.ts for the check.
create table if not exists submission_log (
  device_id uuid not null,
  created_at timestamptz not null default now()
);

create index if not exists submission_log_device_created_idx on submission_log (device_id, created_at desc);

alter table submission_log enable row level security;
-- No public policies — service-role only.
