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

export default function Pitch({
  formation,
  squad,
  onSlotClick,
  onRemove,
  onSetCaptain,
}: PitchProps) {
  const c = FORMATIONS[formation];

  const rows: { pos: string; count: number }[] = [
    { pos: "FWD", count: c.FWD },
    { pos: "MID", count: c.MID },
    { pos: "DEF", count: c.DEF },
    { pos: "GK",  count: 1 },
  ];

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ background: "#1a6b2e" }}>
      {/* Pitch markings SVG */}
      <svg
        viewBox="0 0 560 380"
        className="w-full block"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="560" height="380" fill="#1a6b2e" />
        <rect x="20" y="20" width="520" height="340" rx="6" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <line x1="20" y1="210" x2="540" y2="210" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <rect x="190" y="20" width="180" height="70" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <rect x="190" y="290" width="180" height="70" rx="2" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <circle cx="280" cy="190" r="50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <circle cx="280" cy="190" r="2" fill="rgba(255,255,255,0.4)" />
      </svg>

      {/* Player slots overlay */}
      <div className="absolute inset-0 flex flex-col justify-around py-4">
        {rows.map(({ pos, count }) => {
          const slots = Array.from({ length: count }, (_, i) => ({
            slotId: pos === "GK" ? "GK0" : `${pos}${i}`,
            pos,
            entry: squad.find((e) => e.slot === (pos === "GK" ? "GK0" : `${pos}${i}`)),
          }));
          return (
            <div key={pos} className="flex justify-center gap-3">
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
