"use client";

import { useState } from "react";
import { createLeague, joinLeague } from "@/lib/leagues";

type Mode = "create" | "join";

interface CreateJoinModalProps {
  userId: string;                                   // real Supabase user id
  onClose: () => void;
  onCreated: (name: string, code: string, leagueId: string) => void;
  onJoined:  (leagueName: string, code: string, leagueId: string) => void;
}

export default function CreateJoinModal({
  userId,
  onClose,
  onCreated,
  onJoined,
}: CreateJoinModalProps) {
  const [mode, setMode]           = useState<Mode>("create");
  const [leagueName, setLeagueName] = useState("");
  const [joinCode, setJoinCode]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // ── Create ────────────────────────────────────────────────────────
  const handleCreate = async () => {
    if (!leagueName.trim()) { setError("Enter a league name."); return; }
    setLoading(true);
    setError("");
    try {
      const { league, code } = await createLeague(leagueName.trim(), userId);
      onCreated(league.name, code, league.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Join ──────────────────────────────────────────────────────────
  const handleJoin = async () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) { setError("Codes are exactly 6 characters."); return; }
    setLoading(true);
    setError("");
    try {
      const league = await joinLeague(code, userId);
      onJoined(league.name, league.code, league.id);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "League not found. Check the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Leagues</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(["create", "join"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                mode === m
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {m === "create" ? "Create league" : "Join league"}
            </button>
          ))}
        </div>

        <div className="px-5 py-5">
          {mode === "create" ? (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Create a private league and invite friends with a 6-character code.
              </p>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">League name</label>
                <input
                  type="text"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="e.g. Lagos Office League"
                  maxLength={40}
                  autoFocus
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
                />
              </div>
              {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <button
                onClick={handleCreate}
                disabled={loading || !leagueName.trim()}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Creating…" : "Create league"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Enter the 6-character invite code your friend shared with you.
              </p>
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-1.5">Invite code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="LFC26A"
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-colors uppercase font-mono tracking-widest text-center text-lg"
                />
              </div>
              {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              <button
                onClick={handleJoin}
                disabled={loading || joinCode.length !== 6}
                className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {loading ? "Joining…" : "Join league"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
