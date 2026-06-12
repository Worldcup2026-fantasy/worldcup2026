import { League } from "@/types";

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
      className="bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:border-blue-200 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 text-sm truncate">{league.name}</h3>
            {league.isAdmin && (
              <span className="text-[9px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
                ADMIN
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400">{league.memberCount} members</p>
        </div>

        {userRank && (
          <div className="text-right flex-shrink-0 ml-3">
            <p className="text-xl font-semibold text-gray-900">#{userRank}</p>
            <p className="text-xs text-gray-400">your rank</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Code pill */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5">
          <span className="text-xs text-gray-400">Code</span>
          <span className="font-mono text-sm font-semibold text-gray-700 tracking-wider">
            {league.code}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onLeave(); }}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1"
          >
            {league.isAdmin ? "Delete" : "Leave"}
          </button>
          <span className="text-xs text-blue-500 group-hover:text-blue-700 transition-colors">
            View →
          </span>
        </div>
      </div>
    </div>
  );
}
