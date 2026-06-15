"use client";

import { Gameweek } from "@/types";

interface GameweekSelectorProps {
  gameweeks: Gameweek[];
  selected: number;
  onChange: (id: number) => void;
}

export default function GameweekSelector({ gameweeks, selected, onChange }: GameweekSelectorProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
      {gameweeks.map((gw) => (
        <button
          key={gw.id}
          onClick={() => onChange(gw.id)}
          className={`tap-scale flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl text-xs transition-all
            ${selected === gw.id
              ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20"
              : gw.isActive
              ? "bg-blue-50 text-blue-600 ring-1 ring-blue-100 hover:bg-blue-100"
              : "bg-white text-gray-500 hover:bg-gray-50 ring-1 ring-gray-100"
            }`}
        >
          <span className="font-display font-bold text-[11px] uppercase tracking-wide">GW{gw.number}</span>
          <span className="text-[10px] opacity-80 mt-0.5 max-w-[80px] truncate font-medium">{gw.label.split("·")[1]?.trim() ?? gw.label}</span>
          {gw.isActive && selected !== gw.id && (
            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
          )}
        </button>
      ))}
    </div>
  );
}
