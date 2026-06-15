"use client";

import { useState } from "react";
import { PointsBreakdown, PlayerEvent } from "@/types";
import {
  Info, Activity, CircleDot, Target, ShieldCheck, ShieldAlert, X, Frown, Square, Crown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface BreakdownTooltipProps {
  breakdown: PointsBreakdown;
  event: PlayerEvent;
  isCaptain: boolean;
}

const LINE_LABELS: { key: keyof PointsBreakdown; label: string; icon: LucideIcon; fill?: boolean; color?: string }[] = [
  { key: "appearance",  label: "Appearance",   icon: Activity },
  { key: "goals",       label: "Goals",        icon: CircleDot,        color: "text-emerald-600" },
  { key: "assists",     label: "Assists",      icon: Target,      color: "text-blue-600" },
  { key: "cleanSheet",  label: "Clean sheet",  icon: ShieldCheck, color: "text-sky-600" },
  { key: "penaltySave", label: "Penalty save", icon: ShieldAlert, color: "text-violet-600" },
  { key: "penaltyMiss", label: "Penalty miss", icon: X,           color: "text-rose-600" },
  { key: "ownGoal",     label: "Own goal",     icon: Frown,       color: "text-rose-600" },
  { key: "yellowCard",  label: "Yellow card",  icon: Square, fill: true, color: "text-amber-500" },
  { key: "redCard",     label: "Red card",     icon: Square, fill: true, color: "text-rose-600" },
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
        className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-blue-600 transition-colors"
        aria-label="View points breakdown"
      >
        <Info className="w-3.5 h-3.5" strokeWidth={2.5} />
        breakdown
      </button>

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl p-3 text-xs">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
            <span className="font-display font-bold text-gray-700">Points breakdown</span>
            <span className="font-display font-extrabold text-gray-900">{finalTotal} pts</span>
          </div>

          {activeLines.length === 0 ? (
            <p className="text-gray-400 text-center py-1 font-medium">No contributions this gameweek</p>
          ) : (
            <div className="flex flex-col gap-1.5">
              {activeLines.map(({ key, label, icon: Icon, fill, color }) => {
                const raw = breakdown[key] as number;
                return (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                      <Icon className={`w-3.5 h-3.5 ${color ?? "text-gray-400"}`} strokeWidth={2.5} fill={fill ? "currentColor" : "none"} />
                      {label}
                    </span>
                    <span className={`font-bold ${raw < 0 ? "text-rose-600" : "text-gray-900"}`}>
                      {raw > 0 ? "+" : ""}{raw}
                    </span>
                  </div>
                );
              })}
              {isCaptain && (
                <div className="flex justify-between items-center pt-1.5 border-t border-gray-100 mt-1">
                  <span className="text-amber-600 font-bold flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
                    Captain ×2
                  </span>
                  <span className="font-bold text-amber-700">+{breakdown.total}</span>
                </div>
              )}
            </div>
          )}

          <div className="text-gray-400 mt-2 pt-2 border-t border-gray-100 font-medium">
            {event.minutesPlayed}&apos; played
          </div>

          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-gray-100 rotate-45 -mt-1" />
        </div>
      )}
    </div>
  );
}
