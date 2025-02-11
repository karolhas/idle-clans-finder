//types
import { PvMStats } from "@/types/pvmStats";

export const useBossStats = (stats: PvMStats) => {
  const formatBossName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getBossColor = (kills: number): string => {
    if (kills >= 1000) return "text-red-500";
    if (kills >= 500) return "text-purple-400";
    if (kills >= 100) return "text-yellow-400";
    return "text-white";
  };

  const categorizedBosses = Object.entries(stats).reduce(
    (acc, [name, kills]) => {
      if (name === "ReckoningOfTheGods" || name === "GuardiansOfTheCitadel") {
        acc.raids[name] = kills;
      } else if (
        ["MalignantSpider", "SkeletonWarrior", "OtherworldlyGolem"].includes(
          name
        )
      ) {
        acc.clanBosses[name] = kills;
      } else {
        acc.bosses[name] = kills;
      }
      return acc;
    },
    { raids: {}, bosses: {}, clanBosses: {} } as {
      raids: Record<string, number>;
      bosses: Record<string, number>;
      clanBosses: Record<string, number>;
    }
  );

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

  return {
    categorizedBosses,
    raidTotal,
    bossTotal,
    clanBossTotal,
    formatBossName,
    getBossColor,
  };
};
