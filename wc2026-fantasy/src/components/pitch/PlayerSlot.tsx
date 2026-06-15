"use client";

import { SquadEntry } from "@/types";
import { getInitials } from "@/lib/squad";
import { Plus, X, Crown } from "lucide-react";

interface PlayerSlotProps {
  slotId: string;
  pos: string;
  entry?: SquadEntry;
  onAdd: (slotId: string, pos: string) => void;
  onRemove: (slotId: string) => void;
  onSetCaptain: (slotId: string) => void;
}

const POS_LABELS: Record<string, string> = { GK: "GK", DEF: "DEF", MID: "MID", FWD: "FWD" };

export default function PlayerSlot({ slotId, pos, entry, onAdd, onRemove, onSetCaptain }: PlayerSlotProps) {
  return (
    <div className="relative flex flex-col items-center w-12 sm:w-16 cursor-pointer group">
      {/* Remove */}
      {entry && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(slotId); }}
          className="absolute -top-1.5 -left-1 z-10 w-[18px] h-[18px] bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity shadow"
          aria-label={`Remove ${entry.player.name}`}
        >
          <X className="w-3 h-3" strokeWidth={3} />
        </button>
      )}
      {/* Captain badge */}
      {entry?.isCaptain && (
        <div className="absolute -top-1.5 -right-1 z-10 w-[18px] h-[18px] bg-amber-500 text-white rounded-full flex items-center justify-center shadow ring-2 ring-white">
          <Crown className="w-2.5 h-2.5" fill="currentColor" strokeWidth={0} />
        </div>
      )}
      {/* Jersey */}
      <div
        onClick={() => entry ? onSetCaptain(slotId) : onAdd(slotId, pos)}
        className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-1 transition-all text-[10px] sm:text-xs font-bold select-none tap-scale
          ${entry
            ? entry.isCaptain
              ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30 ring-2 ring-white"
              : "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-900/20 ring-2 ring-white"
            : "bg-white/15 border-2 border-dashed border-white/50 text-white/70 hover:border-white hover:bg-white/25"
          }`}
      >
        {entry ? getInitials(entry.player.name) : <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />}
      </div>
      {/* Name */}
      <span className="text-[9px] sm:text-[10px] text-white font-semibold text-center w-12 sm:w-16 truncate leading-tight drop-shadow-md">
        {entry ? entry.player.name.split(" ").slice(-1)[0] : POS_LABELS[pos] ?? pos}
      </span>
      {entry && (
        <span className="text-[8px] sm:text-[9px] text-white/80 font-medium drop-shadow">${entry.player.price}m</span>
      )}
    </div>
  );
}
