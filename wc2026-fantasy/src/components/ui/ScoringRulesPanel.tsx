"use client";

import { useState } from "react";
import { POINTS_RULES } from "@/types";
import { ListChecks, ChevronDown, Timer, CircleDot, Target, ShieldCheck, ShieldAlert, X, Frown, Square } from "lucide-react";

const RULES = [
  { label: "Playing ≥ 60 minutes",    pts: POINTS_RULES.appearance60,   icon: Timer },
  { label: "Playing < 60 minutes",    pts: POINTS_RULES.appearance,     icon: Timer },
  { label: "CircleDot (GK)",               pts: POINTS_RULES.goalGK,         icon: CircleDot },
  { label: "CircleDot (DEF)",              pts: POINTS_RULES.goalDEF,        icon: CircleDot },
  { label: "CircleDot (MID)",              pts: POINTS_RULES.goalMID,        icon: CircleDot },
  { label: "CircleDot (FWD)",              pts: POINTS_RULES.goalFWD,        icon: CircleDot },
  { label: "Assist",                  pts: POINTS_RULES.assist,         icon: Target },
  { label: "Clean sheet (GK)",        pts: POINTS_RULES.cleanSheetGK,   icon: ShieldCheck },
  { label: "Clean sheet (DEF)",       pts: POINTS_RULES.cleanSheetDEF,  icon: ShieldCheck },
  { label: "Clean sheet (MID)",       pts: POINTS_RULES.cleanSheetMID,  icon: ShieldCheck },
  { label: "Penalty save",            pts: POINTS_RULES.penaltySave,    icon: ShieldAlert },
  { label: "Penalty miss",            pts: POINTS_RULES.penaltyMiss,    icon: X },
  { label: "Own goal",                pts: POINTS_RULES.ownGoal,        icon: Frown },
  { label: "Yellow card",             pts: POINTS_RULES.yellowCard,     icon: Square },
  { label: "Red card",                pts: POINTS_RULES.redCard,        icon: Square },
];

export default function ScoringRulesPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50/80 transition-colors"
      >
        <span className="flex items-center gap-2">
          <ListChecks className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
          Scoring rules
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} strokeWidth={2.5} />
      </button>

      {open && (
        <div className="border-t border-gray-100 px-4 py-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
          {RULES.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-xs py-0.5">
              <span className="text-gray-500 flex items-center gap-2 font-medium">
                <r.icon className={`w-3.5 h-3.5 flex-shrink-0 ${
                  r.label.includes("yellow") || r.label === "Yellow card" ? "text-amber-500 fill-amber-500" :
                  r.label === "Red card" ? "text-rose-500 fill-rose-500" : "text-gray-400"
                }`} strokeWidth={2.5} fill={r.label === "Yellow card" || r.label === "Red card" ? "currentColor" : "none"} />
                {r.label}
              </span>
              <span className={`font-bold ml-2 flex-shrink-0 ${r.pts < 0 ? "text-rose-600" : "text-gray-900"}`}>
                {r.pts > 0 ? "+" : ""}{r.pts}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
