import { PlayerPointsRow } from "@/types";
import PointsBadge from "./PointsBadge";
import BreakdownTooltip from "./BreakdownTooltip";
import { CircleDot, Target, ShieldCheck, ShieldAlert, Square } from "lucide-react";

const POS_BADGE: Record<string, string> = {
  GK:  "bg-amber-100 text-amber-700",
  DEF: "bg-sky-100 text-sky-700",
  MID: "bg-emerald-100 text-emerald-700",
  FWD: "bg-rose-100 text-rose-700",
};

interface PlayerPointsCardProps {
  row: PlayerPointsRow;
}

export default function PlayerPointsCard({ row }: PlayerPointsCardProps) {
  const { player, breakdown, event, isCaptain, isBench } = row;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors
      ${isBench ? "bg-gray-50 opacity-75" : "glass-card"}
      ${isCaptain ? "ring-2 ring-amber-300" : ""}
    `}>
      <span className={`w-8 h-6 rounded-lg text-[9px] font-bold flex items-center justify-center flex-shrink-0 ${POS_BADGE[player.pos]}`}>
        {player.pos}
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-gray-900 text-sm truncate">
            {player.flag} {player.name}
          </span>
          {isCaptain && (
            <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
              CAPTAIN
            </span>
          )}
          {isBench && (
            <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
              BENCH
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-400 font-medium">{player.team}</span>
          <span className="text-gray-200">·</span>
          <span className="text-xs text-gray-400 font-medium">{event.minutesPlayed}&apos;</span>
          <span className="text-gray-200">·</span>
          <BreakdownTooltip breakdown={breakdown} event={event} isCaptain={isCaptain} />
        </div>
      </div>

      {/* Quick event icons */}
      <div className="flex gap-1 flex-shrink-0">
        {Array.from({ length: event.goals }).map((_, i) => (
          <CircleDot key={`g${i}`} className="w-3.5 h-3.5 text-emerald-600" strokeWidth={2.5} />
        ))}
        {Array.from({ length: event.assists }).map((_, i) => (
          <Target key={`a${i}`} className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
        ))}
        {event.cleanSheet && event.minutesPlayed >= 60 && (
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" strokeWidth={2.5} />
        )}
        {event.yellowCard && <Square className="w-3.5 h-3.5 text-amber-500" fill="currentColor" strokeWidth={0} />}
        {event.redCard && <Square className="w-3.5 h-3.5 text-rose-600" fill="currentColor" strokeWidth={0} />}
        {event.penaltySave && <ShieldAlert className="w-3.5 h-3.5 text-violet-600" strokeWidth={2.5} />}
      </div>

      <PointsBadge points={breakdown.total} captain={isCaptain} />
    </div>
  );
}
