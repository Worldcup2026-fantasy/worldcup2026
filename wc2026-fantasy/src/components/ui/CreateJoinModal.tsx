"use client";

import { useState } from "react";
import { createLeague, joinLeague } from "@/lib/leagues";
import { X, Trophy, AlertCircle, ArrowRight } from "lucide-react";

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
          <h2 className="font-display font-extrabold text-gray-900 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-600" strokeWidth={2.5} />
            Leagues
          </h2>
          <button onClick={onClose} className="tap-scale text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {(["create", "join"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
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
              <p className="text-sm text-gray-500 font-medium">
                Create a private league and invite friends with a 6-character code.
              </p>
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1.5">League name</label>
                <input
                  type="text"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                  placeholder="e.g. Lagos Office League"
                  maxLength={40}
                  autoFocus
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
              {error && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />{error}
                </p>
              )}
              <button
                onClick={handleCreate}
                disabled={loading || !leagueName.trim()}
                className="tap-scale w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all disabled:opacity-60"
              >
                {loading ? "Creating…" : <>Create league <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></>}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500 font-medium">
                Enter the 6-character invite code your friend shared with you.
              </p>
              <div>
                <label className="text-xs text-gray-500 font-bold block mb-1.5">Invite code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                  onKeyDown={(e) => e.key === "Enter" && handleJoin()}
                  placeholder="LFC26A"
                  maxLength={6}
                  autoFocus
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-2xl outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all uppercase font-display font-extrabold tracking-widest text-center text-lg"
                />
              </div>
              {error && (
                <p className="flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 rounded-xl px-3 py-2.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />{error}
                </p>
              )}
              <button
                onClick={handleJoin}
                disabled={loading || joinCode.length !== 6}
                className="tap-scale w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all disabled:opacity-60"
              >
                {loading ? "Joining…" : <>Join league <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
