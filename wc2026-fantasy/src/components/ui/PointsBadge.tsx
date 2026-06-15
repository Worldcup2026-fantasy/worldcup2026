interface PointsBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
  captain?: boolean;
}

export default function PointsBadge({ points, size = "md", captain = false }: PointsBadgeProps) {
  const colour =
    points >= 12 ? "bg-emerald-100 text-emerald-700" :
    points >= 8  ? "bg-blue-100 text-blue-700" :
    points >= 4  ? "bg-gray-100 text-gray-700" :
    points < 0   ? "bg-rose-100 text-rose-700" :
                   "bg-gray-50 text-gray-500";

  const sz =
    size === "lg" ? "text-xl font-display font-extrabold px-3 py-1.5 rounded-xl" :
    size === "sm" ? "text-xs font-bold px-2 py-0.5 rounded-md" :
                   "text-sm font-bold px-2.5 py-1 rounded-lg";

  const display = captain ? points * 2 : points;

  return (
    <span className={`inline-flex items-center gap-1 ${colour} ${sz}`}>
      {captain && <span className="text-[10px] text-amber-600 font-bold">C×2</span>}
      {display} pts
    </span>
  );
}
