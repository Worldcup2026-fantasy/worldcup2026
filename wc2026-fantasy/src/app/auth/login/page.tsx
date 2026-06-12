"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";

function LoginForm() {
  const router       = useRouter();
  const params       = useSearchParams();
  const next         = params.get("next") ?? "/squad";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode]         = useState<"login" | "signup">("login");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(next);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm">
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account, then sign in.
        </p>
        <button
          onClick={() => { setSent(false); setMode("login"); }}
          className="mt-6 text-sm text-blue-600 hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <span className="text-4xl">⚽</span>
        <h1 className="text-2xl font-semibold text-gray-900 mt-3 tracking-tight">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {mode === "login" ? "Sign in to manage your squad" : "Join WC2026 Fantasy"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 font-medium block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="At least 6 characters"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 mt-1"
        >
          {loading ? "Loading…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-400 mt-6">
        {mode === "login" ? "No account yet? " : "Already have one? "}
        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          className="text-blue-600 hover:underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto px-4 py-24 text-center text-sm text-gray-400">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
