import { Formation, FormationConfig, FORMATIONS, SquadEntry, BUDGET } from "@/types";

export function getSlotIds(formation: Formation): string[] {
  const c: FormationConfig = FORMATIONS[formation];
  const ids: string[] = ["GK0"];
  for (let i = 0; i < c.DEF; i++) ids.push(`DEF${i}`);
  for (let i = 0; i < c.MID; i++) ids.push(`MID${i}`);
  for (let i = 0; i < c.FWD; i++) ids.push(`FWD${i}`);
  for (let i = 0; i < 4; i++) ids.push(`BENCH${i}`);
  return ids;
}

export function budgetLeft(squad: SquadEntry[]): number {
  const spent = squad.reduce((s, e) => s + e.player.price, 0);
  return Math.round((BUDGET - spent) * 10) / 10;
}

export function isInSquad(squad: SquadEntry[], playerId: number): boolean {
  return squad.some((e) => e.player.id === playerId);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    `<mark class="bg-amber-100 text-amber-800 rounded px-px">${text.slice(idx, idx + query.length)}</mark>` +
    text.slice(idx + query.length)
  );
}

export function squadSummary(squad: SquadEntry[]) {
  const counts = { GK: 0, DEF: 0, MID: 0, FWD: 0 };
  squad.forEach((e) => {
    if (e.player.pos in counts) counts[e.player.pos as keyof typeof counts]++;
  });
  const spent = Math.round((BUDGET - budgetLeft(squad)) * 10) / 10;
  return { counts, spent };
}
