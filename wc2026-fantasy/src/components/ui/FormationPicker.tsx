"use client";

import { Formation, FORMATIONS } from "@/types";

const ALL_FORMATIONS: Formation[] = ["4-3-3", "4-4-2", "3-5-2", "5-3-2"];

interface FormationPickerProps {
  current: Formation;
  onChange: (f: Formation) => void;
}

export default function FormationPicker({ current, onChange }: FormationPickerProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <h3 className="font-medium text-gray-900 mb-3">Formation</h3>
      <div className="flex gap-2 flex-wrap">
        {ALL_FORMATIONS.map((f) => {
          const c = FORMATIONS[f];
          return (
            <button
              key={f}
              onClick={() => onChange(f)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                current === f
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {f}
              <span className="block text-[10px] font-normal opacity-70 mt-0.5">
                {c.DEF}D · {c.MID}M · {c.FWD}F
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
