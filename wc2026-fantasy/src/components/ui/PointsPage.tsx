"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlayerPointsRow, SquadEntry, Gameweek, PlayerEvent } from "@/types";
import { calcPoints, mockGameweekEvents, emptyEvent } from "@/lib/scoring";
import { loadSquad } from "@/lib/squadDb";
import { fetchAllGameweeks, fetchActiveGameweek } from "@/lib/gameweekDb";
import { fetchPointsLog } from "@/lib/pointsDb";
import { fetchPlayers } from "@/lib/playersDb";
import { useAuth } from "@/lib/useAuth";
import GameweekSelector from "@/components/ui/GameweekSelector";
import PlayerPointsCard from "@/components/ui/PlayerPointsCard";
import PointsSummaryCard from "@/components/ui/PointsSummaryCard";
import ScoringRulesPanel from "@/components/ui/ScoringRulesPanel";

type SortKey = "points" | "name" | "pos";

export default function PointsPage() {
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();

  const [gameweeks, setGameweeks]       = useState<Gameweek[]>([]);
  const [activeGw, setActiveGw]         = useState<Gameweek | null>(null);
  const [selectedGwId, setSelectedGwId] = useState<number | null>(null);
  const [squad, setSquad]               = useState<SquadEntry[]>([]);
  const [events, setEvents]             = useState<Record<number, PlayerEvent>>({});
  const [loading, setLoading]           = useState(true);
  const [sort, setSort]                 = useState<SortKey>("points");
  const [showBench, setShowBench]       = useState(true);

  // Auth guard (middleware covers it server-side too)
  useEffect(() => {
    if (!authLoading && !userId) router.push("/auth/login?next=/points");
  }, [authLoading, userId, router]);

  // Initial load: gameweeks + squad
  useEffect(() => {
    if (!userId) return;
    Promise.all([fetchAllGameweeks(), fetchActiveGameweek(), loadSquad(userId), fetchPlayers()])
      .then(([gws, active, saved, _players]) => {
        setGameweeks(gws);
        setActiveGw(active);
        setSelectedGwId(active.id);
        if (saved) setSquad(saved.entries);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  // Load points when gameweek changes
  useEffect(() => {
    if (selectedGwId === null || squad.length === 0) return;
    const gwIsActive = activeGw?.id === selectedGwId;
    fetchPointsLog(selectedGwId).then((log) => {
      if (Object.keys(log).length === 0 && gwIsActive) {
        // No DB data yet — use mock for active GW demo
        setEvents(mockGameweekEvents(squad.map((e) => e.player.id)));
      } else {
        setEvents(log);
      }
    });
  }, [selectedGwId, squad, activeGw]);

  const selectedGw = gameweeks.find((g) => g.id === selectedGwId) ?? activeGw;

  // Build rows
  const rows: PlayerPointsRow[] = useMemo(() => {
    return squad.map((entry) => {
      const event = events[entry.player.id] ?? emptyEvent();
      return {
        player:    entry.player,
        event,
        breakdown: calcPoints(entry.player, event),
        isCaptain: entry.isCaptain,
        isBench:   entry.slot.startsWith("BENCH"),
      };
    });
  }, [squad, events]);

  // Sort
  const sorted = useMemo(() => {
    return [...rows].sort((a, b) => {
      if (sort === "points") {
        const ap = a.isCaptain ? a.breakdown.total * 2 : a.breakdown.total;
        const bp = b.isCaptain ? b.breakdown.total * 2 : b.breakdown.total;
        return bp - ap;
      }
      if (sort === "name") return a.player.name.localeCompare(b.player.name);
      const order = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
      return order[a.player.pos] - order[b.player.pos];
    });
  }, [rows, sort]);

  const starters = sorted.filter((r) => !r.isBench);
  const bench    = sorted.filter((r) => r.isBench);

  const totalPoints = rows
    .filter((r) => !r.isBench)
    .reduce((sum, r) => sum + (r.isCaptain ? r.breakdown.total * 2 : r.breakdown.total), 0);

  const captain       = rows.find((r) => r.isCaptain);
  const captainPoints = captain?.breakdown.total ?? 0;
  const topScorer     = [...rows].sort((a, b) => b.breakdown.total - a.breakdown.total)[0];

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-36 mb-8" />
        <div className="h-36 bg-gray-100 rounded-2xl mb-4" />
        <div className="flex flex-col gap-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (squad.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h2 className="text-lg font-medium text-gray-900 mb-2">No squad yet</h2>
        <p className="text-sm text-gray-400 mb-6">Pick your squad first to see your points.</p>
        <a href="/squad" className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
          Pick squad →
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Points</h1>
        <p className="text-sm text-gray-400 mt-1">Your squad's performance each gameweek</p>
      </div>

      {/* Gameweek selector */}
      <div className="mb-5">
        <GameweekSelector
          gameweeks={gameweeks}
          selected={selectedGwId ?? 0}
          onChange={setSelectedGwId}
        />
      </div>

      {/* Hero */}
      {selectedGw && (
        <div className="mb-5">
          <PointsSummaryCard
            gameweek={selectedGw}
            totalPoints={totalPoints}
            captainPoints={captainPoints}
            captainName={captain?.player.name ?? "—"}
            highestScorer={{
              name:   topScorer?.player.name ?? "—",
              points: topScorer?.breakdown.total ?? 0,
              flag:   topScorer?.player.flag ?? "",
            }}
          />
        </div>
      )}

      {/* Rules */}
      <div className="mb-5"><ScoringRulesPanel /></div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {(["points", "pos", "name"] as SortKey[]).map((k) => (
            <button key={k} onClick={() => setSort(k)}
              className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors ${
                sort === k ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-500 hover:border-gray-400"
              }`}>{k}</button>
          ))}
        </div>
        <button onClick={() => setShowBench((b) => !b)}
          className="text-xs text-gray-400 hover:text-gray-600 underline underline-offset-2 decoration-dashed">
          {showBench ? "Hide bench" : "Show bench"}
        </button>
      </div>

      {/* Starters */}
      <div className="flex flex-col gap-2 mb-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-1">Starting XI</p>
        {starters.map((row) => <PlayerPointsCard key={row.player.id} row={row} />)}
      </div>

      {/* Bench */}
      {showBench && bench.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest px-1">Bench</p>
          {bench.map((row) => <PlayerPointsCard key={row.player.id} row={row} />)}
        </div>
      )}

      <p className="text-xs text-center text-gray-400 mt-6 bg-gray-50 rounded-xl py-3 px-4">
        Points sync automatically after each match via Supabase Edge Function.
      </p>
    </div>
  );
}
