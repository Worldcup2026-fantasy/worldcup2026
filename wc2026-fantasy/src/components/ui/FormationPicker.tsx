"use client";

import { Formation, FORMATIONS } from "@/types";
import { LayoutGrid } from "lucide-react";

const ALL_FORMATIONS: Formation[] = ["4-3-3", "4-4-2", "3-5-2", "5-3-2"];

interface FormationPickerProps {
  current: Formation;
  onChange: (f: Formation) => void;
}

export default function FormationPicker({ current, onChange }: FormationPickerProps) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-1.5 mb-3">
        <LayoutGrid className="w-4 h-4 text-violet-600" strokeWidth={2.5} />
        <h3 className="font-display font-bold text-gray-900 text-sm">Formation</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ALL_FORMATIONS.map((f) => {
          const c = FORMATIONS[f];
          const active = current === f;
          return (
            <button
              key={f}
              onClick={() => onChange(f)}
              className={`tap-scale py-2.5 px-2 rounded-xl text-sm font-bold transition-all ${
                active
                  ? "bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f}
              <span className={`block text-[10px] font-medium mt-0.5 ${active ? "text-blue-100" : "text-gray-400"}`}>
                {c.DEF}-{c.MID}-{c.FWD}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
