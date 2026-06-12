"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import { createClient } from "@/lib/supabase";

const NAV_LINKS = [
  { href: "/squad",       label: "My Squad" },
  { href: "/points",      label: "Points" },
  { href: "/leagues",     label: "Leagues" },
  { href: "/transfers", label: "Transfers" },
  { href: "/leaderboard", label: "Leaderboard" },
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
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl">⚽</span>
          <span className="font-semibold text-gray-900 tracking-tight text-sm">WC2026 Fantasy</span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Auth area */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-7 bg-gray-100 rounded-lg animate-pulse" />
          ) : user ? (
            <>
              <span className="hidden sm:block text-xs text-gray-400 truncate max-w-[140px]">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex gap-1 mt-2 overflow-x-auto pb-0.5">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                active
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
