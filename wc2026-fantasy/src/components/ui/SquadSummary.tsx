"use client";

import { SquadEntry } from "@/types";
import { squadSummary, budgetLeft } from "@/lib/squad";
import { BUDGET } from "@/types";

interface SquadSummaryProps {
  squad: SquadEntry[];
}

export default function SquadSummary({ squad }: SquadSummaryProps) {
  const { counts, spent } = squadSummary(squad);
  const captain = squad.find((e) => e.isCaptain);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="font-medium text-gray-900 mb-3">Squad summary</h3>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm mb-3">
        {(["GK", "DEF", "MID", "FWD"] as const).map((pos) => (
          <div key={pos} className="flex justify-between">
            <span className="text-gray-400">{pos}</span>
            <span className="font-medium text-gray-900">{counts[pos]}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-100 pt-3 text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">Spent</span>
          <span className="font-medium text-gray-900">${spent.toFixed(1)}m / ${BUDGET}m</span>
        </div>
        {captain && (
          <div className="flex justify-between">
            <span className="text-gray-400">Captain</span>
            <span className="font-medium text-amber-700">
              {captain.player.flag} {captain.player.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
