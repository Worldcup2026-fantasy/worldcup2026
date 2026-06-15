import Link from "next/link";
import { Users, Wallet, TrendingUp, ArrowRight, LogIn } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-violet-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl -z-10" />

      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-500/25 mb-6">
          <TrendingUp className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-extrabold text-gray-900 mb-4 tracking-tight">
          World Cup 2026 <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Fantasy</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-md mx-auto">
          Build your ultimate squad from the world&apos;s best players.
          Earn points as the tournament unfolds.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/squad"
            className="tap-scale flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl transition-shadow"
          >
            Pick your squad
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </Link>
          <Link
            href="/auth/login"
            className="tap-scale flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-colors"
          >
            <LogIn className="w-4 h-4" strokeWidth={2.5} />
            Sign in
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { icon: Users,      title: "48 nations",  desc: "Every World Cup squad represented", color: "from-blue-500 to-blue-600" },
            { icon: Wallet,     title: "$160m budget", desc: "Build wisely — premium picks cost", color: "from-violet-500 to-violet-600" },
            { icon: TrendingUp, title: "Live points",  desc: "Goals, assists, clean sheets & more", color: "from-emerald-500 to-emerald-600" },
          ].map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-3 shadow-md`}>
                <f.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="font-display font-bold text-gray-900 mb-1">{f.title}</div>
              <div className="text-sm text-gray-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
