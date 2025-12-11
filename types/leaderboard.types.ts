export interface LeaderboardEntry {
  rank: number;
  name: string;
  value: number;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  totalCount: number;
}

export type GameMode = 'default' | 'ironman' | 'group_ironman';
export type EntityType = 'player' | 'clan' | 'pet';
export type LeaderboardCategory = 'skills' | 'bosses' | 'raids';

export type SkillStat = 
  | 'total_level'
  | 'attack'
  | 'strength'
  | 'defence'
  | 'archery'
  | 'magic'
  | 'health'
  | 'crafting'
  | 'woodcutting'
  | 'carpentry'
  | 'fishing'
  | 'cooking'
  | 'mining'
  | 'smithing'
  | 'foraging'
  | 'farming'
  | 'agility'
  | 'plundering'
  | 'enchanting'
  | 'brewing'
  | 'exterminating';

export type BossStat =
  | 'zeus'
  | 'medusa'
  | 'griffin'
  | 'hades'
  | 'chimera'
  | 'devil'
  | 'kronos'
  | 'sobek'
  | 'mesines';

export type RaidStat =
  | 'guardians_of_the_citadel'
  | 'reckoning_of_the_gods'
  | 'bloodmoon_massacre';

export type LeaderboardStat = SkillStat | BossStat | RaidStat;