"use client";

import { SquadEntry } from "@/types";
import { Plus, X, Armchair } from "lucide-react";

interface BenchProps {
  squad: SquadEntry[];
  onSlotClick: (slotId: string, pos: string) => void;
  onRemove: (slotId: string) => void;
}

export default function Bench({ squad, onSlotClick, onRemove }: BenchProps) {
  return (
    <div className="glass-card rounded-2xl p-3 sm:p-4">
      <div className="flex items-center gap-1.5 mb-3 px-1">
        <Armchair className="w-4 h-4 text-gray-400" strokeWidth={2.5} />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bench</p>
      </div>
      <div className="flex justify-center gap-3 sm:gap-4 bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl py-3 sm:py-4 px-2">
        {Array.from({ length: 4 }, (_, i) => {
          const slotId = `BENCH${i}`;
          const entry = squad.find((e) => e.slot === slotId);
          return (
            <div key={slotId} className="relative flex flex-col items-center w-12 sm:w-16 cursor-pointer group">
              {entry && (
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove(slotId); }}
                  className="absolute -top-1.5 -left-1 z-10 w-[18px] h-[18px] bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <X className="w-3 h-3" strokeWidth={3} />
                </button>
              )}
              <div
                onClick={() => { if (!entry) onSlotClick(slotId, "ANY"); }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-1 transition-all text-[10px] sm:text-xs font-bold tap-scale
                  ${entry
                    ? "bg-gradient-to-br from-slate-500 to-slate-700 text-white shadow-md"
                    : "bg-white border-2 border-dashed border-gray-300 text-gray-400 hover:border-blue-400 hover:text-blue-400"
                  }`}
              >
                {entry
                  ? entry.player.name.split(" ").map((w) => w[0]).join("").slice(0, 3).toUpperCase()
                  : <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />}
              </div>
              <span className="text-[9px] sm:text-[10px] text-gray-600 font-semibold text-center w-12 sm:w-16 truncate leading-tight">
                {entry ? entry.player.name.split(" ").slice(-1)[0] : `Sub ${i + 1}`}
              </span>
              {entry && <span className="text-[8px] sm:text-[9px] text-gray-400 font-medium">${entry.player.price}m</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
