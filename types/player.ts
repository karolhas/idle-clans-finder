export interface Player {
  username: string;
  gameMode: string;
  guildName: string;
  skillExperiences: {
    [key: string]: number;
  };
}
