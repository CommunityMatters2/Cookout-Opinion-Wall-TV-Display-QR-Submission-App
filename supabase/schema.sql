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
create policy "Public can read approved messages"
  on messages for select
  using (approved = true);

-- No public insert policy: all inserts go through the server-side Server Action
-- using the service role key, so the anon key stays read-only.

-- Enable realtime push updates for this table.
alter publication supabase_realtime add table messages;
