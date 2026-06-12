import { createClient } from "@/lib/supabase";
import { Transfer, SquadEntry, Player } from "@/types";
import { PLAYERS } from "@/data/players";

/** Record a transfer and update squad_players atomically */
export async function makeTransfer(
  userId: string,
  squadId: string,
  gameweekId: number,
  playerOut: Player,
  playerIn: Player,
  slot: string,
  isCaptain: boolean
): Promise<void> {
  const supabase = createClient();

  // 1. Log the transfer
  const { error: logErr } = await supabase.from("transfers").insert({
    user_id:       userId,
    squad_id:      squadId,
    gameweek_id:   gameweekId,
    player_out_id: playerOut.id,
    player_in_id:  playerIn.id,
  });
  if (logErr) throw new Error(logErr.message);

  // 2. Swap player in squad_players
  const { error: swapErr } = await supabase
    .from("squad_players")
    .update({ player_id: playerIn.id, is_captain: isCaptain })
    .eq("squad_id", squadId)
    .eq("slot", slot);
  if (swapErr) throw new Error(swapErr.message);
}

/** Fetch transfer history for the current user */
export async function fetchTransfers(userId: string): Promise<Transfer[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transfers")
    .select("id, user_id, gameweek_id, player_out_id, player_in_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((row: any) => ({
    id:          row.id,
    userId:      row.user_id,
    gameweekId:  row.gameweek_id,
    playerOutId: row.player_out_id,
    playerInId:  row.player_in_id,
    playerOut:   PLAYERS.find((p) => p.id === row.player_out_id),
    playerIn:    PLAYERS.find((p) => p.id === row.player_in_id),
    createdAt:   row.created_at,
  }));
}

/** Count transfers used in current gameweek (free allowance = 1) */
export async function transfersUsedThisGw(
  userId: string,
  gameweekId: number
): Promise<number> {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("transfers")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("gameweek_id", gameweekId);

  if (error) return 0;
  return count ?? 0;
}
