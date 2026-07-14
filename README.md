# Cookout Opinion Wall

A two-screen app for the summer cookout, built for [Community Matters 2, Inc.](https://communitymatters2.org):

- **`/`** — guest flow. Point the QR code / handed-out tablet here. Guests first answer CM2's 7-question
  community center survey (see [`lib/surveyQuestions.ts`](./lib/surveyQuestions.ts)), then get a thank-you
  screen with CM2's social links, then post a free-form opinion (name + message) to the big screen.
- **`/display`** — the big-TV wall. Shows submitted opinions live as they come in, plus a CM2-branded header,
  footer, and promo ticker, and a QR code so more guests can join.

Built with Next.js (App Router) + Supabase (Postgres + Realtime), deployed on Vercel.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run the contents of [`supabase/schema.sql`](./supabase/schema.sql). This creates
   both the `messages` table (shown on `/display`) and the `survey_responses` table (CM2's internal survey
   data — not shown publicly). If you already ran an earlier version of this file, just run the
   `survey_responses` block again — `create table if not exists` makes it safe to re-run.
3. Grab from Project Settings → API: the **Project URL**, **anon public key**, and **service_role key**.

## 2. Local development

1. Copy `.env.example` to `.env.local` and fill in the Supabase values from step 1.
2. Install and run:
   ```bash
   npm install
   npm run dev
   ```
3. Check `http://localhost:3000` (the form) and `http://localhost:3000/display` (the TV wall).

## 3. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Add the same env vars from `.env.local` in Vercel Project Settings → Environment Variables.
4. Deploy. Once you have the live URL, set `NEXT_PUBLIC_SUBMIT_URL` to that URL (e.g. `https://your-app.vercel.app/`) and redeploy — this makes the QR code on `/display` point to the real site instead of localhost.

## 4. Rebranding for your event

Edit **`config/site.ts`** — event title, tagline, colors, confirmation message, max lengths, and the CM2 org
info (logo, mission, social links, palette). Edit **`lib/surveyQuestions.ts`** to change the survey questions
themselves. The CM2 logo and hero photo live in `public/cm2/` — swap those files to rebrand visuals.

## 5. Day-of setup

- **TV**: connect a tablet/laptop via USB-C-to-HDMI, open a browser to `https://your-app.vercel.app/display`, and go fullscreen (F11).
- **Guests**: scan the QR code shown on the TV, or use a handed-out tablet pointed at the root URL, to answer the survey and post their name + message.

Moderation: a simple blocklist filter in `lib/wordFilter.ts` silently rejects flagged submissions before they ever reach the database — everything else posts instantly, no manual approval needed.

## Note on `public/CM2 Content/`

This folder (if present) holds CM2's raw source presentations (multi-megabyte SVG exports) — it's
gitignored and never deployed. The actual web-optimized assets pulled from it live in `public/cm2/`
(`logo.png`, `hero-cookout.jpg`), which *are* tracked and deployed.
