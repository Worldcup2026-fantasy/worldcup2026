"use client";

import { SquadEntry } from "@/types";
import PlayerSlot from "./PlayerSlot";

interface BenchProps {
  squad: SquadEntry[];
  onSlotClick: (slotId: string, pos: string) => void;
  onRemove: (slotId: string) => void;
}

export default function Bench({ squad, onSlotClick, onRemove }: BenchProps) {
  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <p className="text-xs text-gray-400 text-center uppercase tracking-widest mb-3">
        Bench
      </p>
      <div className="flex justify-center gap-4 bg-gray-100 rounded-xl py-4 px-2">
        {Array.from({ length: 4 }, (_, i) => {
          const slotId = `BENCH${i}`;
          const entry = squad.find((e) => e.slot === slotId);
          return (
            <div key={slotId} className="relative flex flex-col items-center w-16 cursor-pointer group">
              {entry && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(slotId); }}
                  className="absolute -top-1 left-1 z-10 w-4 h-4 bg-red-700 text-red-100 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${entry.player.name}`}
                >×</button>
              )}
              <div
                onClick={() => { if (!entry) onSlotClick(slotId, "ANY"); }}
                className={`w-11 h-11 rounded-full flex items-center justify-center mb-1 border transition-all text-xs font-medium
                  ${entry
                    ? "bg-blue-700 border-blue-700 text-blue-100"
                    : "bg-white border-gray-300 text-gray-400 hover:border-blue-400"
                  }`}
              >
                {entry
                  ? entry.player.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase()
                  : <span className="text-lg leading-none">+</span>
                }
              </div>
              <span className="text-[10px] text-gray-600 font-medium text-center w-16 truncate leading-tight">
                {entry ? entry.player.name : `Sub ${i + 1}`}
              </span>
              {entry && (
                <span className="text-[9px] text-gray-400">${entry.player.price}m</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
