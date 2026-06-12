import { PlayerPointsRow } from "@/types";
import PointsBadge from "./PointsBadge";
import BreakdownTooltip from "./BreakdownTooltip";

const POS_BADGE: Record<string, string> = {
  GK:  "bg-amber-100 text-amber-800",
  DEF: "bg-blue-100 text-blue-800",
  MID: "bg-green-100 text-green-800",
  FWD: "bg-red-100 text-red-800",
};

interface PlayerPointsCardProps {
  row: PlayerPointsRow;
}

export default function PlayerPointsCard({ row }: PlayerPointsCardProps) {
  const { player, breakdown, event, isCaptain, isBench } = row;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors
      ${isBench ? "bg-gray-50 border-gray-100 opacity-75" : "bg-white border-gray-100"}
      ${isCaptain ? "ring-1 ring-amber-300" : ""}
    `}>
      {/* Position badge */}
      <span className={`w-8 h-5 rounded text-[9px] font-semibold flex items-center justify-center flex-shrink-0 ${POS_BADGE[player.pos]}`}>
        {player.pos}
      </span>

      {/* Player info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-900 text-sm truncate">
            {player.flag} {player.name}
          </span>
          {isCaptain && (
            <span className="text-[9px] bg-amber-100 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0">
              CAPTAIN
            </span>
          )}
          {isBench && (
            <span className="text-[9px] bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
              BENCH
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400">{player.team}</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400">{event.minutesPlayed}&apos;</span>
          <span className="text-gray-200">·</span>
          <BreakdownTooltip breakdown={breakdown} event={event} isCaptain={isCaptain} />
        </div>
      </div>

      {/* Quick event icons */}
      <div className="flex gap-1 flex-shrink-0">
        {Array.from({ length: event.goals }).map((_, i) => (
          <span key={i} title="Goal" className="text-sm">⚽</span>
        ))}
        {Array.from({ length: event.assists }).map((_, i) => (
          <span key={i} title="Assist" className="text-sm">🎯</span>
        ))}
        {event.cleanSheet && event.minutesPlayed >= 60 && (
          <span title="Clean sheet" className="text-sm">🧤</span>
        )}
        {event.yellowCard && <span title="Yellow card" className="text-sm">🟨</span>}
        {event.redCard && <span title="Red card" className="text-sm">🟥</span>}
        {event.penaltySave && <span title="Penalty save" className="text-sm">🛡️</span>}
      </div>

      {/* Points */}
      <PointsBadge points={breakdown.total} captain={isCaptain} />
    </div>
  );
}
