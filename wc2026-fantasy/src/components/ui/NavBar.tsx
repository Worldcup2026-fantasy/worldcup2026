"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { createClient } from "@/lib/supabase";
import {
  Shirt, TrendingUp, Trophy, Repeat, BarChart3, LogOut, Crown,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/squad",       label: "Squad",      icon: Shirt },
  { href: "/points",      label: "Points",     icon: TrendingUp },
  { href: "/transfers",   label: "Transfers",  icon: Repeat },
  { href: "/leagues",     label: "Leagues",    icon: Trophy },
  { href: "/leaderboard", label: "Ranks",      icon: BarChart3 },
];

export default function NavBar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, loading } = useAuth();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      {/* Top bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-sm">
              <Crown className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-extrabold text-gray-900 tracking-tight text-base">
              WC<span className="text-blue-600">26</span> Fantasy
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="w-8 h-8 bg-gray-100 rounded-full animate-pulse" />
            ) : user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-rose-600 transition-colors px-2 py-1.5 rounded-lg"
                title={user.email}
              >
                <span className="hidden sm:block text-xs text-gray-400 truncate max-w-[120px]">
                  {user.email}
                </span>
                <LogOut className="w-4 h-4" strokeWidth={2} />
              </button>
            ) : (
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-semibold px-4 py-1.5 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-100 px-2 py-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-around">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl tap-scale transition-colors ${
                  active ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div className={`p-1.5 rounded-xl transition-colors ${active ? "bg-blue-50" : ""}`}>
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}>{label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer so content doesn't hide behind bottom bar on mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
