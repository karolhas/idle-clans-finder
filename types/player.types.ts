//types
import { Upgrades } from './upgrades.types';
import { PvmStats } from './pvm.types';
import { Clan } from './clan.types';

export interface Equipment {
    [key: string]: string | number | null;
}

export interface EnchantmentBoosts {
    [key: string]: number;
}

export interface PlayerClan {
    [key: string]: unknown;
    serializedUpgrades?: string | number[];
    upgrades?: Record<string, number>;
}

export interface Player {
    memberlist?: Clan[];
    upgrades: Upgrades;
    username: string;
    gameMode: string;
    guildName: string | null;
    pvmStats: PvmStats;
    skillExperiences: {
        [key: string]: number;
    };
    totalLevel?: number;
    totalXp?: number;
    joinDate?: string;
    lastOnline?: string;
    hoursOffline?: number;
    taskNameOnLogout?: string;
    equipment?: Equipment;
    enchantmentBoosts?: EnchantmentBoosts;
    clan?: PlayerClan;
}
