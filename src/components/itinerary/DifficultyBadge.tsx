import { DIFFICULTY_LABELS } from "@/lib/constants";

interface DifficultyBadgeProps {
  difficulty: string;
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const d = DIFFICULTY_LABELS[difficulty as keyof typeof DIFFICULTY_LABELS];
  if (!d) return null;
  return (
    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${d.color}`}>{d.label}</span>
  );
}
