"use client";

import { BUDGET } from "@/types";
import { Wallet, Users } from "lucide-react";

interface BudgetBarProps {
  remaining: number;
  picked: number;
  total: number;
}

export default function BudgetBar({ remaining, picked, total }: BudgetBarProps) {
  const spent = BUDGET - remaining;
  const pct = Math.min((spent / BUDGET) * 100, 100);
  const isLow = remaining < 15;

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex justify-between items-end mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet className={`w-4 h-4 ${isLow ? "text-rose-500" : "text-blue-600"}`} strokeWidth={2.5} />
            <p className="text-xs text-gray-400 font-medium">Budget left</p>
          </div>
          <p className={`text-2xl font-display font-extrabold tracking-tight ${isLow ? "text-rose-600" : "text-gray-900"}`}>
            ${remaining.toFixed(1)}m
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 mb-1">
            <p className="text-xs text-gray-400 font-medium">Players</p>
            <Users className="w-4 h-4 text-violet-600" strokeWidth={2.5} />
          </div>
          <p className="text-2xl font-display font-extrabold tracking-tight text-gray-900">
            {picked}<span className="text-gray-300 font-medium"> / {total}</span>
          </p>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isLow ? "bg-gradient-to-r from-rose-400 to-rose-600" : "bg-gradient-to-r from-blue-500 to-violet-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1.5 font-medium">
        <span>${spent.toFixed(1)}m spent</span>
        <span>${BUDGET}m total</span>
      </div>
    </div>
  );
}
