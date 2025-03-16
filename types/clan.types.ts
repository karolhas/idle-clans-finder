export interface Clan {
    memberName: string;
    rank: number;
}

export interface ClanData {
    guildName: string;
    memberlist: Clan[];
    guildDescription?: string;
    guildLevel?: number;
    guildXp?: number;
    creationDate?: string;
    recruitmentStatus?: string;
    recruitmentMessage?: string;
    minimumTotalLevelRequired?: number;
    isRecruiting?: boolean;
    language?: string;
}
