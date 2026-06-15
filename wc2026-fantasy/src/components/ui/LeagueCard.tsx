import { League } from "@/types";
import { Crown, Hash, ArrowRight, Trash2, LogOut } from "lucide-react";

interface LeagueCardProps {
  league: League;
  userRank?: number;
  onClick: () => void;
  onLeave: () => void;
}

export default function LeagueCard({ league, userRank, onClick, onLeave }: LeagueCardProps) {
  return (
    <div
      onClick={onClick}
      className="glass-card rounded-2xl p-4 cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-100 transition-all group tap-scale"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-bold text-gray-900 text-sm truncate">{league.name}</h3>
            {league.isAdmin && (
              <span className="flex items-center gap-1 text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                <Crown className="w-2.5 h-2.5" fill="currentColor" strokeWidth={0} />
                ADMIN
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-medium">{league.memberCount} members</p>
        </div>

        {userRank && (
          <div className="text-right flex-shrink-0 ml-3">
            <p className="text-xl font-display font-extrabold text-gray-900">#{userRank}</p>
            <p className="text-xs text-gray-400 font-medium">your rank</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl px-3 py-1.5">
          <Hash className="w-3 h-3 text-gray-400" strokeWidth={2.5} />
          <span className="font-display font-bold text-sm text-gray-700 tracking-wider">
            {league.code}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onLeave(); }}
            className="text-gray-400 hover:text-rose-500 transition-colors p-1.5"
          >
            {league.isAdmin ? <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} /> : <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />}
          </button>
          <span className="flex items-center gap-1 text-xs font-bold text-blue-500 group-hover:text-blue-700 transition-colors">
            View <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
}
