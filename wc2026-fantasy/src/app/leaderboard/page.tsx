"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard } from "@/lib/pointsDb";
import { Trophy, Medal, Award, BarChart3 } from "lucide-react";

type Row = { user_id: string; team_name: string; total_points: number };

const RANK_STYLES = [
  { icon: Trophy, color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Medal,  color: "text-slate-400", bg: "bg-slate-50" },
  { icon: Award,  color: "text-orange-400", bg: "bg-orange-50" },
];

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
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-2xl font-display font-extrabold text-gray-900 tracking-tight">Leaderboard</h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">Global standings · Updated after each match</p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2 animate-pulse">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 glass-card rounded-2xl">
          <Trophy className="w-10 h-10 mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
          <p className="text-sm text-gray-400 font-medium">No scores yet — check back after the first match!</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[48px_1fr_80px] gap-2 px-5 py-3 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>#</span><span>Team</span><span className="text-right">Points</span>
          </div>
          {rows.map((row, i) => {
            const style = RANK_STYLES[i];
            return (
              <div key={row.user_id}
                className="grid grid-cols-[48px_1fr_80px] gap-2 items-center px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                <span className="text-sm font-extrabold">
                  {style ? (
                    <div className={`w-8 h-8 rounded-xl ${style.bg} flex items-center justify-center`}>
                      <style.icon className={`w-4 h-4 ${style.color}`} fill="currentColor" strokeWidth={0} />
                    </div>
                  ) : (
                    <span className="text-gray-400 pl-2">{i + 1}</span>
                  )}
                </span>
                <p className="font-display font-bold text-gray-900 text-sm">{row.team_name || "Unnamed team"}</p>
                <span className="text-right font-display font-extrabold text-gray-900">{row.total_points}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
