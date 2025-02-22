//types
import { Upgrades } from "./upgrades.types";
import { PvmStats } from "./pvm.types";
import { Clan } from "./clan.types";

export interface Player {
  memberlist: Clan[];
  upgrades: Upgrades;
  username: string;
  gameMode: string;
  guildName: string;
  pvmStats: PvmStats;
  skillExperiences: {
    [key: string]: number;
  };
}
