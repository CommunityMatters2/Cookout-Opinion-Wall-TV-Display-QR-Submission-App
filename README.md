# Cookout Opinion Wall

A two-screen app for the summer cookout:

- **`/`** — guest submission form (name + message). Point the QR code / handed-out tablet here.
- **`/display`** — the big-TV wall. Shows submitted messages live as they come in, plus a QR code so more guests can join.

Built with Next.js (App Router) + Supabase (Postgres + Realtime), deployed on Vercel.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run the contents of [`supabase/schema.sql`](./supabase/schema.sql).
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

Edit **`config/site.ts`** — event title, tagline, colors, confirmation message, and max lengths. That's the only file you need to touch to change how it looks.

## 5. Day-of setup

- **TV**: connect a tablet/laptop via USB-C-to-HDMI, open a browser to `https://your-app.vercel.app/display`, and go fullscreen (F11).
- **Guests**: scan the QR code shown on the TV, or use a handed-out tablet pointed at the root URL, to post their name + message.

Moderation: a simple blocklist filter in `lib/wordFilter.ts` silently rejects flagged submissions before they ever reach the database — everything else posts instantly, no manual approval needed.
