import { LeagueMember } from "@/types";
import { Trophy, Medal, Award, ChevronUp, ChevronDown, Minus } from "lucide-react";

interface LeagueStandingsTableProps {
  members: LeagueMember[];
  currentUserId?: string;
}

function RankMovement({ current, previous }: { current: number; previous?: number }) {
  if (!previous || current === previous) {
    return <Minus className="w-3.5 h-3.5 text-gray-300 ml-auto" strokeWidth={2.5} />;
  }
  const moved = previous - current;
  if (moved > 0) return <span className="flex items-center justify-end gap-0.5 text-xs font-bold text-emerald-600"><ChevronUp className="w-3.5 h-3.5" strokeWidth={3} />{moved}</span>;
  return <span className="flex items-center justify-end gap-0.5 text-xs font-bold text-rose-500"><ChevronDown className="w-3.5 h-3.5" strokeWidth={3} />{Math.abs(moved)}</span>;
}

const RANK_STYLES = [
  { icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Medal,  color: "text-slate-400", bg: "bg-slate-50" },
  { icon: Award,  color: "text-orange-400", bg: "bg-orange-50" },
];

export default function LeagueStandingsTable({
  members,
  currentUserId = "user-demo",
}: LeagueStandingsTableProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="grid grid-cols-[40px_1fr_64px_64px_40px] gap-2 px-4 py-2.5 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
        <span>#</span>
        <span>Team</span>
        <span className="text-right">GW</span>
        <span className="text-right">Total</span>
        <span className="text-right">±</span>
      </div>

      {members.map((member, i) => {
        const isMe = member.userId === currentUserId;
        const style = RANK_STYLES[member.rank - 1];
        return (
          <div
            key={member.userId}
            className={`grid grid-cols-[40px_1fr_64px_64px_40px] gap-2 items-center px-4 py-3 border-b border-gray-50 last:border-0 transition-colors
              ${isMe ? "bg-blue-50" : "hover:bg-gray-50/80"}`}
          >
            <span className="text-sm font-bold">
              {style ? (
                <div className={`w-7 h-7 rounded-lg ${style.bg} flex items-center justify-center`}>
                  <style.icon className={`w-3.5 h-3.5 ${style.color}`} fill="currentColor" strokeWidth={0} />
                </div>
              ) : (
                <span className="text-gray-400 pl-1.5">{member.rank}</span>
              )}
            </span>

            <div className="min-w-0">
              <p className={`text-sm font-display font-bold truncate ${isMe ? "text-blue-700" : "text-gray-900"}`}>
                {member.teamName}
                {isMe && (
                  <span className="ml-1.5 text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">
                    YOU
                  </span>
                )}
              </p>
            </div>

            <span className="text-sm text-right text-gray-500 font-bold">
              {member.gwPoints}
            </span>

            <span className={`text-sm text-right font-display font-extrabold ${isMe ? "text-blue-700" : "text-gray-900"}`}>
              {member.totalPoints}
            </span>

            <RankMovement current={member.rank} previous={member.previousRank} />
          </div>
        );
      })}
    </div>
  );
}
