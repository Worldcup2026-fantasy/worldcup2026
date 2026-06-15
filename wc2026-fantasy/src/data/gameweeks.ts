import { Gameweek } from "@/types";

export const GAMEWEEKS: Gameweek[] = [
  { id: 1, number: 1, label: "Group Stage · MD1", isActive: false, deadline: "2026-06-12T14:00:00Z" },
  { id: 2, number: 2, label: "Group Stage · MD2", isActive: false, deadline: "2026-06-16T14:00:00Z" },
  { id: 3, number: 3, label: "Group Stage · MD3", isActive: true,  deadline: "2026-06-20T14:00:00Z" },
  { id: 4, number: 4, label: "Round of 32",        isActive: false, deadline: "2026-06-25T14:00:00Z" },
  { id: 5, number: 5, label: "Round of 16",        isActive: false, deadline: "2026-07-01T14:00:00Z" },
  { id: 6, number: 6, label: "Quarter-Finals",     isActive: false, deadline: "2026-07-05T14:00:00Z" },
  { id: 7, number: 7, label: "Semi-Finals",        isActive: false, deadline: "2026-07-09T14:00:00Z" },
  { id: 8, number: 8, label: "Final",              isActive: false, deadline: "2026-07-13T14:00:00Z" },
];

export const ACTIVE_GW = GAMEWEEKS.find((g) => g.isActive) ?? GAMEWEEKS[2];
