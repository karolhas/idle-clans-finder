//types
import type { CategorizedBosses, PvmStats } from "@/types/pvm.types";
//utils
import { CLAN_BOSSES, RAID_BOSSES, ELITE_BOSSES } from "../constants/bossCategories";

export const categorizeBosses = (stats: PvmStats): CategorizedBosses => {
  return Object.entries(stats).reduce(
    (acc: CategorizedBosses, [name, kills]) => {
      if (RAID_BOSSES.includes(name as (typeof RAID_BOSSES)[number])) {
        acc.raids[name as keyof typeof acc.raids] = kills;
      } else if (CLAN_BOSSES.includes(name as (typeof CLAN_BOSSES)[number])) {
        acc.clanBosses[name as keyof typeof acc.clanBosses] = kills;
      } else if (ELITE_BOSSES.includes(name as (typeof ELITE_BOSSES)[number])) {
        acc.eliteBosses[name as keyof typeof acc.eliteBosses] = kills;
      } else {
        acc.bosses[name as keyof typeof acc.bosses] = kills;
      }
      return acc;
    },
    { raids: {}, bosses: {}, clanBosses: {}, eliteBosses: {} }
  );
};
