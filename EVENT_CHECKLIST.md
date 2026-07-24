# CM2 Summer Cookout — Event-Day Checklist

## Pre-event (do this a few days out, then again the morning of)

### Database
- [ ] Paste the full contents of `supabase/schema.sql` into the Supabase SQL editor and run it. It's safe to re-run — every statement is idempotent (uses `if not exists`, `drop policy if exists`, or a guarded `do $$ ... $$` block).
  - Adds/updates: `messages.status` (replaces the old `approved` boolean), `accounts`, `share_events`, `message_reactions` + `increment_reaction()`, `golden_opinion`, `submission_log`.
  - Confirm Realtime is enabled for `messages` (the script checks and adds it automatically).
- [ ] If this is the first run against a **fresh** Supabase project, also confirm `messages`, `survey_responses`, and the new tables all show up in Table Editor with RLS enabled (green shield icon).

### Environment variables
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — unchanged from setup.
- [ ] `NEXT_PUBLIC_SUBMIT_URL` — set to the real deployed URL (used by the QR code **and** the OG image URL resolution).
- [ ] `MOD_PASSWORD` — set to a password only CM2 staff know. Test logging in at `/mod` before the event.
- [ ] `CRON_SECRET` (optional but recommended) — set the same value in Vercel's Cron configuration so `/api/cron/golden-opinion` rejects unauthenticated callers.
- [ ] `TV_DOMAIN` — set if the TV has its own subdomain.
- [ ] Redeploy after changing any env var (Vercel doesn't hot-reload them).

### Vercel Cron
- [ ] Confirm the project is on a plan that supports frequent cron (needed for the every-15-minutes Golden Opinion job in `vercel.json`) — Hobby only allows daily cron.
- [ ] After deploying, check Vercel → Project → Cron Jobs that `/api/cron/golden-opinion` shows a recent successful run.

### Moderation
- [ ] Log in at `/mod` with `MOD_PASSWORD` and confirm the queue loads (it'll be empty pre-event — that's fine).
- [ ] Submit a test message containing a blocklisted word (try an evasion pattern too, e.g. spaced-out letters) and confirm it lands in the **Pending review** section instead of the public wall.
- [ ] Approve it from `/mod` and confirm it appears on `/display` / `/wall` without a page reload.
- [ ] Decide who holds the `MOD_PASSWORD` on event day and how they'll access `/mod` (a phone with the URL bookmarked is enough).

### Load testing
- [ ] Run `node scripts/load-test.mjs <deployed-url> 100 20` against a staging deploy (not local — the point is to test real network + Supabase latency). Confirm:
  - Most requests succeed.
  - Some requests come back rate-limited (the script deliberately reuses ~15 device ids across 100 requests) — if **none** are rate-limited, `lib/rateLimit.ts` isn't wired up correctly.
  - p99 latency is reasonable (a few hundred ms, not multiple seconds).

### Device testing
- [ ] iPhone Safari: full flow — survey → post opinion → auto-redirect → confetti → highlighted bubble → reactions.
- [ ] Android Chrome: same flow.
- [ ] The actual TV/kiosk browser: `/display` renders correctly, QR codes are legible, ticker scrolls smoothly, reactions/milestones/golden-opinion all appear.
- [ ] Confirm both QR codes (submit + donate) scan cleanly from **10+ feet** away on a real phone camera — if not, increase the QR `size` prop in `QrCorner.tsx` / `QrCornerDonate.tsx`.

### Performance
- [ ] Run a quick Lighthouse pass on `/` (mobile, throttled) from a deployed URL — target interactive in under 3s on a mid-range phone on cellular.
- [ ] Confirm `/cm2/*` images load with the new cache headers (`Cache-Control` visible in Network tab).

### Fallback plan
- [ ] Bring a mobile hotspot as backup in case venue Wi-Fi drops. The kiosk watchdog (`useKioskWatchdog.ts`) will auto-reload `/display` after ~2 minutes of a broken realtime connection, but it still needs *some* network to recover — a hotspot is the manual fallback if the venue's connection is down entirely.
- [ ] Know the physical power-cycle procedure for the TV/kiosk device — there's no server process to supervise a serverless deployment, so a hard freeze ultimately needs a manual restart.

## During the event

- [ ] Keep `MOD_PASSWORD` and the `/mod` URL handy on a phone.
- [ ] Spot-check `/mod`'s **Pending review** section every 15–20 minutes for flagged messages needing a decision.
- [ ] If the TV shows the "Reconnecting…" pip for more than ~2 minutes, it'll auto-reload on its own — no action needed unless it's still stuck after that.
- [ ] If venue Wi-Fi dies completely: switch the kiosk device to the mobile hotspot.

## Post-event

- [ ] Export `survey_responses` and `share_events` from Supabase (Table Editor → Export CSV) for CM2's own records/analysis.
- [ ] Rotate `MOD_PASSWORD` (or remove the env var) so the moderator route isn't left open with a password that's now been used on a phone that changed hands.
- [ ] Review any messages left in **Pending review** at `/mod` — approve or reject the last stragglers.
- [ ] Consider disabling the Vercel Cron job (`vercel.json`) if the display wall won't run again soon, to avoid unnecessary function invocations.
