//types
import { Upgrades } from "./upgrades";
import { PvmStats } from "./pvmStats";

export interface ClanMember {
  memberName: string;
  rank: number;
}

export interface Player {
  memberlist: ClanMember[];
  upgrades: Upgrades;
  username: string;
  gameMode: string;
  guildName: string;
  pvmStats: PvmStats;
  skillExperiences: {
    [key: string]: number;
  };
}
