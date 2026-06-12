"use client";

import { Gameweek } from "@/types";

interface GameweekSelectorProps {
  gameweeks: Gameweek[];
  selected: number;
  onChange: (id: number) => void;
}

export default function GameweekSelector({ gameweeks, selected, onChange }: GameweekSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {gameweeks.map((gw) => (
        <button
          key={gw.id}
          onClick={() => onChange(gw.id)}
          className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl border text-xs transition-colors
            ${selected === gw.id
              ? "bg-blue-600 text-white border-blue-600"
              : gw.isActive
              ? "border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100"
              : "border-gray-100 text-gray-500 bg-white hover:border-gray-300"
            }`}
        >
          <span className="font-semibold text-[11px] uppercase tracking-wide">GW{gw.number}</span>
          <span className="text-[10px] opacity-80 mt-0.5 max-w-[80px] truncate">{gw.label.split("·")[1]?.trim() ?? gw.label}</span>
          {gw.isActive && selected !== gw.id && (
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
          )}
        </button>
      ))}
    </div>
  );
}
