import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-6">🏆</div>
      <h1 className="text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
        World Cup 2026 Fantasy
      </h1>
      <p className="text-lg text-gray-500 mb-10 leading-relaxed">
        Build your ultimate squad from the world&apos;s best players.
        Earn points as the tournament unfolds.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/squad"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Pick your squad
        </Link>
        <Link
          href="/auth/login"
          className="border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          Sign in
        </Link>
      </div>
      <div className="mt-20 grid grid-cols-3 gap-6 text-left">
        {[
          { icon: "👥", title: "32 nations", desc: "All World Cup squads represented" },
          { icon: "💰", title: "$100m budget", desc: "Build wisely — premium picks cost" },
          { icon: "📊", title: "Live points", desc: "Goals, assists, clean sheets & more" },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="text-2xl mb-2">{f.icon}</div>
            <div className="font-medium text-gray-900 mb-1">{f.title}</div>
            <div className="text-sm text-gray-500">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
