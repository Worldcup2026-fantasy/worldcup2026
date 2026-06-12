import { LeagueMember } from "@/types";

interface LeagueStandingsTableProps {
  members: LeagueMember[];
  currentUserId?: string;
}

function RankMovement({ current, previous }: { current: number; previous?: number }) {
  if (!previous || current === previous) {
    return <span className="text-xs text-gray-300">—</span>;
  }
  const moved = previous - current; // positive = moved up
  if (moved > 0) return <span className="text-xs text-green-600">▲{moved}</span>;
  return <span className="text-xs text-red-500">▼{Math.abs(moved)}</span>;
}

const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeagueStandingsTable({
  members,
  currentUserId = "user-demo",
}: LeagueStandingsTableProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header row */}
      <div className="grid grid-cols-[40px_1fr_64px_64px_40px] gap-2 px-4 py-2 border-b border-gray-50 text-xs font-medium text-gray-400 uppercase tracking-widest">
        <span>#</span>
        <span>Team</span>
        <span className="text-right">GW pts</span>
        <span className="text-right">Total</span>
        <span className="text-right">±</span>
      </div>

      {members.map((member, i) => {
        const isMe = member.userId === currentUserId;
        return (
          <div
            key={member.userId}
            className={`grid grid-cols-[40px_1fr_64px_64px_40px] gap-2 items-center px-4 py-3 border-b border-gray-50 last:border-0 transition-colors
              ${isMe ? "bg-blue-50" : "hover:bg-gray-50"}`}
          >
            {/* Rank */}
            <span className="text-sm font-semibold">
              {member.rank <= 3 ? (
                <span>{MEDALS[member.rank - 1]}</span>
              ) : (
                <span className="text-gray-400">{member.rank}</span>
              )}
            </span>

            {/* Team name */}
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${isMe ? "text-blue-700" : "text-gray-900"}`}>
                {member.teamName}
                {isMe && (
                  <span className="ml-1.5 text-[9px] bg-blue-100 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded-full font-semibold">
                    YOU
                  </span>
                )}
              </p>
            </div>

            {/* GW points */}
            <span className="text-sm text-right text-gray-600 font-medium">
              {member.gwPoints}
            </span>

            {/* Total points */}
            <span className={`text-sm text-right font-semibold ${isMe ? "text-blue-700" : "text-gray-900"}`}>
              {member.totalPoints}
            </span>

            {/* Movement */}
            <span className="text-right">
              <RankMovement current={member.rank} previous={member.previousRank} />
            </span>
          </div>
        );
      })}
    </div>
  );
}
