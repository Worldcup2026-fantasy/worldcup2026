"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formation, Player, SquadEntry, SQUAD_SIZE, Gameweek } from "@/types";
import { budgetLeft, getSlotIds, isInSquad } from "@/lib/squad";
import { saveSquad, loadSquad } from "@/lib/squadDb";
import { fetchPlayers } from "@/lib/playersDb";
import { fetchActiveGameweek, isDeadlinePassed, deadlineCountdown } from "@/lib/gameweekDb";
import { useAuth } from "@/lib/useAuth";
import Pitch from "@/components/pitch/Pitch";
import Bench from "@/components/pitch/Bench";
import PlayerList from "@/components/ui/PlayerList";
import BudgetBar from "@/components/ui/BudgetBar";
import FormationPicker from "@/components/ui/FormationPicker";
import SquadSummary from "@/components/ui/SquadSummary";

type SaveState = "idle" | "saving" | "saved" | "error";

export default function SquadPicker() {
  const router = useRouter();
  const { userId, loading: authLoading } = useAuth();

  const [formation, setFormation]         = useState<Formation>("4-3-3");
  const [squad, setSquad]                 = useState<SquadEntry[]>([]);
  const [players, setPlayers]             = useState<Player[]>([]);
  const [activeGw, setActiveGw]           = useState<Gameweek | null>(null);
  const [activeSlot, setActiveSlot]       = useState<string | null>(null);
  const [activePos, setActivePos]         = useState<string | null>(null);
  const [tip, setTip]                     = useState("");
  const [saveState, setSaveState]         = useState<SaveState>("idle");
  const [loading, setLoading]             = useState(true);
  const [teamName, setTeamName]           = useState("");
  const [isDirty, setIsDirty]             = useState(false);
  const [countdown, setCountdown]         = useState("");

  const locked = activeGw ? isDeadlinePassed(activeGw) : false;

  // ── Redirect (middleware handles it server-side too) ──────────────
  useEffect(() => {
    if (!authLoading && !userId) router.push("/auth/login?next=/squad");
  }, [authLoading, userId, router]);

  // ── Load players + active GW + saved squad in parallel ────────────
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      fetchPlayers(),
      fetchActiveGameweek(),
      loadSquad(userId),
    ]).then(([fetchedPlayers, gw, saved]) => {
      setPlayers(fetchedPlayers);
      setActiveGw(gw);
      if (saved) {
        setFormation(saved.formation);
        setSquad(saved.entries);
        setTeamName(saved.teamName ?? "");
        setTip(isDeadlinePassed(gw)
          ? "🔒 Transfers are locked for this gameweek."
          : "Squad loaded! Make changes then save.");
      } else {
        setTip("Pick your 15 players within the $100m budget.");
      }
    }).catch(() => setTip("Error loading squad data."))
      .finally(() => setLoading(false));
  }, [userId]);

  // ── Live countdown ticker ─────────────────────────────────────────
  useEffect(() => {
    if (!activeGw?.deadline) return;
    const tick = () => setCountdown(deadlineCountdown(activeGw));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [activeGw]);

  // ── Mark dirty ────────────────────────────────────────────────────
  useEffect(() => { if (!loading) setIsDirty(true); }, [squad, formation]);

  // ── Slot interactions ─────────────────────────────────────────────
  const handleSlotClick = useCallback((slotId: string, pos: string) => {
    if (locked) { setTip("🔒 Transfers locked. Gameweek deadline has passed."); return; }
    setActiveSlot(slotId);
    setActivePos(pos === "ANY" ? null : pos);
    setTip(`Picking for ${slotId} — choose a player below`);
  }, [locked]);

  const handleRemove = useCallback((slotId: string) => {
    if (locked) { setTip("🔒 Locked — deadline passed."); return; }
    setSquad((prev) => prev.filter((e) => e.slot !== slotId));
    setTip("Player removed.");
  }, [locked]);

  const handleSetCaptain = useCallback((slotId: string) => {
    setSquad((prev) => prev.map((e) => ({ ...e, isCaptain: e.slot === slotId })));
    setTip("Captain set! ⚽ Double points.");
  }, []);

  // ── Add player ────────────────────────────────────────────────────
  const handleAdd = useCallback((player: Player) => {
    if (locked) { setTip("🔒 Transfers locked."); return; }
    if (isInSquad(squad, player.id)) return;
    if (player.price > budgetLeft(squad)) { setTip("Not enough budget."); return; }

    let targetSlot = activeSlot;
    if (!targetSlot) {
      const slots = getSlotIds(formation);
      const posSlots = slots.filter((s) => s.startsWith(player.pos) || s.startsWith("BENCH"));
      targetSlot = posSlots.find((s) => !squad.some((e) => e.slot === s)) ?? null;
      if (!targetSlot) { setTip(`No free ${player.pos} slots.`); return; }
    }

    setSquad((prev) => [
      ...prev.filter((e) => e.slot !== targetSlot),
      { player, slot: targetSlot!, isCaptain: false },
    ]);
    setActiveSlot(null);
    setActivePos(null);
    setTip(`${player.name} added!`);
  }, [squad, activeSlot, formation, locked]);

  // ── Formation change ──────────────────────────────────────────────
  const handleFormationChange = useCallback((f: Formation) => {
    if (locked) return;
    setFormation(f);
    setSquad((prev) => prev.filter((e) => e.slot === "GK0" || e.slot.startsWith("BENCH")));
    setTip(`Formation → ${f}. Re-pick outfield.`);
  }, [locked]);

  // ── Save ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!userId) return;
    if (locked) { setTip("🔒 Deadline passed — squad is locked."); return; }
    if (squad.length < 11) { setTip("Pick at least 11 players first."); return; }
    setSaveState("saving");
    try {
      await saveSquad(userId, formation, squad, teamName || undefined);
      setSaveState("saved");
      setIsDirty(false);
      setTip("Squad saved! ✅");
      setTimeout(() => setSaveState("idle"), 3000);
    } catch (e: unknown) {
      setSaveState("error");
      setTip(e instanceof Error ? e.message : "Save failed.");
      setTimeout(() => setSaveState("idle"), 4000);
    }
  };

  const handleReset = () => {
    if (locked) return;
    if (squad.length > 0 && !confirm("Reset squad? Unsaved changes will be lost.")) return;
    setSquad([]); setFormation("4-3-3"); setTip("Squad reset."); setIsDirty(false);
  };

  const remaining = budgetLeft(squad);

  // ── Skeleton ──────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-6 animate-pulse">
        <div className="h-7 bg-gray-100 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-100 rounded w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          <div className="bg-gray-100 rounded-2xl" style={{ height: 420 }} />
          <div className="flex flex-col gap-4">
            {[1,2,3].map(i => <div key={i} className="bg-gray-100 rounded-2xl h-24" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">Pick your squad</h1>
          <p className="text-sm text-gray-400 mt-1">
            World Cup 2026 · {activeGw?.label} · $100m budget
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Deadline chip */}
          {countdown && (
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${
              locked
                ? "bg-red-50 text-red-600 border-red-200"
                : countdown.includes("m") && !countdown.includes("h")
                ? "bg-amber-50 text-amber-600 border-amber-200"
                : "bg-green-50 text-green-600 border-green-200"
            }`}>
              {locked ? "🔒 Locked" : `⏰ ${countdown} left`}
            </span>
          )}
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name"
            maxLength={30}
            disabled={locked}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-blue-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left — Pitch */}
        <div className="flex flex-col gap-4">
          <Pitch formation={formation} squad={squad}
            onSlotClick={handleSlotClick} onRemove={handleRemove} onSetCaptain={handleSetCaptain} />
          <Bench squad={squad} onSlotClick={handleSlotClick} onRemove={handleRemove} />

          {/* Tip */}
          <p className={`text-xs text-center rounded-xl py-2 px-4 ${
            locked ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-400"
          }`}>{tip || "Tap an empty shirt to pick a player"}</p>

          {/* Unsaved indicator */}
          {isDirty && squad.length > 0 && !locked && saveState === "idle" && (
            <p className="text-xs text-center text-amber-600 bg-amber-50 rounded-xl py-2 px-4">
              ● Unsaved changes
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleReset} disabled={locked}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Reset
            </button>
            <button onClick={handleSave} disabled={saveState === "saving" || locked}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-60 ${
                locked             ? "bg-gray-200 text-gray-400 cursor-not-allowed" :
                saveState==="saved" ? "bg-green-600 text-white" :
                saveState==="error" ? "bg-red-600 text-white" :
                "bg-blue-600 text-white hover:bg-blue-700"
              }`}>
              {locked ? "🔒 Locked" :
               saveState==="saving" ? "Saving…" :
               saveState==="saved"  ? "✓ Saved!" :
               saveState==="error"  ? "Failed" : "Save squad"}
            </button>
          </div>
        </div>

        {/* Right — Controls */}
        <div className="flex flex-col gap-4">
          <BudgetBar remaining={remaining} picked={squad.length} total={SQUAD_SIZE} />
          <FormationPicker current={formation} onChange={handleFormationChange} />
          <PlayerList players={players} squad={squad} activePos={activePos} onAdd={handleAdd} />
          <SquadSummary squad={squad} />
        </div>
      </div>
    </div>
  );
}
