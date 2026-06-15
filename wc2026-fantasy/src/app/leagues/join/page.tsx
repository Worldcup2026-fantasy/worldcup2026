"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { joinLeague } from "@/lib/leagues";
import { useAuth } from "@/lib/useAuth";
import { PartyPopper, Loader2, Link2, ArrowRight, AlertCircle } from "lucide-react";

function JoinLeagueForm() {
  const params    = useSearchParams();
  const router    = useRouter();
  const { userId, loading: authLoading } = useAuth();

  const [code, setCode]           = useState(params.get("code")?.toUpperCase() ?? "");
  const [status, setStatus]       = useState<"idle" | "joining" | "success" | "error">("idle");
  const [leagueName, setLeagueName] = useState("");
  const [error, setError]         = useState("");

  // Redirect to login if not signed in
  useEffect(() => {
    if (!authLoading && !userId) {
      router.push(`/auth/login?next=/leagues/join${code ? `?code=${code}` : ""}`);
    }
  }, [authLoading, userId, router, code]);

  // Auto-submit when both auth is resolved and code is in URL
  useEffect(() => {
    if (userId && code.length === 6 && status === "idle") {
      handleJoin(code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleJoin(c: string) {
    if (!userId) return;
    const clean = c.trim().toUpperCase();
    if (clean.length !== 6) { setError("Codes are exactly 6 characters."); return; }
    setStatus("joining");
    setError("");
    try {
      const league = await joinLeague(clean, userId);
      setLeagueName(league.name);
      setStatus("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "League not found. Check the code.");
      setStatus("error");
    }
  }

  // ── Loading / redirect ────────────────────────────────────────────
  if (authLoading || (!userId && !authLoading)) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center text-sm text-gray-400">
        {authLoading ? "Checking sign-in…" : "Redirecting…"}
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/25 mb-4">
          <PartyPopper className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-display font-extrabold text-gray-900 mb-2">You&apos;re in!</h2>
        <p className="text-gray-500 text-sm font-medium mb-6">
          You joined <strong>{leagueName}</strong>. Good luck!
        </p>
        <button
          onClick={() => router.push("/leagues")}
          className="tap-scale inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
        >
          View my leagues <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // ── Auto-joining spinner ──────────────────────────────────────────
  if (status === "joining") {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center">
        <Loader2 className="w-10 h-10 mx-auto mb-4 text-blue-600 animate-spin" strokeWidth={2.5} />
        <p className="text-sm text-gray-500 font-medium">Joining league with code <strong>{code}</strong>…</p>
      </div>
    );
  }

  // ── Manual entry form ─────────────────────────────────────────────
  return (
    <div className="max-w-sm mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-500/25 mb-4">
        <Link2 className="w-8 h-8 text-white" strokeWidth={2.5} />
      </div>
      <h1 className="text-2xl font-display font-extrabold text-gray-900 mb-2 tracking-tight">Join a league</h1>
      <p className="text-sm text-gray-400 font-medium mb-8">Enter the 6-character invite code from your friend.</p>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase().slice(0, 6)); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleJoin(code)}
          placeholder="LFC26A"
          maxLength={6}
          autoFocus
          className="w-full px-4 py-3 text-center text-2xl font-display font-extrabold tracking-widest border border-gray-200 rounded-2xl outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all uppercase"
        />
        {error && (
          <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4" strokeWidth={2.5} />{error}
          </p>
        )}
        <button
          onClick={() => handleJoin(code)}
          disabled={status === "joining" || code.length !== 6}
          className="tap-scale w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all disabled:opacity-50"
        >
          {status === "joining" ? "Joining…" : <>Join league <ArrowRight className="w-4 h-4" strokeWidth={2.5} /></>}
        </button>
        <button
          onClick={() => router.push("/leagues")}
          className="text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          Or create your own league
        </button>
      </div>
    </div>
  );
}

export default function JoinLeaguePage() {
  return (
    <Suspense fallback={
      <div className="max-w-sm mx-auto px-4 py-24 text-center text-sm text-gray-400">
        Loading…
      </div>
    }>
      <JoinLeagueForm />
    </Suspense>
  );
}
