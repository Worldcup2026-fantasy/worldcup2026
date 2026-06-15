import { createClient } from "@/lib/supabase";
import { Formation, SquadEntry } from "@/types";
import { PLAYERS } from "@/data/players";

// ── Save (upsert) ─────────────────────────────────────────────────

export async function saveSquad(
  userId: string,
  formation: Formation,
  squadEntries: SquadEntry[],
  teamName?: string
): Promise<string> {
  const supabase = createClient();

  // 1. Upsert the squad row (one per user)
  const { data: squadRow, error: squadErr } = await supabase
    .from("squads")
    .upsert(
      {
        user_id: userId,
        formation,
        team_name: teamName ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }   // one squad per user for now
    )
    .select("id")
    .single();

  if (squadErr || !squadRow) throw new Error(squadErr?.message ?? "Failed to save squad");

  const squadId: string = squadRow.id;

  // 2. Delete all existing picks for this squad, then re-insert fresh
  const { error: deleteErr } = await supabase
    .from("squad_players")
    .delete()
    .eq("squad_id", squadId);

  if (deleteErr) throw new Error(deleteErr.message);

  // 3. Insert all current picks
  if (squadEntries.length > 0) {
    const rows = squadEntries.map((e) => ({
      squad_id:   squadId,
      player_id:  e.player.id,
      slot:       e.slot,
      is_captain: e.isCaptain,
    }));

    const { error: insertErr } = await supabase
      .from("squad_players")
      .insert(rows);

    if (insertErr) throw new Error(insertErr.message);
  }

  return squadId;
}

// ── Load ──────────────────────────────────────────────────────────

export interface SavedSquad {
  squadId: string;
  formation: Formation;
  teamName: string | null;
  entries: SquadEntry[];
}

export async function loadSquad(userId: string): Promise<SavedSquad | null> {
  const supabase = createClient();

  // Fetch squad row + all picks in one query
  const { data: squadRow, error: squadErr } = await supabase
    .from("squads")
    .select(`
      id,
      formation,
      team_name,
      squad_players (
        player_id,
        slot,
        is_captain
      )
    `)
    .eq("user_id", userId)
    .maybeSingle();

  if (squadErr) throw new Error(squadErr.message);
  if (!squadRow) return null;

  // Hydrate player objects from local player list
  // (swap for a Supabase players fetch once you seed the DB)
  const entries: SquadEntry[] = (squadRow.squad_players as any[]).reduce<SquadEntry[]>(
    (acc, pick) => {
      const player = PLAYERS.find((p) => p.id === pick.player_id);
      if (!player) return acc;           // skip unknown players gracefully
      acc.push({
        player,
        slot:      pick.slot,
        isCaptain: pick.is_captain,
      });
      return acc;
    },
    []
  );

  return {
    squadId:  squadRow.id,
    formation: squadRow.formation as Formation,
    teamName:  squadRow.team_name,
    entries,
  };
}

// ── Delete ────────────────────────────────────────────────────────

export async function deleteSquad(userId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("squads")
    .delete()
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}
