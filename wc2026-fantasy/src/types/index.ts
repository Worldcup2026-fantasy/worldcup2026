export type Position = "GK" | "DEF" | "MID" | "FWD";

export type Formation = "4-3-3" | "4-4-2" | "3-5-2" | "5-3-2";

export interface Player {
  id: number;
  name: string;
  team: string;
  pos: Position;
  price: number;
  flag: string;
  totalPoints?: number;
  form?: number;
}

export interface SquadEntry {
  player: Player;
  slot: string; // e.g. "GK0", "DEF2", "BENCH1"
  isCaptain: boolean;
}

export interface FormationConfig {
  DEF: number;
  MID: number;
  FWD: number;
}

export const FORMATIONS: Record<Formation, FormationConfig> = {
  "4-3-3": { DEF: 4, MID: 3, FWD: 3 },
  "4-4-2": { DEF: 4, MID: 4, FWD: 2 },
  "3-5-2": { DEF: 3, MID: 5, FWD: 2 },
  "5-3-2": { DEF: 5, MID: 3, FWD: 2 },
};

// ── Leagues ───────────────────────────────────────────────────────

export interface League {
  id: string;
  name: string;
  code: string;         // 6-char uppercase invite code
  createdBy: string;    // user_id
  createdAt: string;
  memberCount: number;
  isAdmin: boolean;     // true if current user created it
}

export interface LeagueMember {
  userId: string;
  teamName: string;
  totalPoints: number;
  gwPoints: number;     // points in the active gameweek
  rank: number;
  previousRank?: number;
  joinedAt: string;
}

export interface LeagueStanding {
  league: League;
  members: LeagueMember[];
  currentUserRank: number;
}

export const BUDGET = 100;
export const SQUAD_SIZE = 15;
export const STARTERS = 11;

// ── Scoring ────────────────────────────────────────────────────────

export interface PlayerEvent {
  goals: number;
  assists: number;
  cleanSheet: boolean;
  yellowCard: boolean;
  redCard: boolean;
  penaltySave: boolean;
  penaltyMiss: boolean;
  ownGoal: number;
  minutesPlayed: number; // ≥60 = 2pts appearance, <60 but >0 = 1pt
}

export interface PointsBreakdown {
  appearance: number;
  goals: number;
  assists: number;
  cleanSheet: number;
  yellowCard: number;
  redCard: number;
  penaltySave: number;
  penaltyMiss: number;
  ownGoal: number;
  total: number;
}

export interface PlayerPointsRow {
  player: Player;
  event: PlayerEvent;
  breakdown: PointsBreakdown;
  isCaptain: boolean;
  isBench: boolean;
}

export interface Gameweek {
  id: number;
  number: number;
  label: string;
  isActive: boolean;
  deadline?: string;
}

// ── Transfers ────────────────────────────────────────────────────

export interface Transfer {
  id: string;
  userId: string;
  gameweekId: number;
  playerOutId: number;
  playerInId: number;
  playerOut?: Player;
  playerIn?: Player;
  createdAt: string;
}

// ── Scoring rules ─────────────────────────────────────────────────

export const POINTS_RULES = {
  appearance60: 2,   // played ≥ 60 min
  appearance: 1,     // played < 60 min but > 0
  goalGK:  10,
  goalDEF: 8,
  goalMID: 6,
  goalFWD: 5,
  assist:  4,
  cleanSheetGK:  6,
  cleanSheetDEF: 4,
  cleanSheetMID: 1,
  yellowCard: -1,
  redCard:    -3,
  penaltySave:  5,
  penaltyMiss: -2,
  ownGoal:     -2,
} as const;
