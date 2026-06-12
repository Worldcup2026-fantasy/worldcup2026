# 🚀 Deployment Guide — WC2026 Fantasy

## Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)
- A [Resend](https://resend.com) account for email (optional, free tier = 3k emails/mo)
- [Supabase CLI](https://supabase.com/docs/guides/cli) for Edge Functions (optional)

---

## 1. Set up Supabase

### Create project
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Note your **Project URL** and **anon public key** (Settings → API)

### Run the schema
1. Dashboard → **SQL Editor** → **New query**
2. Paste the entire contents of `supabase-schema.sql`
3. Click **Run** — this creates all tables, RLS policies, seeds players, and sets up the standings view

### Enable Email Auth
1. Dashboard → **Authentication** → **Providers** → Email → ✅ Enabled
2. Set **Site URL** to your Vercel domain (e.g. `https://wc2026-fantasy.vercel.app`)
3. Add your domain to **Redirect URLs**

---

## 2. Deploy to Vercel

### Option A — One-click (recommended)
1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGci...
   ```
4. Click **Deploy** ✅

### Option B — Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
# Follow prompts, add env vars when asked
```

---

## 3. Deploy Supabase Edge Functions (optional — for live points + emails)

### Install Supabase CLI
```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>
```

### Deploy functions
```bash
supabase functions deploy process-match-results
supabase functions deploy send-deadline-reminders
```

### Set secrets
```bash
supabase secrets set API_FOOTBALL_KEY=your_api_football_key
supabase secrets set RESEND_API_KEY=re_your_resend_key
supabase secrets set NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

### Schedule deadline reminders (pg_cron)
1. Dashboard → **Database** → **Extensions** → enable `pg_cron` and `http`
2. Run in SQL Editor (replace `<ref>` and `<anon-key>`):
```sql
select cron.schedule(
  'deadline-reminders',
  '0 * * * *',
  $$
    select net.http_post(
      'https://<ref>.functions.supabase.co/send-deadline-reminders',
      '{}',
      'application/json',
      ARRAY[('Authorization','Bearer <anon-key>')::http_header]
    )
  $$
);
```

### Trigger match results manually (or via webhook)
```bash
curl -X POST https://<ref>.functions.supabase.co/process-match-results \
  -H "Authorization: Bearer <anon-key>"
```

---

## 4. Get API-Football key (for live points)

1. Sign up at [api-football.com](https://www.api-football.com) — free tier = 100 req/day
2. Go to Dashboard → API Key
3. Add to Supabase secrets: `supabase secrets set API_FOOTBALL_KEY=your_key`
4. World Cup 2026 league ID will be confirmed closer to the tournament (check their `/leagues` endpoint)

---

## 5. Post-deploy checklist

- [ ] Visit `https://your-app.vercel.app` — landing page loads
- [ ] Sign up with an email → check for confirmation email
- [ ] Sign in → `/squad` loads with pitch
- [ ] Pick 15 players → Save squad → reload page → squad persists
- [ ] Create a league → code appears → join from another account
- [ ] `/transfers` — swap a player → transfer appears in history
- [ ] `/points` — mock GW3 data visible

---

## Environment variables summary

| Variable | Where to find |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |

Supabase Edge Function secrets (set via CLI, not .env):
| Secret | Notes |
|---|---|
| `API_FOOTBALL_KEY` | api-football.com dashboard |
| `RESEND_API_KEY` | resend.com → API Keys |
| `NEXT_PUBLIC_APP_URL` | Your Vercel domain |
