import { createClient } from "@/lib/supabase";
import { Player } from "@/types";
import { PLAYERS as LOCAL_PLAYERS } from "@/data/players";

let _cache: Player[] | null = null;
let _cacheTime = 0;
const TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchPlayers(): Promise<Player[]> {
  // Return cache if fresh
  if (_cache && Date.now() - _cacheTime < TTL) return _cache;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("players")
      .select("id, name, team, pos, price, flag, total_points")
      .order("pos")
      .order("price", { ascending: false });

    if (error || !data || data.length === 0) throw new Error("empty");

    const players: Player[] = data.map((row: any) => ({
      id:          row.id,
      name:        row.name,
      team:        row.team,
      pos:         row.pos,
      price:       Number(row.price),
      flag:        row.flag ?? "",
      totalPoints: row.total_points ?? 0,
    }));

    _cache = players;
    _cacheTime = Date.now();
    return players;
  } catch {
    // DB not reachable or not seeded — fall back to local static data
    console.warn("[playersDb] Falling back to local player data");
    return LOCAL_PLAYERS;
  }
}

/** Invalidate cache (call after admin price update) */
export function invalidatePlayersCache() {
  _cache = null;
}
