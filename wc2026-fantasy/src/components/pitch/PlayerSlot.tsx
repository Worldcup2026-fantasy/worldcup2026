"use client";

import { SquadEntry } from "@/types";
import { getInitials } from "@/lib/squad";

interface PlayerSlotProps {
  slotId: string;
  pos: string;
  entry?: SquadEntry;
  onAdd: (slotId: string, pos: string) => void;
  onRemove: (slotId: string) => void;
  onSetCaptain: (slotId: string) => void;
}

const POS_LABELS: Record<string, string> = {
  GK: "GK", DEF: "DEF", MID: "MID", FWD: "FWD",
};

export default function PlayerSlot({ slotId, pos, entry, onAdd, onRemove, onSetCaptain }: PlayerSlotProps) {
  return (
    <div className="relative flex flex-col items-center w-12 sm:w-16 cursor-pointer group">
      {/* Remove */}
      {entry && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(slotId); }}
          className="absolute -top-1 left-0 z-10 w-4 h-4 bg-red-700 text-red-100 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity"
          aria-label={`Remove ${entry.player.name}`}
        >×</button>
      )}
      {/* Captain badge */}
      {entry?.isCaptain && (
        <div className="absolute -top-1 right-0 z-10 w-4 h-4 bg-amber-600 text-amber-100 rounded-full text-[8px] font-semibold flex items-center justify-center">
          C
        </div>
      )}
      {/* Shirt */}
      <div
        onClick={() => entry ? onSetCaptain(slotId) : onAdd(slotId, pos)}
        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center mb-1 border transition-all text-[10px] sm:text-xs font-medium select-none
          ${entry
            ? entry.isCaptain
              ? "bg-green-700 border-green-700 text-green-100"
              : "bg-blue-700 border-blue-700 text-blue-100"
            : "bg-white/80 border-gray-300 text-gray-400 hover:border-blue-400 active:bg-blue-50"
          }`}
      >
        {entry ? getInitials(entry.player.name) : <span className="text-base leading-none">+</span>}
      </div>
      {/* Name */}
      <span className="text-[9px] sm:text-[10px] text-white font-medium text-center w-12 sm:w-16 truncate leading-tight drop-shadow-sm">
        {entry ? entry.player.name.split(" ").slice(-1)[0] : POS_LABELS[pos] ?? pos}
      </span>
      {entry && (
        <span className="text-[8px] sm:text-[9px] text-white/70 drop-shadow-sm">${entry.player.price}m</span>
      )}
    </div>
  );
}
