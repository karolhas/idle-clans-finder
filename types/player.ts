import { Upgrades } from "./upgrades";

export interface Player {
  upgrades: Upgrades;
  username: string;
  gameMode: string;
  guildName: string;
  skillExperiences: {
    [key: string]: number;
  };
}
