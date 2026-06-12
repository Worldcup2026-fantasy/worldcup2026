interface PointsBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
  captain?: boolean;
}

export default function PointsBadge({ points, size = "md", captain = false }: PointsBadgeProps) {
  const colour =
    points >= 12 ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
    points >= 8  ? "bg-blue-100 text-blue-800 border-blue-200" :
    points >= 4  ? "bg-gray-100 text-gray-700 border-gray-200" :
    points < 0   ? "bg-red-100 text-red-700 border-red-200" :
                   "bg-gray-50 text-gray-500 border-gray-100";

  const sz =
    size === "lg" ? "text-xl font-bold px-3 py-1.5 rounded-xl" :
    size === "sm" ? "text-xs font-semibold px-2 py-0.5 rounded-md" :
                   "text-sm font-semibold px-2.5 py-1 rounded-lg";

  const display = captain ? points * 2 : points;

  return (
    <span className={`inline-flex items-center gap-1 border ${colour} ${sz}`}>
      {captain && <span className="text-[10px] text-amber-600 font-bold">C×2</span>}
      {display} pts
    </span>
  );
}
