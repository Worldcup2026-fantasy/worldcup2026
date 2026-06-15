import { createClient } from "@/lib/supabase";
import { PlayerEvent } from "@/types";

/** Fetch all points_log rows for a given gameweek, keyed by player_id */
export async function fetchPointsLog(
  gameweekId: number
): Promise<Record<number, PlayerEvent>> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("points_log")
    .select(
      "player_id, goals, assists, clean_sheet, yellow_card, red_card, points"
    )
    .eq("gameweek_id", gameweekId);

  if (error || !data) return {};

  const result: Record<number, PlayerEvent> = {};
  for (const row of data as any[]) {
    result[row.player_id] = {
      goals:         row.goals        ?? 0,
      assists:       row.assists       ?? 0,
      cleanSheet:    row.clean_sheet   ?? false,
      yellowCard:    row.yellow_card   ?? false,
      redCard:       row.red_card      ?? false,
      penaltySave:   false,   // not yet in schema — add column when ready
      penaltyMiss:   false,
      ownGoal:       0,
      minutesPlayed: row.goals > 0 || row.assists > 0 ? 90 : 0, // inferred
    };
  }
  return result;
}

/** Fetch total points per player across all gameweeks (for leaderboard) */
export async function fetchLeaderboard(limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("league_standings")
    .select("user_id, team_name, total_points")
    .order("total_points", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data as { user_id: string; team_name: string; total_points: number }[];
}
