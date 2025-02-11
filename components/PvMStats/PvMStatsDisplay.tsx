//components
import { BossCategory } from "@/components/pvmstats/BossCategory";
//lib
import { useBossStats } from "@/lib/useBossStats";
//types
import { PvMStats } from "@/types/pvmStats";

interface PvMStatsDisplayProps {
  stats: PvMStats;
}

export default function PvMStatsDisplay({ stats }: PvMStatsDisplayProps) {
  const {
    categorizedBosses,
    raidTotal,
    bossTotal,
    clanBossTotal,
    getBossColor,
    formatBossName,
  } = useBossStats(stats);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-3 space-y-6">
        <BossCategory
          title="Raids"
          bosses={categorizedBosses.raids}
          total={raidTotal}
          getBossColor={getBossColor}
          formatBossName={formatBossName}
        />
        <BossCategory
          title="Clan bosses"
          bosses={categorizedBosses.clanBosses}
          total={clanBossTotal}
          getBossColor={getBossColor}
          formatBossName={formatBossName}
        />
      </div>
      <div className="md:col-span-2">
        <BossCategory
          title="Boss kills"
          bosses={categorizedBosses.bosses}
          total={bossTotal}
          getBossColor={getBossColor}
          formatBossName={formatBossName}
        />
      </div>
    </div>
  );
}
