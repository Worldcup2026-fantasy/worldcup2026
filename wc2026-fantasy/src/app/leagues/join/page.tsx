"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { joinLeague } from "@/lib/leagues";
import { useAuth } from "@/lib/useAuth";

export default function JoinLeaguePage() {
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
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">You&apos;re in!</h2>
        <p className="text-gray-500 text-sm mb-6">
          You joined <strong>{leagueName}</strong>. Good luck!
        </p>
        <button
          onClick={() => router.push("/leagues")}
          className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          View my leagues
        </button>
      </div>
    );
  }

  // ── Auto-joining spinner ──────────────────────────────────────────
  if (status === "joining") {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center">
        <div className="text-4xl mb-4 animate-spin inline-block">⚙️</div>
        <p className="text-sm text-gray-500">Joining league with code <strong>{code}</strong>…</p>
      </div>
    );
  }

  // ── Manual entry form ─────────────────────────────────────────────
  return (
    <div className="max-w-sm mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">🔗</div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2 tracking-tight">Join a league</h1>
      <p className="text-sm text-gray-400 mb-8">Enter the 6-character invite code from your friend.</p>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase().slice(0, 6)); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleJoin(code)}
          placeholder="LFC26A"
          maxLength={6}
          autoFocus
          className="w-full px-4 py-3 text-center text-2xl font-mono font-bold tracking-widest border border-gray-200 rounded-2xl outline-none focus:border-blue-400 transition-colors uppercase"
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>
        )}
        <button
          onClick={() => handleJoin(code)}
          disabled={status === "joining" || code.length !== 6}
          className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {status === "joining" ? "Joining…" : "Join league"}
        </button>
        <button
          onClick={() => router.push("/leagues")}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Or create your own league
        </button>
      </div>
    </div>
  );
}
