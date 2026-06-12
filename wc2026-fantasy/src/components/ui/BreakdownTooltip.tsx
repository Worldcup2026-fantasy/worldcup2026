"use client";

import { useState } from "react";
import { PointsBreakdown, PlayerEvent } from "@/types";

interface BreakdownTooltipProps {
  breakdown: PointsBreakdown;
  event: PlayerEvent;
  isCaptain: boolean;
}

const LINE_LABELS: { key: keyof PointsBreakdown; label: string; icon: string }[] = [
  { key: "appearance",   label: "Appearance",     icon: "👟" },
  { key: "goals",        label: "Goals",          icon: "⚽" },
  { key: "assists",      label: "Assists",        icon: "🎯" },
  { key: "cleanSheet",   label: "Clean sheet",    icon: "🧤" },
  { key: "penaltySave",  label: "Penalty save",   icon: "🛡️" },
  { key: "penaltyMiss",  label: "Penalty miss",   icon: "❌" },
  { key: "ownGoal",      label: "Own goal",       icon: "😬" },
  { key: "yellowCard",   label: "Yellow card",    icon: "🟨" },
  { key: "redCard",      label: "Red card",       icon: "🟥" },
];

export default function BreakdownTooltip({ breakdown, event, isCaptain }: BreakdownTooltipProps) {
  const [open, setOpen] = useState(false);
  const finalTotal = isCaptain ? breakdown.total * 2 : breakdown.total;

  const activeLines = LINE_LABELS.filter(({ key }) => {
    const v = breakdown[key];
    return typeof v === "number" ? v !== 0 : false;
  });

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 decoration-dashed"
        aria-label="View points breakdown"
      >
        breakdown
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 text-xs">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
            <span className="font-medium text-gray-700">Points breakdown</span>
            <span className="font-bold text-gray-900">{finalTotal} pts</span>
          </div>

          {activeLines.length === 0 ? (
            <p className="text-gray-400 text-center py-1">No contributions this gameweek</p>
          ) : (
            <div className="flex flex-col gap-1">
              {activeLines.map(({ key, label, icon }) => {
                const raw = breakdown[key] as number;
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-500">{icon} {label}</span>
                    <span className={`font-semibold ${raw < 0 ? "text-red-600" : "text-gray-900"}`}>
                      {raw > 0 ? "+" : ""}{raw}
                    </span>
                  </div>
                );
              })}
              {isCaptain && (
                <div className="flex justify-between items-center pt-1 border-t border-gray-100 mt-1">
                  <span className="text-amber-600 font-medium">👑 Captain ×2</span>
                  <span className="font-bold text-amber-700">+{breakdown.total}</span>
                </div>
              )}
            </div>
          )}

          <div className="text-gray-400 mt-2 pt-2 border-t border-gray-100">
            {event.minutesPlayed}&apos; played
          </div>

          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-200 rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}
