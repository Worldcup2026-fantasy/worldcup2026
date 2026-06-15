import { createClient } from "@/lib/supabase";
import { League, LeagueMember } from "@/types";

/** Generate a random 6-char uppercase invite code */
export function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

/** Create a new league and automatically join it as admin */
export async function createLeague(name: string, userId: string) {
  const supabase = createClient();
  const code = generateCode();

  const { data: league, error: leagueErr } = await supabase
    .from("leagues")
    .insert({ name: name.trim(), code, created_by: userId })
    .select()
    .single();

  if (leagueErr) throw new Error(leagueErr.message);

  // Auto-join the creator
  const { error: joinErr } = await supabase
    .from("league_members")
    .insert({ league_id: league.id, user_id: userId });

  if (joinErr) throw new Error(joinErr.message);

  return { league, code };
}

/** Join an existing league by invite code */
export async function joinLeague(code: string, userId: string) {
  const supabase = createClient();
  const normalised = code.trim().toUpperCase();

  // Look up the league
  const { data: league, error: findErr } = await supabase
    .from("leagues")
    .select("id, name, code")
    .eq("code", normalised)
    .single();

  if (findErr || !league) throw new Error("League not found. Check the code and try again.");

  // Check already a member
  const { data: existing } = await supabase
    .from("league_members")
    .select("id")
    .eq("league_id", league.id)
    .eq("user_id", userId)
    .single();

  if (existing) throw new Error("You're already in this league.");

  const { error: joinErr } = await supabase
    .from("league_members")
    .insert({ league_id: league.id, user_id: userId });

  if (joinErr) throw new Error(joinErr.message);

  return league;
}

/** Fetch all leagues for a user with member counts */
export async function fetchMyLeagues(userId: string): Promise<League[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("league_members")
    .select(`
      joined_at,
      leagues (
        id, name, code, created_by, created_at,
        league_members ( count )
      )
    `)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  if (!data) return [];

  return (data as any[]).map((row) => ({
    id: row.leagues.id,
    name: row.leagues.name,
    code: row.leagues.code,
    createdBy: row.leagues.created_by,
    createdAt: row.leagues.created_at,
    memberCount: row.leagues.league_members[0]?.count ?? 0,
    isAdmin: row.leagues.created_by === userId,
  }));
}

/** Fetch standings for a single league */
export async function fetchLeagueStandings(leagueId: string): Promise<LeagueMember[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("league_members")
    .select(`
      user_id,
      joined_at,
      squads ( team_name )
    `)
    .eq("league_id", leagueId);

  if (error) throw new Error(error.message);
  if (!data) return [];

  // In production you'd join total_points from a view;
  // for now we return members with placeholder points
  return (data as any[])
    .map((row, i) => ({
      userId: row.user_id,
      teamName: row.squads?.team_name ?? "Unnamed team",
      totalPoints: 0,   // TODO: sum from points_log
      gwPoints: 0,
      rank: i + 1,
      joinedAt: row.joined_at,
    }));
}

/** Leave a league (admins cannot leave — must delete) */
export async function leaveLeague(leagueId: string, userId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("league_members")
    .delete()
    .eq("league_id", leagueId)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

/** Delete a league entirely (admin only) */
export async function deleteLeague(leagueId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("leagues")
    .delete()
    .eq("id", leagueId);
  if (error) throw new Error(error.message);
}
