export interface Clan {
    memberName: string;
    rank: number;
}

export interface ClanData {
    guildName?: string;
    clanName?: string; // <- lazy way to make naming work
    memberlist: Clan[];
    tag?: string;
    guildDescription?: string;
    guildLevel?: number;
    guildXp?: number;
    creationDate?: string;
    recruitmentStatus?: string;
    recruitmentMessage?: string;
    minimumTotalLevelRequired?: number;
    isRecruiting?: boolean;
    language?: string;
    serializedUpgrades?: string;
    houseId?: number;

    serializedSkills?: string;
    skills?: {
        [skillName: string]: number;
    };
}
