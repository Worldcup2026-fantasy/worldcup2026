"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Trophy, Mail, Lock, MailCheck, ArrowRight, AlertCircle } from "lucide-react";

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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-500/25 mb-4">
          <MailCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h2 className="text-xl font-display font-extrabold text-gray-900 mb-2">Check your email</h2>
        <p className="text-gray-500 text-sm">
          We sent a confirmation link to <strong>{email}</strong>.
          Click it to activate your account, then sign in.
        </p>
        <button
          onClick={() => { setSent(false); setMode("login"); }}
          className="mt-6 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-lg shadow-blue-500/25 mb-3">
          <Trophy className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-2xl font-display font-extrabold text-gray-900 tracking-tight">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-sm text-gray-400 font-medium mt-1">
          {mode === "login" ? "Sign in to manage your squad" : "Join WC26 Fantasy"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-gray-500 font-bold block mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-2xl outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 font-bold block mb-1.5">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={2.5} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-2xl outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>
        {error && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-xl px-4 py-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" strokeWidth={2.5} />
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="tap-scale w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all disabled:opacity-60 mt-1"
        >
          {loading ? "Loading…" : (
            <>
              {mode === "login" ? "Sign in" : "Create account"}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>

      <p className="text-sm text-center text-gray-400 mt-6 font-medium">
        {mode === "login" ? "No account yet? " : "Already have one? "}
        <button
          onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
          className="text-blue-600 font-bold hover:underline"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="max-w-sm mx-auto px-4 py-24 text-center text-sm text-gray-400">
        Loading…
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
