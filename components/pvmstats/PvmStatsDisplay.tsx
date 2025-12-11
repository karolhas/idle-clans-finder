//components
import { BossCategory } from "@/components/pvmstats/BossCategory";

//types
import { PvmStats } from "@/types/pvm.types";

//utils
import { calculateBossStats } from "@/utils/bosses/calculations/bossStatsCalculator";
import { getBossColor } from "@/utils/bosses/calculations/bossColor";
import { formatBossName } from "@/utils/bosses/formatters/bossNameFormatter";

interface PvmStatsDisplayProps {
  stats: PvmStats;
}

export default function PvmStatsDisplay({ stats }: PvmStatsDisplayProps) {
  const { categorizedBosses, raidTotal, bossTotal, clanBossTotal, eliteBossTotal } =
    calculateBossStats(stats);

  const hasRaids = Object.keys(categorizedBosses.raids).length > 0;
  const hasClanBosses = Object.keys(categorizedBosses.clanBosses).length > 0;
  const hasBosses = Object.keys(categorizedBosses.bosses).length > 0;
  const hasEliteBosses = Object.keys(categorizedBosses.eliteBosses).length > 0;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {raidTotal > 0 && (
          <div className="bg-gradient-to-r from-purple-900/20 to-purple-800/20 border border-purple-500/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-purple-300">{raidTotal.toLocaleString()}</div>
            <div className="text-xs text-purple-400">Raid Completions</div>
          </div>
        )}
        {clanBossTotal > 0 && (
          <div className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 border border-orange-500/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-orange-300">{clanBossTotal.toLocaleString()}</div>
            <div className="text-xs text-orange-400">Clan Boss Kills</div>
          </div>
        )}
        {eliteBossTotal > 0 && (
          <div className="bg-gradient-to-r from-red-900/20 to-red-800/20 border border-red-500/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-300">{eliteBossTotal.toLocaleString()}</div>
            <div className="text-xs text-red-400">Elite Boss Kills</div>
          </div>
        )}
        {bossTotal > 0 && (
          <div className="bg-gradient-to-r from-emerald-900/20 to-emerald-800/20 border border-emerald-500/20 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-emerald-300">{bossTotal.toLocaleString()}</div>
            <div className="text-xs text-emerald-400">Boss Kills</div>
          </div>
        )}
      </div>

      {/* Boss Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(hasRaids || hasClanBosses) && (
          <div className="space-y-4">
            {hasRaids && (
              <BossCategory
                title="Raids"
                bosses={categorizedBosses.raids}
                total={raidTotal}
                getBossColor={getBossColor}
                formatBossName={formatBossName}
              />
            )}
            {hasClanBosses && (
              <BossCategory
                title="Clan Bosses"
                bosses={categorizedBosses.clanBosses}
                total={clanBossTotal}
                getBossColor={getBossColor}
                formatBossName={formatBossName}
              />
            )}
          </div>
        )}

        {(hasEliteBosses || hasBosses) && (
          <div className="space-y-4">
            {hasEliteBosses && (
              <BossCategory
                title="Elite Bosses"
                bosses={categorizedBosses.eliteBosses}
                total={eliteBossTotal}
                getBossColor={getBossColor}
                formatBossName={formatBossName}
              />
            )}
            {hasBosses && (
              <BossCategory
                title="Bosses"
                bosses={categorizedBosses.bosses}
                total={bossTotal}
                getBossColor={getBossColor}
                formatBossName={formatBossName}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
