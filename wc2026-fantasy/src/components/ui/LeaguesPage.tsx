"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { League, LeagueMember } from "@/types";
import {
  fetchMyLeagues,
  fetchLeagueStandings,
  leaveLeague,
  deleteLeague,
} from "@/lib/leagues";
import { useAuth } from "@/lib/useAuth";
import LeagueCard from "@/components/ui/LeagueCard";
import LeagueStandingsTable from "@/components/ui/LeagueStandingsTable";
import InviteCodeDisplay from "@/components/ui/InviteCodeDisplay";
import CreateJoinModal from "@/components/ui/CreateJoinModal";
import { Trophy, Plus, Users, ArrowLeft, Trash2, LogOut, RefreshCw } from "lucide-react";

type View = "list" | "detail";

export default function LeaguesPage() {
  const router = useRouter();
  const { user, userId, loading: authLoading } = useAuth();

  const [leagues, setLeagues]           = useState<League[]>([]);
  const [standings, setStandings]       = useState<LeagueMember[]>([]);
  const [view, setView]                 = useState<View>("list");
  const [activeLeague, setActiveLeague] = useState<League | null>(null);
  const [showModal, setShowModal]       = useState(false);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast]               = useState<string | null>(null);

  // ── Toast ─────────────────────────────────────────────────────────
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── Load leagues on mount (once auth resolves) ────────────────────
  const loadLeagues = useCallback(async () => {
    if (!userId) return;
    setLoadingLeagues(true);
    try {
      const data = await fetchMyLeagues(userId);
      setLeagues(data);
    } catch (e) {
      showToast("Couldn't load your leagues. Please refresh.");
    } finally {
      setLoadingLeagues(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!authLoading) {
      if (!userId) {
        router.push("/auth/login");
        return;
      }
      loadLeagues();
    }
  }, [authLoading, userId, loadLeagues, router]);

  // ── Load standings when a league is opened ────────────────────────
  const openLeague = useCallback(async (league: League) => {
    setActiveLeague(league);
    setView("detail");
    setLoadingStandings(true);
    try {
      const data = await fetchLeagueStandings(league.id);
      setStandings(data);
    } catch {
      showToast("Couldn't load standings.");
    } finally {
      setLoadingStandings(false);
    }
  }, []);

  function goBack() {
    setView("list");
    setActiveLeague(null);
    setStandings([]);
  }

  // ── Modal callbacks — called after real Supabase actions succeed ──
  function handleCreated(name: string, code: string, leagueId: string) {
    const newLeague: League = {
      id: leagueId,
      name,
      code,
      createdBy: userId!,
      createdAt: new Date().toISOString(),
      memberCount: 1,
      isAdmin: true,
    };
    setLeagues((prev) => [newLeague, ...prev]);
    setShowModal(false);
    openLeague(newLeague);
    showToast(`League "${name}" created! Share the code: ${code}`);
  }

  function handleJoined(leagueName: string, code: string, leagueId: string) {
    const joined: League = {
      id: leagueId,
      name: leagueName,
      code,
      createdBy: "",
      createdAt: new Date().toISOString(),
      memberCount: 0,
      isAdmin: false,
    };
    setLeagues((prev) => [...prev, joined]);
    setShowModal(false);
    openLeague(joined);
    showToast(`Joined "${leagueName}"! Good luck!`);
  }

  // ── Leave / delete ────────────────────────────────────────────────
  async function handleLeave(league: League) {
    const label = league.isAdmin ? "delete" : "leave";
    if (!confirm(`Are you sure you want to ${label} "${league.name}"?`)) return;
    setActionLoading(true);
    try {
      if (league.isAdmin) {
        await deleteLeague(league.id);
      } else {
        await leaveLeague(league.id, userId!);
      }
      setLeagues((prev) => prev.filter((l) => l.id !== league.id));
      if (activeLeague?.id === league.id) goBack();
      showToast(`${league.isAdmin ? "Deleted" : "Left"} "${league.name}"`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Action failed. Try again.");
    } finally {
      setActionLoading(false);
    }
  }

  // ── My rank in a league ───────────────────────────────────────────
  function myRank(leagueId: string) {
    return standings.find((m) => m.userId === userId)?.rank;
  }

  // ── Loading / auth guard ──────────────────────────────────────────
  if (authLoading || (!userId && !authLoading)) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">
        {authLoading ? "Loading…" : "Redirecting to sign in…"}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg pointer-events-none">
          {toast}
        </div>
      )}

      {/* Modal — only rendered when user is signed in */}
      {showModal && userId && (
        <CreateJoinModal
          userId={userId}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
          onJoined={handleJoined}
        />
      )}

      {/* ── List view ──────────────────────────────────────────────── */}
      {view === "list" && (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
                <Trophy className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-display font-extrabold text-gray-900 tracking-tight">My Leagues</h1>
                <p className="text-sm text-gray-400 font-medium mt-0.5">Compete privately with friends</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="tap-scale bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold px-4 py-2.5 rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} /> New league
            </button>
          </div>

          {loadingLeagues ? (
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
                  <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : leagues.length === 0 ? (
            <div className="text-center py-16 glass-card rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-500/25 mb-4">
                <Trophy className="w-8 h-8 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-display font-extrabold text-gray-900 mb-2">No leagues yet</h2>
              <p className="text-sm text-gray-400 font-medium mb-6">Create a private league and challenge your friends.</p>
              <button
                onClick={() => setShowModal(true)}
                className="tap-scale bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
              >
                Create your first league
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {leagues.map((league) => (
                <LeagueCard
                  key={league.id}
                  league={league}
                  userRank={myRank(league.id)}
                  onClick={() => openLeague(league)}
                  onLeave={() => handleLeave(league)}
                />
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 font-medium">
              Got a code?{" "}
              <button onClick={() => setShowModal(true)} className="text-blue-600 font-bold hover:underline">
                Join a league
              </button>
            </p>
          </div>
        </>
      )}

      {/* ── Detail view ─────────────────────────────────────────────── */}
      {view === "detail" && activeLeague && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <button onClick={goBack} className="tap-scale text-gray-400 hover:text-gray-700 text-sm font-bold flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" strokeWidth={2.5} /> Back
            </button>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-display font-extrabold text-gray-900 truncate">{activeLeague.name}</h1>
              <p className="text-xs text-gray-400 font-medium">
                {activeLeague.memberCount} member{activeLeague.memberCount !== 1 ? "s" : ""} ·{" "}
                {activeLeague.isAdmin ? "You admin this league" : "Member"}
              </p>
            </div>
            <button
              onClick={() => handleLeave(activeLeague)}
              disabled={actionLoading}
              className="tap-scale flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-rose-500 transition-colors px-3 py-2 rounded-xl bg-gray-50 hover:bg-rose-50 flex-shrink-0 disabled:opacity-50"
            >
              {activeLeague.isAdmin ? <Trash2 className="w-3.5 h-3.5" strokeWidth={2.5} /> : <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />}
              {actionLoading ? "…" : activeLeague.isAdmin ? "Delete" : "Leave"}
            </button>
          </div>

          {/* Invite code */}
          <div className="mb-5">
            <InviteCodeDisplay code={activeLeague.code} leagueName={activeLeague.name} />
          </div>

          {/* Standings */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-display font-bold text-gray-700">Standings</h2>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">GW3 · Live</span>
          </div>

          {loadingStandings ? (
            <div className="glass-card rounded-2xl p-8 text-center text-sm font-medium text-gray-400 animate-pulse">
              Loading standings…
            </div>
          ) : standings.length <= 1 ? (
            <div className="glass-card rounded-2xl p-8 text-center">
              <Users className="w-9 h-9 mx-auto mb-3 text-gray-300" strokeWidth={1.5} />
              <p className="font-display font-bold text-gray-900 mb-1">Just you so far</p>
              <p className="text-sm text-gray-400 font-medium">Share the code above to invite friends.</p>
            </div>
          ) : (
            <LeagueStandingsTable members={standings} currentUserId={userId ?? undefined} />
          )}

          <p className="flex items-center justify-center gap-1.5 text-xs font-medium text-center text-gray-400 mt-4 bg-gray-50 rounded-2xl py-3 px-4">
            <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.5} />
            Points update automatically after each match.
          </p>
        </>
      )}
    </div>
  );
}
