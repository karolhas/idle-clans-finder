export type SkillType =
    | 'crafting'
    | 'mining'
    | 'smithing'
    | 'carpentry'
    | 'farming'
    | 'foraging'
    | 'cooking'
    | 'enchanting'
    | 'woodcutting'
    | 'agility'
    | 'fishing'
    | 'plundering'
    | 'brewing';

export interface ToolTier {
    name: string;
    value: string;
    boost: number;
}

export interface ClanHouseTier {
    name: string;
    value: string;
    boost: number;
}

export interface PersonalHouseTier {
    name: string;
    value: string;
    boost: number;
}

export interface ScrollTier {
    name: string;
    value: string;
    boost: number;
}

export interface SkillCapeTier {
    name: string;
    value: string;
    boost: number;
}

export interface OutfitPieces {
    value: number;
    boost: number;
}

export interface Consumable {
    name: string;
    value: string;
    boost: number;
}

export interface BoostOption {
    name: string;
    label: string;
    options: { name: string; value: string; boost: number }[];
}

export interface SkillItem {
    name: string;
    level: number;
    exp: number;
    seconds: number;
    expPerSecond: number;
    goldValue: number;
    goldPerSecond: number;
    category?: string;
}

export interface SkillBoosts {
    tool: string;
    clanHouse: string;
    personalHouse: string;
    t3Scrolls: string;
    t2Scrolls: string;
    t1Scrolls: string;
    skillCape: string;
    outfitPieces: number;
    consumable: string;
    xpBoost: boolean;
    negotiationPotion: boolean;
    trickeryPotion: boolean;
    knowledgePotion: boolean;
    guardiansChisel: boolean;
    forgeryPotion: boolean;
    guardiansTrowel: boolean;
}

export interface GeneralBuffs {
    clanHouse: string;
    personalHouse: string;
    offerTheyCanRefuse: boolean;
}

export interface GatheringBuffs {
    theFisherman: number;
    powerForager: number;
    theLumberjack: number;
    efficientFisherman: number;
    farmingTrickery: number;
    powerFarmHand: number;
    smeltingMagic: number;
    plankBargain: number;
}

export interface UpgradeBuffs {
    arrowCrafter: boolean;
    responsibleDrinking: boolean;
    delicateManufacturing: boolean;
    lastNegotiation: boolean;
    prestigiousWoodworking: boolean;
    betterFisherman: boolean;
    betterLumberjack: boolean;
    gatherers: boolean;
}

export interface PotionsState {
    negotiationPotion: {
        active: boolean;
        cost: number;
    };
    trickeryPotion: {
        active: boolean;
        cost: number;
    };
    knowledgePotion: {
        active: boolean;
        cost: number;
    };
}

export interface UpgradeTierInfo {
    name: string;
    value: string;
    effect: string;
}

export interface CalculatorState {
    generalBuffs: GeneralBuffs;
    gatheringBuffs: GatheringBuffs;
    upgradeBuffs: UpgradeBuffs;
    potions: PotionsState;
    currentSkill: SkillType;
    skillBoosts: Record<SkillType, SkillBoosts>;
    currentExp: number;
    targetLevel: number;
    selectedItem: string | null;
    playerSkillExperiences: Record<string, number>;
    clanName?: string | null;
}

import { Player } from './player.types';

export interface CalculatorContext {
    state: CalculatorState;
    setGeneralBuff: (key: keyof GeneralBuffs, value: string | boolean) => void;
    setGatheringBuff: (key: keyof GatheringBuffs, value: number) => void;
    setUpgradeBuff: (key: keyof UpgradeBuffs, value: boolean) => void;
    setPotion: (
        potionName: keyof PotionsState,
        key: 'active' | 'cost',
        value: boolean | number
    ) => void;
    setCurrentSkill: (skill: SkillType) => void;
    setSkillBoost: (
        skill: SkillType,
        key: keyof SkillBoosts,
        value: string | number | boolean
    ) => void;
    setCurrentExp: (exp: number) => void;
    setTargetLevel: (level: number) => void;
    setSelectedItem: (itemName: string | null) => void;
    resetCalculator: () => void;
    loadPlayerData: (playerData: Player) => void;
}
