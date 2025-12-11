export interface PvmStats {
  Griffin: number;
  Devil: number;
  Hades: number;
  Zeus: number;
  Medusa: number;
  Chimera: number;
  Kronos: number;
  Sobek: number;
  Mesines: number;
  ReckoningOfTheGods: number;
  GuardiansOfTheCitadel: number;
  MalignantSpider: number;
  SkeletonWarrior: number;
  OtherworldlyGolem: number;
}

export type BossCategory = "raids" | "bosses" | "clanBosses" | "eliteBosses";

export interface CategorizedBosses {
  raids: Record<string, number>;
  bosses: Record<string, number>;
  clanBosses: Record<string, number>;
  eliteBosses: Record<string, number>;
}

export interface BossStatsResult {
  categorizedBosses: CategorizedBosses;
  raidTotal: number;
  bossTotal: number;
  clanBossTotal: number;
  eliteBossTotal: number;
}
