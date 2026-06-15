-- ============================================================
-- WC2026 Fantasy — Supabase Schema  (v3 — full)
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── Players ───────────────────────────────────────────────────────
create table if not exists players (
  id           serial primary key,
  name         text not null,
  team         text not null,
  pos          text not null check (pos in ('GK','DEF','MID','FWD')),
  price        numeric(4,1) not null,
  flag         text,
  total_points int default 0,
  created_at   timestamptz default now()
);

-- ── Squads (one per user) ─────────────────────────────────────────
create table if not exists squads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null unique,
  formation   text not null default '4-3-3',
  team_name   text,
  updated_at  timestamptz default now()
);

-- ── Squad picks ───────────────────────────────────────────────────
create table if not exists squad_players (
  id          uuid primary key default gen_random_uuid(),
  squad_id    uuid references squads(id) on delete cascade not null,
  player_id   int references players(id) on delete cascade not null,
  slot        text not null,      -- e.g. 'GK0', 'DEF2', 'BENCH1'
  is_captain  boolean default false,
  unique (squad_id, slot)
);

-- ── Gameweeks ─────────────────────────────────────────────────────
create table if not exists gameweeks (
  id        serial primary key,
  number    int not null,
  label     text,
  deadline  timestamptz,
  is_active boolean default false
);

-- ── Points log ────────────────────────────────────────────────────
create table if not exists points_log (
  id          uuid primary key default gen_random_uuid(),
  player_id   int references players(id) on delete cascade,
  gameweek_id int references gameweeks(id) on delete cascade,
  goals       int default 0,
  assists     int default 0,
  clean_sheet boolean default false,
  yellow_card boolean default false,
  red_card    boolean default false,
  points      int default 0,
  unique (player_id, gameweek_id)
);

-- ── Leagues ───────────────────────────────────────────────────────
create table if not exists leagues (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  code        char(6) not null unique,
  created_by  uuid references auth.users(id) on delete cascade not null,
  created_at  timestamptz default now()
);

