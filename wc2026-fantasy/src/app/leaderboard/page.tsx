"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/lib/pointsDb";

type Row = { user_id: string; team_name: string; total_points: number };
const MEDALS = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [rows, setRows]       = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard(100)
      .then((data) => setRows(data as Row[]))
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1 tracking-tight">Leaderboard</h1>
      <p className="text-sm text-gray-400 mb-6">Global standings · Updated after each match</p>

      {loading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-2xl" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🏆</div>
          <p className="text-sm">No scores yet — check back after the first match!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[40px_1fr_80px] gap-2 px-5 py-2 border-b border-gray-50 text-xs font-medium text-gray-400 uppercase tracking-widest">
            <span>#</span><span>Team</span><span className="text-right">Points</span>
          </div>
          {rows.map((row, i) => (
            <div key={row.user_id}
              className="grid grid-cols-[40px_1fr_80px] gap-2 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <span className="text-sm font-semibold">
                {i < 3 ? MEDALS[i] : <span className="text-gray-400">{i + 1}</span>}
              </span>
              <div>
                <p className="font-medium text-gray-900 text-sm">{row.team_name || "Unnamed team"}</p>
              </div>
              <span className="text-right font-semibold text-gray-900">{row.total_points}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
