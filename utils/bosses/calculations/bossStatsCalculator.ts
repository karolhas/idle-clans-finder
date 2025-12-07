//types
import type { BossStatsResult, PvmStats } from "@/types/pvm.types";
//utils
import { categorizeBosses } from "./bossCategorizer";

export const calculateBossStats = (stats: PvmStats): BossStatsResult => {
  const categorizedBosses = categorizeBosses(stats);

  const raidTotal = Object.values(categorizedBosses.raids).reduce(
    (a, b) => a + b,
    0
  );
  const bossTotal = Object.values(categorizedBosses.bosses).reduce(
    (a, b) => a + b,
    0
  );
  const clanBossTotal = Object.values(categorizedBosses.clanBosses).reduce(
    (a, b) => a + b,
    0
  );
  const eliteBossTotal = Object.values(categorizedBosses.eliteBosses).reduce(
    (a, b) => a + b,
    0
  );

  return {
    categorizedBosses,
    raidTotal,
    bossTotal,
    clanBossTotal,
    eliteBossTotal,
  };
};
