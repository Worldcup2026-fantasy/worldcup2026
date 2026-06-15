import { createClient } from "@/lib/supabase";
import { Gameweek } from "@/types";
import { GAMEWEEKS, ACTIVE_GW } from "@/data/gameweeks";

/** Fetch active gameweek from DB; fall back to local static data */
export async function fetchActiveGameweek(): Promise<Gameweek> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gameweeks")
      .select("id, number, label, deadline, is_active")
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) throw new Error("not found");

    return {
      id:       data.id,
      number:   data.number,
      label:    data.label,
      isActive: data.is_active,
      deadline: data.deadline ?? undefined,
    };
  } catch {
    return ACTIVE_GW;
  }
}

/** Fetch all gameweeks from DB; fall back to static */
export async function fetchAllGameweeks(): Promise<Gameweek[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gameweeks")
      .select("id, number, label, deadline, is_active")
      .order("number");

    if (error || !data || data.length === 0) throw new Error("empty");

    return data.map((row: any) => ({
      id:       row.id,
      number:   row.number,
      label:    row.label,
      isActive: row.is_active,
      deadline: row.deadline ?? undefined,
    }));
  } catch {
    return GAMEWEEKS;
  }
}

/** Returns true if the gameweek deadline has passed (squad is locked) */
export function isDeadlinePassed(gw: Gameweek): boolean {
  if (!gw.deadline) return false;
  return new Date(gw.deadline) <= new Date();
}

/** Human-readable countdown string, e.g. "2h 14m" or "Locked" */
export function deadlineCountdown(gw: Gameweek): string {
  if (!gw.deadline) return "";
  const diff = new Date(gw.deadline).getTime() - Date.now();
  if (diff <= 0) return "Locked";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  if (h > 48) return `${Math.ceil(h / 24)}d`;
  if (h > 0)  return `${h}h ${m}m`;
  return `${m}m`;
}
