"use client";

import { useState } from "react";
import { POINTS_RULES } from "@/types";

const RULES = [
  { label: "Playing ≥ 60 minutes",    pts: POINTS_RULES.appearance60,   icon: "⏱️" },
  { label: "Playing < 60 minutes",    pts: POINTS_RULES.appearance,     icon: "⏱️" },
  { label: "Goal (GK)",               pts: POINTS_RULES.goalGK,         icon: "⚽" },
  { label: "Goal (DEF)",              pts: POINTS_RULES.goalDEF,        icon: "⚽" },
  { label: "Goal (MID)",              pts: POINTS_RULES.goalMID,        icon: "⚽" },
  { label: "Goal (FWD)",              pts: POINTS_RULES.goalFWD,        icon: "⚽" },
  { label: "Assist",                  pts: POINTS_RULES.assist,         icon: "🎯" },
  { label: "Clean sheet (GK)",        pts: POINTS_RULES.cleanSheetGK,   icon: "🧤" },
  { label: "Clean sheet (DEF)",       pts: POINTS_RULES.cleanSheetDEF,  icon: "🧤" },
  { label: "Clean sheet (MID)",       pts: POINTS_RULES.cleanSheetMID,  icon: "🧤" },
  { label: "Penalty save",            pts: POINTS_RULES.penaltySave,    icon: "🛡️" },
  { label: "Penalty miss",            pts: POINTS_RULES.penaltyMiss,    icon: "❌" },
  { label: "Own goal",                pts: POINTS_RULES.ownGoal,        icon: "😬" },
  { label: "Yellow card",             pts: POINTS_RULES.yellowCard,     icon: "🟨" },
  { label: "Red card",                pts: POINTS_RULES.redCard,        icon: "🟥" },
];

export default function ScoringRulesPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span>📋</span> Scoring rules
        </span>
        <span className={`text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-3 grid grid-cols-2 gap-x-6 gap-y-1.5">
          {RULES.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-xs">
              <span className="text-gray-500 flex items-center gap-1">
                <span>{r.icon}</span>
                <span>{r.label}</span>
              </span>
              <span className={`font-semibold ml-2 flex-shrink-0 ${r.pts < 0 ? "text-red-600" : "text-gray-900"}`}>
                {r.pts > 0 ? "+" : ""}{r.pts}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
