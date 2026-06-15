# ⚽ WC2026 Fantasy

A World Cup 2026 fantasy football app built with **Next.js 14**, **Supabase**, **Tailwind CSS**, and deployable to **Vercel** in one click.

---

## Features

- 🟢 Squad picker with interactive pitch view
- 🔍 Player search (name or country)
- 💰 $100m budget tracker
- 🧩 4 formations: 4-3-3 · 4-4-2 · 3-5-2 · 5-3-2
- 👑 Captain selection (double points)
- 🪑 4-player bench
- 📊 Points page — per-player breakdown, gameweek selector, scoring rules
- 🏆 Private leagues — create with a name, share a 6-char invite code, join by code or deep link
- 📋 League standings table with rank movement indicators
- 🔐 Auth (sign up / sign in) via Supabase
- 🌍 Global leaderboard

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/wc2026-fantasy.git
cd wc2026-fantasy
npm install
```

### 2. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a **new project**
2. In the dashboard, go to **SQL Editor → New Query**
3. Paste and run the contents of `supabase-schema.sql`
4. Go to **Settings → API** and copy:
   - `Project URL`
   - `anon public` key

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Add your environment variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. Click **Deploy** ✅

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Home / landing
│   ├── squad/page.tsx              # Squad picker
│   ├── points/page.tsx             # Points & scoring
│   ├── leagues/
│   │   ├── page.tsx                # My leagues list + detail
│   │   └── join/page.tsx           # Join via invite link (/leagues/join?code=XYZ)
│   ├── leaderboard/page.tsx        # Global standings
│   └── auth/login/page.tsx         # Login + signup
├── components/
│   ├── pitch/
│   │   ├── Pitch.tsx               # Football pitch SVG + slot overlay
│   │   ├── PlayerSlot.tsx          # Single position slot
│   │   └── Bench.tsx               # 4 substitute slots
│   └── ui/
│       ├── SquadPicker.tsx         # Squad page orchestrator
│       ├── PlayerList.tsx          # Searchable + filterable player list
│       ├── BudgetBar.tsx           # Budget remaining + progress bar
│       ├── FormationPicker.tsx     # Formation selector
│       ├── SquadSummary.tsx        # Position counts + captain display
│       ├── PointsPage.tsx          # Points page orchestrator
│       ├── PointsSummaryCard.tsx   # Hero card with total + rank
│       ├── PlayerPointsCard.tsx    # One player row with events + breakdown
│       ├── BreakdownTooltip.tsx    # Hover breakdown of point sources
│       ├── PointsBadge.tsx         # Coloured points chip
│       ├── GameweekSelector.tsx    # Horizontal GW pill tabs
│       ├── ScoringRulesPanel.tsx   # Collapsible rules reference
│       ├── LeaguesPage.tsx         # Leagues orchestrator (list + detail views)
│       ├── LeagueCard.tsx          # League summary card
│       ├── LeagueStandingsTable.tsx # Ranked member table
│       ├── InviteCodeDisplay.tsx   # Copyable invite code + link
│       └── CreateJoinModal.tsx     # Create / join modal with tab switcher
├── data/
│   ├── players.ts                  # 30 World Cup players
│   ├── gameweeks.ts                # 8 gameweeks GS → Final
│   └── leagues.ts                  # Mock leagues + standings for dev
├── lib/
│   ├── supabase.ts                 # Supabase browser client
│   ├── squad.ts                    # Budget, slot, highlight helpers
│   ├── scoring.ts                  # Points engine (calcPoints)
│   └── leagues.ts                  # createLeague, joinLeague, fetchMyLeagues
└── types/
    └── index.ts                    # All shared TS types + scoring constants
```

---

## How Leagues Work

1. **Create** — enter a name → get a random 6-char code (e.g. `LFC26A`)
2. **Share** — copy the code or the invite link (`/leagues/join?code=LFC26A`)
3. **Join** — enter the code at `/leagues` or follow the invite link
4. **Compete** — standings update each gameweek based on squad points

The invite code uses only unambiguous characters (no `0`, `O`, `I`, `1`) so it's easy to type manually.

---

## Scoring Rules

| Action | Points |
|--------|--------|
| Playing ≥ 60 min | +2 |
| Playing < 60 min | +1 |
| Goal (GK) | +10 |
| Goal (DEF) | +8 |
| Goal (MID) | +6 |
| Goal (FWD) | +5 |
| Assist | +4 |
| Clean sheet (GK) | +6 |
| Clean sheet (DEF) | +4 |
| Clean sheet (MID) | +1 |
| Penalty save | +5 |
| Yellow card | −1 |
| Penalty miss | −2 |
| Own goal | −2 |
| Red card | −3 |

Captain earns **double** points.

---

## Roadmap

- [ ] Save squads to Supabase
- [ ] Live points from API-Football
- [ ] Transfer system between gameweeks
- [ ] Push notifications for deadline reminders
- [ ] Mobile-optimised layout

---

## Tech Stack

| Layer      | Tool                        |
|------------|-----------------------------|
| Framework  | Next.js 14 (App Router)     |
| Database   | Supabase (Postgres)         |
| Auth       | Supabase Auth               |
| Styling    | Tailwind CSS                |
| Language   | TypeScript                  |
| Deployment | Vercel                      |
