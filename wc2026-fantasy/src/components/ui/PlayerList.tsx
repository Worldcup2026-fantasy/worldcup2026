"use client";

import { useState } from "react";
import { Player, Position, SquadEntry } from "@/types";
import { isInSquad, budgetLeft, highlightMatch } from "@/lib/squad";

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
  GK:  "bg-amber-100 text-amber-800",
  DEF: "bg-blue-100 text-blue-800",
  MID: "bg-green-100 text-green-800",
  FWD: "bg-red-100 text-red-800",
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
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">Player list</h3>
        <span className="text-xs text-gray-400">
          {filtered.length} player{filtered.length !== 1 ? "s" : ""}
          {query ? ` matching "${search}"` : ""}
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setSearch("")}
          placeholder="Search by name or country…"
          className="w-full pl-9 pr-8 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:bg-white transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Position filter pills */}
      <div className="flex gap-2 flex-wrap mb-3">
        {POSITIONS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPosFilter(p.value)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              posFilter === p.value
                ? "bg-blue-600 text-white border-blue-600"
                : "border-gray-200 text-gray-500 hover:border-gray-400"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="max-h-64 overflow-y-auto flex flex-col gap-1 pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            <div className="text-3xl mb-2 opacity-40">🔍</div>
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors text-sm
                  ${inSquad
                    ? "border-blue-200 bg-blue-50 cursor-default"
                    : cantAfford
                    ? "border-transparent opacity-40 cursor-not-allowed"
                    : "border-transparent hover:bg-gray-50 cursor-pointer"
                  }`}
              >
                <span className={`w-7 h-5 rounded text-[9px] font-semibold flex items-center justify-center flex-shrink-0 ${POS_BADGE[p.pos]}`}>
                  {p.pos}
                </span>
                <div className="flex-1 min-w-0">
                  <div
                    className="font-medium text-gray-900 truncate"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(`${p.flag} ${p.name}`, query) }}
                  />
                  <div
                    className="text-xs text-gray-400 truncate"
                    dangerouslySetInnerHTML={{ __html: highlightMatch(p.team, query) }}
                  />
                </div>
                <span className="font-medium text-gray-900 flex-shrink-0">${p.price}m</span>
                {inSquad ? (
                  <span className="text-xs text-blue-600 flex-shrink-0">✓ In squad</span>
                ) : (
                  <button
                    onClick={(e) => { e.stopPropagation(); !cantAfford && onAdd(p); }}
                    disabled={cantAfford}
                    className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
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
