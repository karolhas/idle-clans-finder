import { Upgrades } from "./upgrades";
import { PvMStats } from "./pvmStats";

export interface Player {
  upgrades: Upgrades;
  username: string;
  gameMode: string;
  guildName: string;
  pvmStats: PvMStats;
  skillExperiences: {
    [key: string]: number;
  };
}
