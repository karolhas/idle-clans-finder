//components
import { BossRow } from "@/components/pvmstats/BossRow";

interface BossCategoryProps {
  title: string;
  bosses: Record<string, number>;
  total: number;
  getBossColor: (kills: number) => string;
  formatBossName: (name: string) => string;
}

export function BossCategory({
  title,
  bosses,
  total,
  getBossColor,
  formatBossName,
}: BossCategoryProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-emerald-400 mb-2">
        {title} <span className="text-base">(total: {total})</span>
      </h3>
      <div className="space-y-1">
        {Object.entries(bosses).map(([name, kills]) => (
          <BossRow
            key={name}
            name={name}
            kills={kills}
            getBossColor={getBossColor}
            formatBossName={formatBossName}
          />
        ))}
      </div>
    </div>
  );
}
