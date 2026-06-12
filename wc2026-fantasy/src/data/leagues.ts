import { League, LeagueMember } from "@/types";

export const MOCK_LEAGUES: League[] = [
  {
    id: "league-1",
    name: "Lagos FC Fantasy",
    code: "LFC26A",
    createdBy: "user-demo",
    createdAt: "2026-05-10T10:00:00Z",
    memberCount: 8,
    isAdmin: true,
  },
  {
    id: "league-2",
    name: "Office World Cup Picks",
    code: "OFC26B",
    createdBy: "user-other",
    createdAt: "2026-05-14T14:30:00Z",
    memberCount: 12,
    isAdmin: false,
  },
];

export const MOCK_STANDINGS: Record<string, LeagueMember[]> = {
  "league-1": [
    { userId: "u1", teamName: "Chidi's XI",       totalPoints: 312, gwPoints: 58, rank: 1, previousRank: 2, joinedAt: "2026-05-10T10:01:00Z" },
    { userId: "u2", teamName: "Sola's Ballers",    totalPoints: 287, gwPoints: 71, rank: 2, previousRank: 1, joinedAt: "2026-05-10T10:05:00Z" },
    { userId: "u3", teamName: "Tunde United",      totalPoints: 265, gwPoints: 44, rank: 3, previousRank: 3, joinedAt: "2026-05-11T09:00:00Z" },
    { userId: "user-demo", teamName: "My Dream Team", totalPoints: 254, gwPoints: 61, rank: 4, previousRank: 5, joinedAt: "2026-05-10T10:00:00Z" },
    { userId: "u4", teamName: "Emeka's Picks",     totalPoints: 241, gwPoints: 39, rank: 5, previousRank: 4, joinedAt: "2026-05-12T11:00:00Z" },
    { userId: "u5", teamName: "Glory FC",          totalPoints: 228, gwPoints: 52, rank: 6, previousRank: 7, joinedAt: "2026-05-12T12:00:00Z" },
    { userId: "u6", teamName: "Super Eagles XI",   totalPoints: 214, gwPoints: 33, rank: 7, previousRank: 6, joinedAt: "2026-05-13T08:00:00Z" },
    { userId: "u7", teamName: "The Invincibles",   totalPoints: 199, gwPoints: 47, rank: 8, previousRank: 8, joinedAt: "2026-05-14T09:00:00Z" },
  ],
  "league-2": [
    { userId: "u8",  teamName: "Bayo's Best XI",   totalPoints: 341, gwPoints: 63, rank: 1,  previousRank: 1,  joinedAt: "2026-05-14T14:31:00Z" },
    { userId: "u9",  teamName: "Femi Fantasy",      totalPoints: 318, gwPoints: 55, rank: 2,  previousRank: 3,  joinedAt: "2026-05-14T15:00:00Z" },
    { userId: "user-demo", teamName: "My Dream Team", totalPoints: 254, gwPoints: 61, rank: 7, previousRank: 8, joinedAt: "2026-05-15T08:00:00Z" },
  ],
};
