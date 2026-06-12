import {
  Player,
  PlayerEvent,
  PointsBreakdown,
  POINTS_RULES,
} from "@/types";

export function calcPoints(player: Player, event: PlayerEvent): PointsBreakdown {
  const { pos } = player;

  // Appearance
  const appearance =
    event.minutesPlayed >= 60
      ? POINTS_RULES.appearance60
      : event.minutesPlayed > 0
      ? POINTS_RULES.appearance
      : 0;

  // Goals
  const goalPts =
    pos === "GK"
      ? POINTS_RULES.goalGK
      : pos === "DEF"
      ? POINTS_RULES.goalDEF
      : pos === "MID"
      ? POINTS_RULES.goalMID
      : POINTS_RULES.goalFWD;
  const goals = event.goals * goalPts;

  // Assists
  const assists = event.assists * POINTS_RULES.assist;

  // Clean sheet (only for GK/DEF if they played ≥60 min)
  const cleanSheetPts =
    pos === "GK"
      ? POINTS_RULES.cleanSheetGK
      : pos === "DEF"
      ? POINTS_RULES.cleanSheetDEF
      : pos === "MID"
      ? POINTS_RULES.cleanSheetMID
      : 0;
  const cleanSheet =
    event.cleanSheet && event.minutesPlayed >= 60 ? cleanSheetPts : 0;

  // Cards
  const yellowCard = event.yellowCard ? POINTS_RULES.yellowCard : 0;
  const redCard = event.redCard ? POINTS_RULES.redCard : 0;

  // Special
  const penaltySave = event.penaltySave ? POINTS_RULES.penaltySave : 0;
  const penaltyMiss = event.penaltyMiss ? POINTS_RULES.penaltyMiss : 0;
  const ownGoal = event.ownGoal * POINTS_RULES.ownGoal;

  const total =
    appearance +
    goals +
    assists +
    cleanSheet +
    yellowCard +
    redCard +
    penaltySave +
    penaltyMiss +
    ownGoal;

  return {
    appearance,
    goals,
    assists,
    cleanSheet,
    yellowCard,
    redCard,
    penaltySave,
    penaltyMiss,
    ownGoal,
    total,
  };
}

export function emptyEvent(): PlayerEvent {
  return {
    goals: 0,
    assists: 0,
    cleanSheet: false,
    yellowCard: false,
    redCard: false,
    penaltySave: false,
    penaltyMiss: false,
    ownGoal: 0,
    minutesPlayed: 90,
  };
}

/** Build mock gameweek data so the UI is never empty during dev */
export function mockGameweekEvents(playerIds: number[]): Record<number, PlayerEvent> {
  const seed: Record<number, Partial<PlayerEvent>> = {
    22: { goals: 2, assists: 1, minutesPlayed: 90 },               // Mbappé
    23: { goals: 1, assists: 2, minutesPlayed: 90 },               // Messi
    15: { goals: 1, assists: 1, minutesPlayed: 90 },               // Bellingham
    18: { goals: 1, minutesPlayed: 90 },                           // Vinicius
    1:  { cleanSheet: true, minutesPlayed: 90 },                   // Alisson
    5:  { assists: 1, cleanSheet: true, minutesPlayed: 90 },       // TAA
    24: { goals: 1, minutesPlayed: 75 },                           // Haaland
    29: { goals: 1, minutesPlayed: 90 },                           // Osimhen
    13: { assists: 1, yellowCard: true, minutesPlayed: 90 },       // Rodri
    16: { minutesPlayed: 90 },                                     // Pedri
    6:  { cleanSheet: true, minutesPlayed: 90 },                   // R. Dias
  };

  return Object.fromEntries(
    playerIds.map((id) => [id, { ...emptyEvent(), ...(seed[id] ?? {}) }])
  );
}
