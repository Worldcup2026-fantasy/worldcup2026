import { Gameweek } from "@/types";
import { Crown, Star, TrendingUp } from "lucide-react";

interface PointsSummaryCardProps {
  gameweek: Gameweek;
  totalPoints: number;
  captainPoints: number;
  captainName: string;
  highestScorer: { name: string; points: number; flag: string };
  rank?: number;
}

export default function PointsSummaryCard({
  gameweek, totalPoints, captainPoints, captainName, highestScorer, rank,
}: PointsSummaryCardProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-violet-700 rounded-3xl p-5 text-white shadow-xl shadow-blue-500/20">
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="flex items-start justify-between mb-4 relative">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-200" strokeWidth={2.5} />
            <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">{gameweek.label}</p>
          </div>
          <p className="text-5xl font-display font-extrabold tracking-tight">{totalPoints}</p>
          <p className="text-blue-200 text-sm font-medium mt-1">points this gameweek</p>
        </div>
        {rank && (
          <div className="bg-white/10 backdrop-blur rounded-2xl px-3 py-2 text-center">
            <p className="text-xl font-display font-extrabold">#{rank.toLocaleString()}</p>
            <p className="text-blue-200 text-xs font-medium mt-0.5">Global rank</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 relative">
        <div className="bg-white/10 backdrop-blur rounded-2xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <Crown className="w-3.5 h-3.5 text-amber-300" fill="currentColor" strokeWidth={0} />
            <p className="text-blue-200 text-xs font-bold">Captain</p>
          </div>
          <p className="font-display font-bold text-sm truncate">{captainName}</p>
          <p className="text-blue-200 text-xs font-medium">{captainPoints} pts (×2)</p>
        </div>
        <div className="bg-white/10 backdrop-blur rounded-2xl p-3">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-300" fill="currentColor" strokeWidth={0} />
            <p className="text-blue-200 text-xs font-bold">Top scorer</p>
          </div>
          <p className="font-display font-bold text-sm truncate">{highestScorer.flag} {highestScorer.name}</p>
          <p className="text-blue-200 text-xs font-medium">{highestScorer.points} pts</p>
        </div>
      </div>
    </div>
  );
}
