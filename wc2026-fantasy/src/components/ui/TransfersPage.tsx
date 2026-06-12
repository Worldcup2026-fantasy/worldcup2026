"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Player, SquadEntry, Transfer } from "@/types";
import { fetchPlayers } from "@/lib/playersDb";
import { loadSquad, saveSquad } from "@/lib/squadDb";
import { fetchTransfers, transfersUsedThisGw } from "@/lib/transfers";
import { fetchActiveGameweek, isDeadlinePassed, deadlineCountdown } from "@/lib/gameweekDb";
import { budgetLeft, isInSquad } from "@/lib/squad";
import { useAuth } from "@/lib/useAuth";

const POS_BADGE: Record<string, string> = {
  GK:  "bg-amber-100 text-amber-800",
  DEF: "bg-blue-100 text-blue-800",
  MID: "bg-green-100 text-green-800",
  FWD: "bg-red-100 text-red-800",
};

export default function TransfersPage() {
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();

  const [players, setPlayers]         = useState<Player[]>([]);
  const [squad, setSquad]             = useState<SquadEntry[]>([]);
  const [squadId, setSquadId]         = useState<string | null>(null);
  const [history, setHistory]         = useState<Transfer[]>([]);
  const [gwTransfers, setGwTransfers] = useState(0);
  const [activeGw, setActiveGw]       = useState<any>(null);
  const [loading, setLoading]         = useState(true);
  const [selecting, setSelecting]     = useState<SquadEntry | null>(null); // player being swapped out
  const [search, setSearch]           = useState("");
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState<string | null>(null);

  const locked = activeGw ? isDeadlinePassed(activeGw) : false;
  const freeTransfers = 1;
  const extraCost = Math.max(0, gwTransfers - freeTransfers) * 4; // -4pts each

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    if (!authLoading && !userId) { router.push("/auth/login?next=/transfers"); return; }
    if (!userId) return;

    setLoading(true);
    Promise.all([
      fetchPlayers(),
      loadSquad(userId),
      fetchTransfers(userId),
      fetchActiveGameweek(),
    ]).then(async ([fetchedPlayers, saved, transfers, gw]) => {
      setPlayers(fetchedPlayers);
      setActiveGw(gw);
      setHistory(transfers);
      if (saved) {
        setSquad(saved.entries);
        setSquadId(saved.squadId);
      }
      const used = await transfersUsedThisGw(userId, gw.id);
      setGwTransfers(used);
    }).catch(() => showToast("Error loading transfer data."))
      .finally(() => setLoading(false));
  }, [userId, authLoading, router]);

  // Candidates: same position as selected player, not already in squad
  const candidates = useMemo(() => {
    if (!selecting) return [];
    const q = search.toLowerCase();
    return players.filter((p) => {
      const posMatch = p.pos === selecting.player.pos;
      const notInSquad = !isInSquad(squad, p.id) || p.id === selecting.player.id;
      const searchMatch = !q || p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q);
      const budget = budgetLeft(squad) + selecting.player.price; // freed budget
      const affordable = p.price <= budget;
      return posMatch && notInSquad && searchMatch && affordable;
    });
  }, [selecting, players, squad, search]);

  async function handleSwap(playerIn: Player) {
    if (!selecting || !userId || !squadId || locked) return;
    setSaving(true);
    try {
      // Update local squad
      const newSquad = squad.map((e) =>
        e.slot === selecting.slot ? { ...e, player: playerIn } : e
      );
      setSquad(newSquad);

      // Save to DB
      await saveSquad(userId, "4-3-3", newSquad);

      setGwTransfers((n) => n + 1);
      setHistory((prev) => [{
        id: Date.now().toString(),
        userId,
        gameweekId: activeGw?.id ?? 0,
        playerOutId: selecting.player.id,
        playerInId:  playerIn.id,
        playerOut:   selecting.player,
        playerIn,
        createdAt: new Date().toISOString(),
      }, ...prev]);

      setSelecting(null);
      setSearch("");
      showToast(`✓ ${selecting.player.name} → ${playerIn.name}`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Transfer failed.");
      // Revert
      setSquad(squad);
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-40 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 rounded-2xl h-80" />
          <div className="bg-gray-100 rounded-2xl h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Transfers</h1>
          <p className="text-sm text-gray-400 mt-1">{activeGw?.label} · Swap players in your squad</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {activeGw && (
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
              locked ? "bg-red-50 text-red-600 border-red-200"
                     : "bg-green-50 text-green-600 border-green-200"
            }`}>
              {locked ? "🔒 Locked" : `⏰ ${deadlineCountdown(activeGw)} left`}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {gwTransfers}/{freeTransfers} free · {extraCost > 0 ? `-${extraCost} pts cost` : "no penalty"}
          </span>
        </div>
      </div>

      {locked && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl px-4 py-3 mb-5">
          🔒 The deadline for {activeGw?.label} has passed. Transfers reopen next gameweek.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Current squad */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-medium text-gray-900 text-sm mb-3">
            {selecting ? `Swapping out: ${selecting.player.name}` : "Your squad — tap to swap"}
          </h3>
          <div className="flex flex-col gap-2">
            {squad
              .filter((e) => !e.slot.startsWith("BENCH"))
              .concat(squad.filter((e) => e.slot.startsWith("BENCH")))
              .map((entry) => (
                <div
                  key={entry.slot}
                  onClick={() => !locked && setSelecting(selecting?.slot === entry.slot ? null : entry)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                    selecting?.slot === entry.slot
                      ? "border-blue-400 bg-blue-50"
                      : locked ? "border-gray-100 opacity-60 cursor-not-allowed"
                      : "border-gray-100 hover:border-blue-200 hover:bg-blue-50/50"
                  }`}
                >
                  <span className={`text-[9px] font-semibold w-7 h-5 flex items-center justify-center rounded flex-shrink-0 ${POS_BADGE[entry.player.pos]}`}>
                    {entry.player.pos}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {entry.player.flag} {entry.player.name}
                      {entry.isCaptain && <span className="ml-1 text-[9px] text-amber-600">(C)</span>}
                    </p>
                    <p className="text-xs text-gray-400">{entry.player.team}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-600 flex-shrink-0">${entry.player.price}m</span>
                  {entry.slot.startsWith("BENCH") && (
                    <span className="text-[9px] text-gray-400 flex-shrink-0">SUB</span>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Replacement picker */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h3 className="font-medium text-gray-900 text-sm mb-3">
            {selecting ? `Pick replacement ${selecting.player.pos}` : "Select a player to swap"}
          </h3>
          {!selecting ? (
            <div className="flex items-center justify-center h-48 text-gray-300 text-sm">
              ← Tap a player to begin
            </div>
          ) : (
            <>
              <div className="relative mb-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or country…"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">🔍</span>
              </div>
              <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
                {candidates.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">No eligible players found</p>
                ) : candidates.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => !saving && handleSwap(p)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.flag} {p.name}</p>
                      <p className="text-xs text-gray-400">{p.team}</p>
                    </div>
                    <span className="text-xs font-medium text-gray-600">${p.price}m</span>
                    <span className="text-xs text-blue-500">Select →</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transfer history */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <h3 className="font-medium text-gray-900 text-sm mb-3">Transfer history</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">No transfers yet this tournament</p>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((t) => (
              <div key={t.id} className="flex items-center gap-3 text-sm py-2 border-b border-gray-50 last:border-0">
                <span className="text-gray-400 text-xs flex-shrink-0">GW{t.gameweekId}</span>
                <span className="text-red-500 truncate flex-1">{t.playerOut?.flag} {t.playerOut?.name ?? `#${t.playerOutId}`}</span>
                <span className="text-gray-300 flex-shrink-0">→</span>
                <span className="text-green-600 truncate flex-1">{t.playerIn?.flag} {t.playerIn?.name ?? `#${t.playerInId}`}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">
                  {new Date(t.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