-- ── League members ────────────────────────────────────────────────
create table if not exists league_members (
  id          uuid primary key default gen_random_uuid(),
  league_id   uuid references leagues(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  joined_at   timestamptz default now(),
  unique (league_id, user_id)
);

-- ================================================================
-- Row-level security
-- ================================================================

alter table squads        enable row level security;
alter table squad_players enable row level security;
alter table leagues        enable row level security;
alter table league_members enable row level security;

-- Squads: users own their own row
create policy "own squad"
  on squads for all
  using (auth.uid() = user_id);

-- Squad picks: reachable only through the owning squad
create policy "own squad players"
  on squad_players for all
  using (
    squad_id in (select id from squads where user_id = auth.uid())
  );

-- Players / gameweeks / points_log: public read
alter table players    enable row level security;
alter table gameweeks  enable row level security;
alter table points_log enable row level security;

create policy "public players"    on players    for select using (true);
create policy "public gameweeks"  on gameweeks  for select using (true);
create policy "public points_log" on points_log for select using (true);

-- Leagues: any signed-in user can create
create policy "create league"
  on leagues for insert
  with check (auth.uid() = created_by);

-- Members can read leagues they belong to
create policy "read own leagues"
  on leagues for select
  using (
    id in (select league_id from league_members where user_id = auth.uid())
  );

-- Admin (creator) can update / delete
create policy "admin league"
  on leagues for all
  using (auth.uid() = created_by);

-- League members: members can see co-members
create policy "read league members"
  on league_members for select
  using (
    league_id in (select league_id from league_members where user_id = auth.uid())
  );

create policy "join league"
  on league_members for insert
  with check (auth.uid() = user_id);

create policy "leave league"
  on league_members for delete
  using (auth.uid() = user_id);

-- ================================================================
-- Helpful view: league standings (total points per member)
-- ================================================================
create or replace view league_standings as
select
  lm.league_id,
  lm.user_id,
  lm.joined_at,
  s.id        as squad_id,
  s.team_name,
  coalesce(sum(pl.points), 0) as total_points
from league_members lm
left join squads        s  on s.user_id    = lm.user_id
left join squad_players sp on sp.squad_id  = s.id
left join points_log    pl on pl.player_id = sp.player_id
group by lm.league_id, lm.user_id, lm.joined_at, s.id, s.team_name;

-- ================================================================
-- Seed: WC 2026 players
-- Run after creating the players table.
-- ================================================================
insert into players (id, name, team, pos, price, flag) values
  (1,  'Alisson',              'Brazil',      'GK',  9.5,  '🇧🇷'),
  (2,  'Courtois',             'Belgium',     'GK',  9.0,  '🇧🇪'),
  (3,  'Memo Ochoa',           'Mexico',      'GK',  5.5,  '🇲🇽'),
  (4,  'Ederson',              'Brazil',      'GK',  8.0,  '🇧🇷'),
  (20, 'G. Donnarumma',        'Italy',       'GK',  8.5,  '🇮🇹'),
  (5,  'T. Alexander-Arnold',  'England',     'DEF', 7.5,  '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
  (6,  'R. Dias',              'Portugal',    'DEF', 6.5,  '🇵🇹'),
  (7,  'A. Davies',            'Canada',      'DEF', 6.5,  '🇨🇦'),
  (8,  'Theo Hernandez',       'France',      'DEF', 7.0,  '🇫🇷'),
  (9,  'M. Acuña',             'Argentina',   'DEF', 6.0,  '🇦🇷'),
  (10, 'R. Guerreiro',         'Portugal',    'DEF', 5.5,  '🇵🇹'),
  (11, 'J. Timber',            'Netherlands', 'DEF', 6.0,  '🇳🇱'),
  (12, 'K. Walker',            'England',     'DEF', 5.5,  '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
  (13, 'Rodri',                'Spain',       'MID', 9.0,  '🇪🇸'),
  (14, 'B. Fernandes',         'Portugal',    'MID', 9.5,  '🇵🇹'),
  (15, 'J. Bellingham',        'England',     'MID', 11.5, '🏴󠁧󠁢󠁥󠁮󠁧󠁿'),
  (16, 'Pedri',                'Spain',       'MID', 9.0,  '🇪🇸'),
  (17, 'F. Valverde',          'Uruguay',     'MID', 8.0,  '🇺🇾'),
  (18, 'Vinicius Jr',          'Brazil',      'MID', 12.0, '🇧🇷'),
  (19, 'R. Brozovic',          'Croatia',     'MID', 6.5,  '🇭🇷'),
  (21, 'Musiala',              'Germany',     'MID', 10.0, '🇩🇪'),
  (30, 'C. Pulisic',           'USA',         'MID', 8.5,  '🇺🇸'),
  (22, 'Mbappé',               'France',      'FWD', 14.0, '🇫🇷'),
  (23, 'Messi',                'Argentina',   'FWD', 13.5, '🇦🇷'),
  (24, 'Haaland',              'Norway',      'FWD', 13.0, '🇳🇴'),
  (25, 'Neymar Jr',            'Brazil',      'FWD', 11.5, '🇧🇷'),
  (26, 'R. Lukaku',            'Belgium',     'FWD', 9.5,  '🇧🇪'),
  (27, 'L. Martínez',          'Argentina',   'FWD', 9.0,  '🇦🇷'),
  (28, 'R. Lewandowski',       'Poland',      'FWD', 10.5, '🇵🇱'),
  (29, 'Osimhen',              'Nigeria',     'FWD', 9.5,  '🇳🇬')
on conflict (id) do nothing;

-- ================================================================
-- Transfers table (added v5)
-- ================================================================
create table if not exists transfers (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  squad_id      uuid references squads(id) on delete cascade not null,
  gameweek_id   int  references gameweeks(id) on delete cascade not null,
  player_out_id int  references players(id) not null,
  player_in_id  int  references players(id) not null,
  created_at    timestamptz default now()
);

alter table transfers enable row level security;

create policy "own transfers"
  on transfers for all
  using (auth.uid() = user_id);

-- ── Helper: refresh total_points on players from points_log ────────
create or replace function refresh_player_total_points()
returns void language plpgsql security definer as $$
begin
  update players p
  set    total_points = coalesce((
    select sum(pl.points)
    from   points_log pl
    where  pl.player_id = p.id
  ), 0);
end;
$$;

-- ── pg_cron schedule for deadline reminders (run every hour) ───────
-- Requires pg_cron extension. Enable in Supabase Dashboard → Extensions.
-- Replace <ref> and <anon-key> with your project values.
--
-- select cron.schedule(
--   'deadline-reminders',
--   '0 * * * *',
--   $$
--     select net.http_post(
--       'https://<ref>.functions.supabase.co/send-deadline-reminders',
--       '{}',
--       'application/json',
--       ARRAY[('Authorization','Bearer <anon-key>')::http_header]
--     )
--   $$
-- );
