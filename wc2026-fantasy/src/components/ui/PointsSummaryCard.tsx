import { Gameweek } from "@/types";

interface PointsSummaryCardProps {
  gameweek: Gameweek;
  totalPoints: number;
  captainPoints: number;
  captainName: string;
  highestScorer: { name: string; points: number; flag: string };
  rank?: number;
}

export default function PointsSummaryCard({
  gameweek,
  totalPoints,
  captainPoints,
  captainName,
  highestScorer,
  rank,
}: PointsSummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-5 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-blue-200 text-xs font-medium uppercase tracking-widest mb-1">
            {gameweek.label}
          </p>
          <p className="text-5xl font-bold tracking-tight">{totalPoints}</p>
          <p className="text-blue-200 text-sm mt-1">points this gameweek</p>
        </div>
        {rank && (
          <div className="bg-white/10 rounded-xl px-3 py-2 text-center">
            <p className="text-xl font-bold">#{rank.toLocaleString()}</p>
            <p className="text-blue-200 text-xs mt-0.5">Global rank</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-blue-200 text-xs mb-1">👑 Captain</p>
          <p className="font-semibold text-sm truncate">{captainName}</p>
          <p className="text-blue-200 text-xs">{captainPoints} pts (×2)</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-blue-200 text-xs mb-1">⭐ Top scorer</p>
          <p className="font-semibold text-sm truncate">{highestScorer.flag} {highestScorer.name}</p>
          <p className="text-blue-200 text-xs">{highestScorer.points} pts</p>
        </div>
      </div>
    </div>
  );
}
