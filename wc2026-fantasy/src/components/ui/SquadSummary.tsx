"use client";

import { SquadEntry, BUDGET } from "@/types";
import { squadSummary } from "@/lib/squad";
import { ShieldCheck, Crown, Coins } from "lucide-react";

interface SquadSummaryProps {
  squad: SquadEntry[];
}

const POS_COLORS: Record<string, string> = {
  GK:  "bg-amber-50 text-amber-700",
  DEF: "bg-sky-50 text-sky-700",
  MID: "bg-emerald-50 text-emerald-700",
  FWD: "bg-rose-50 text-rose-700",
};

export default function SquadSummary({ squad }: SquadSummaryProps) {
  const { counts, spent } = squadSummary(squad);
  const captain = squad.find((e) => e.isCaptain);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <ShieldCheck className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
        <h3 className="font-display font-bold text-gray-900 text-sm">Squad summary</h3>
      </div>
      <div className="grid grid-cols-4 gap-2 mb-3">
        {(["GK", "DEF", "MID", "FWD"] as const).map((pos) => (
          <div key={pos} className={`rounded-xl py-2 text-center ${POS_COLORS[pos]}`}>
            <p className="text-lg font-display font-extrabold">{counts[pos]}</p>
            <p className="text-[10px] font-bold uppercase tracking-wide opacity-70">{pos}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Coins className="w-3.5 h-3.5" strokeWidth={2.5} />
          <span className="font-medium">Spent</span>
        </div>
        <span className="font-bold text-gray-900">${spent.toFixed(1)}m / ${BUDGET}m</span>
      </div>
      {captain && (
        <div className="flex items-center justify-between pt-2 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Crown className="w-3.5 h-3.5 text-amber-500" fill="currentColor" strokeWidth={0} />
            <span className="font-medium">Captain</span>
          </div>
          <span className="font-bold text-amber-700">{captain.player.flag} {captain.player.name}</span>
        </div>
      )}
    </div>
  );
}
