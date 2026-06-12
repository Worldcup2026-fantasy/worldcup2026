"use client";

import { BUDGET } from "@/types";

interface BudgetBarProps {
  remaining: number;
  picked: number;
  total: number;
}

export default function BudgetBar({ remaining, picked, total }: BudgetBarProps) {
  const spent = BUDGET - remaining;
  const pct = Math.min((spent / BUDGET) * 100, 100);
  const isLow = remaining < 10;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <div className="flex justify-between items-end mb-3">
        <div>
          <p className={`text-2xl font-semibold ${isLow ? "text-red-600" : "text-gray-900"}`}>
            ${remaining.toFixed(1)}m
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Budget remaining</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-gray-900">{picked}<span className="text-gray-300 font-normal"> / {total}</span></p>
          <p className="text-xs text-gray-400 mt-0.5">Players picked</p>
        </div>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLow ? "bg-red-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>${spent.toFixed(1)}m spent</span>
        <span>${BUDGET}m total</span>
      </div>
    </div>
  );
}
