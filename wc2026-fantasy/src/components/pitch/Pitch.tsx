"use client";

import { Formation, FORMATIONS, SquadEntry } from "@/types";
import PlayerSlot from "./PlayerSlot";

interface PitchProps {
  formation: Formation;
  squad: SquadEntry[];
  onSlotClick: (slotId: string, pos: string) => void;
  onRemove: (slotId: string) => void;
  onSetCaptain: (slotId: string) => void;
}

export default function Pitch({ formation, squad, onSlotClick, onRemove, onSetCaptain }: PitchProps) {
  const c = FORMATIONS[formation];

  const rows: { pos: string; count: number }[] = [
    { pos: "FWD", count: c.FWD },
    { pos: "MID", count: c.MID },
    { pos: "DEF", count: c.DEF },
    { pos: "GK",  count: 1 },
  ];

  return (
    <div className="relative w-full rounded-3xl overflow-hidden pitch-bg shadow-xl">
      {/* Pitch markings */}
      <svg viewBox="0 0 560 380" className="w-full block" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="14" y="14" width="532" height="352" rx="10" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
        <line x1="14" y1="207" x2="546" y2="207" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <rect x="180" y="14" width="200" height="74" rx="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <rect x="180" y="292" width="200" height="74" rx="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <rect x="245" y="14" width="70" height="28" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <rect x="245" y="338" width="70" height="28" rx="2" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <circle cx="280" cy="190" r="54" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <circle cx="280" cy="190" r="2.5" fill="rgba(255,255,255,0.5)" />
        <path d="M 246 14 A 34 34 0 0 0 314 14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        <path d="M 246 366 A 34 34 0 0 1 314 366" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      </svg>

      {/* Glow accents */}
      <div className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-white/10 rounded-full blur-2xl" />

      {/* Slots */}
      <div className="absolute inset-0 flex flex-col justify-around py-3 sm:py-4">
        {rows.map(({ pos, count }) => {
          const slots = Array.from({ length: count }, (_, i) => ({
            slotId: pos === "GK" ? "GK0" : `${pos}${i}`,
            pos,
            entry: squad.find((e) => e.slot === (pos === "GK" ? "GK0" : `${pos}${i}`)),
          }));
          return (
            <div key={pos} className="flex justify-center gap-2 sm:gap-3">
              {slots.map(({ slotId, entry }) => (
                <PlayerSlot
                  key={slotId}
                  slotId={slotId}
                  pos={pos}
                  entry={entry}
                  onAdd={onSlotClick}
                  onRemove={onRemove}
                  onSetCaptain={onSetCaptain}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
