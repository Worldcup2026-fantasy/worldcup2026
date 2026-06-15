"use client";

import { useState } from "react";
import { Player, SquadEntry } from "@/types";
import { isInSquad, budgetLeft, highlightMatch } from "@/lib/squad";
import { Search, X, CheckCircle2, SearchX, Users } from "lucide-react";

interface PlayerListProps {
  players: Player[];
  squad: SquadEntry[];
  activePos: string | null;
  onAdd: (player: Player) => void;
}

const POSITIONS: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "GK",  value: "GK" },
  { label: "DEF", value: "DEF" },
  { label: "MID", value: "MID" },
  { label: "FWD", value: "FWD" },
];

const POS_BADGE: Record<string, string> = {
  GK:  "bg-amber-100 text-amber-700",
  DEF: "bg-sky-100 text-sky-700",
  MID: "bg-emerald-100 text-emerald-700",
  FWD: "bg-rose-100 text-rose-700",
};

export default function PlayerList({ players, squad, activePos, onAdd }: PlayerListProps) {
  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState<string>(activePos ?? "ALL");

  const remaining = budgetLeft(squad);
  const query = search.trim().toLowerCase();

  const filtered = players.filter((p) => {
    const posMatch = posFilter === "ALL" || p.pos === posFilter;
    const searchMatch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      p.team.toLowerCase().includes(query);
    return posMatch && searchMatch;
  });

  return (
    <div className="glass-card rounded-2xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
          <h3 className="font-display font-bold text-gray-900 text-sm">Player list</h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {filtered.length} player{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2.5} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setSearch("")}
          placeholder="Search name or country…"
          className="w-full pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 tap-scale"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Position filter pills */}
      <div className="flex gap-1.5 mb-3 overflow-x-auto">
        {POSITIONS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPosFilter(p.value)}
            className={`tap-scale flex-shrink-0 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all ${
              posFilter === p.value
                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto flex flex-col gap-1 pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <SearchX className="w-8 h-8 mx-auto mb-2 opacity-30" strokeWidth={1.5} />
            No players found for &ldquo;{search}&rdquo;
            <br />
            <span className="text-xs">Try a different name or country</span>
          </div>
        ) : (
          filtered.map((p) => {
            const inSquad = isInSquad(squad, p.id);
            const cantAfford = p.price > remaining && !inSquad;

            return (
              <div
                key={p.id}
                onClick={() => !inSquad && !cantAfford && onAdd(p)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm tap-scale
                  ${inSquad
                    ? "bg-blue-50 ring-1 ring-blue-100 cursor-default"
                    : cantAfford
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                  }`}
              >
                <span className={`w-8 h-6 rounded-lg text-[9px] font-bold flex items-center justify-center flex-shrink-0 ${POS_BADGE[p.pos]}`}>
                  {p.pos}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-semibold text-gray-900 truncate"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(`${p.flag} ${p.name}`, query) }}
                  />
                  <div
                    className="text-xs text-gray-400 truncate font-medium"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(p.team, query) }}
                  />
                </div>
                <span className="font-bold text-gray-900 flex-shrink-0">${p.price}m</span>
                {inSquad ? (
                  <CheckCircle2 className="w-[18px] h-[18px] text-blue-600 flex-shrink-0" strokeWidth={2.5} />
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); !cantAfford && onAdd(p); }}
                    disabled={cantAfford}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-blue-600 hover:text-white transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
