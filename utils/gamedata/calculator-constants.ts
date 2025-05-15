import {
    BoostOption,
    ClanHouseTier,
    Consumable,
    OutfitPieces,
    PersonalHouseTier,
    ScrollTier,
    SkillCapeTier,
    ToolTier,
} from '@/types/calculator.types';
import { XP_TABLE } from '@/utils/common/constants/xpTable';

// Clan House Tiers
export const CLAN_HOUSE_TIERS: ClanHouseTier[] = [
    { name: 'None', value: 'none', boost: 0 },
    { name: 'T1 (Tent)', value: 't1', boost: 5 },
    { name: 'T2 (Cabin)', value: 't2', boost: 10 },
    { name: 'T3 (Cottage)', value: 't3', boost: 15 },
    { name: 'T4 (Villa)', value: 't4', boost: 20 },
    { name: 'T5 (Manor)', value: 't5', boost: 25 },
    { name: 'T6 (Castle)', value: 't6', boost: 30 },
];

// Personal House Tiers
export const PERSONAL_HOUSE_TIERS: PersonalHouseTier[] = [
    { name: 'None', value: 'none', boost: 0 },
    { name: 'T1 (Tent)', value: 't1', boost: 5 },
    { name: 'T2 (Cabin)', value: 't2', boost: 10 },
    { name: 'T3 (Cottage)', value: 't3', boost: 15 },
    { name: 'T4 (Villa)', value: 't4', boost: 20 },
    { name: 'T5 (House)', value: 't5', boost: 25 },
];

// T3 Scrolls
export const T3_SCROLLS: ScrollTier[] = [
    { name: 'None', value: '0', boost: 0 },
    { name: '1', value: '1', boost: 5 },
    { name: '2', value: '2', boost: 10 },
    { name: '3', value: '3', boost: 15 },
    { name: '4', value: '4', boost: 20 },
];

// T2 Scrolls
export const T2_SCROLLS: ScrollTier[] = [
    { name: 'None', value: '0', boost: 0 },
    { name: '1', value: '1', boost: 3 },
    { name: '2', value: '2', boost: 6 },
    { name: '3', value: '3', boost: 9 },
    { name: '4', value: '4', boost: 12 },
];

// T1 Scrolls
export const T1_SCROLLS: ScrollTier[] = [
    { name: 'None', value: '0', boost: 0 },
    { name: '1', value: '1', boost: 1.5 },
    { name: '2', value: '2', boost: 3 },
    { name: '3', value: '3', boost: 4.5 },
    { name: '4', value: '4', boost: 6 },
];

// Skill Capes
export const SKILL_CAPES: SkillCapeTier[] = [
    { name: 'None', value: 'none', boost: 0 },
    { name: 'T1', value: 't1', boost: 5 },
    { name: 'T2', value: 't2', boost: 10 },
    { name: 'T3', value: 't3', boost: 15 },
    { name: 'T4', value: 't4', boost: 20 },
];

// Outfit Pieces
export const OUTFIT_PIECES: OutfitPieces[] = [
    { value: 0, boost: 0 },
    { value: 1, boost: 2 },
    { value: 2, boost: 4 },
    { value: 3, boost: 6 },
    { value: 4, boost: 8 },
];

// Maximum outfit pieces per skill
export const MAX_OUTFIT_PIECES: Record<string, number> = {
    crafting: 4,
    mining: 3,
    smithing: 0,
    carpentry: 0,
    farming: 0,
    foraging: 3,
    cooking: 0,
    enchanting: 0,
    woodcutting: 3,
    agility: 3,
    fishing: 3,
    plundering: 3,
    brewing: 0,
};

// Consumables
export const CONSUMABLES: Consumable[] = [
    { name: 'None', value: 'none', boost: 0 },
    { name: 'Common', value: 'common', boost: 2 },
    { name: 'Rare', value: 'rare', boost: 4 },
];

// Standard tool tiers for all skills
const STANDARD_TOOLS: ToolTier[] = [
    { name: 'None', value: 'none', boost: 0 },
    { name: 'Normal', value: 'normal', boost: 4 },
    { name: 'T1 (Refined)', value: 't1', boost: 6 },
    { name: 'T2 (Great)', value: 't2', boost: 8 },
    { name: 'T3 (Elite)', value: 't3', boost: 10 },
    { name: 'T4 (Superior)', value: 't4', boost: 12 },
    { name: 'T5 (Outstanding)', value: 't5', boost: 15 },
    { name: 'T6 (Godlike)', value: 't6', boost: 20 },
    { name: 'T7 (Otherworldly)', value: 't7', boost: 25 },
];

// Tool Tiers - Crafting
export const CRAFTING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Mining
export const MINING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Smithing
export const SMITHING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Carpentry
export const CARPENTRY_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Farming
export const FARMING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Foraging
export const FORAGING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Cooking
export const COOKING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Enchanting
export const ENCHANTING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Woodcutting
export const WOODCUTTING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Agility
export const AGILITY_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Fishing
export const FISHING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Plundering
export const PLUNDERING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// Tool Tiers - Brewing
export const BREWING_TOOLS: ToolTier[] = [...STANDARD_TOOLS];

// All Tool Options by Skill
export const TOOLS_BY_SKILL: Record<string, ToolTier[]> = {
    crafting: CRAFTING_TOOLS,
    mining: MINING_TOOLS,
    smithing: SMITHING_TOOLS,
    carpentry: CARPENTRY_TOOLS,
    farming: FARMING_TOOLS,
    foraging: FORAGING_TOOLS,
    cooking: COOKING_TOOLS,
    enchanting: ENCHANTING_TOOLS,
    woodcutting: WOODCUTTING_TOOLS,
    agility: AGILITY_TOOLS,
    fishing: FISHING_TOOLS,
    plundering: PLUNDERING_TOOLS,
    brewing: BREWING_TOOLS,
};

// All Boost Options
export const BOOST_OPTIONS: BoostOption[] = [
    {
        name: 'clanHouse',
        label: 'Clan House',
        options: CLAN_HOUSE_TIERS,
    },
    {
        name: 'personalHouse',
        label: 'Personal House',
        options: PERSONAL_HOUSE_TIERS,
    },
    {
        name: 't3Scrolls',
        label: 'T3 Scrolls',
        options: T3_SCROLLS,
    },
    {
        name: 't2Scrolls',
        label: 'T2 Scrolls',
        options: T2_SCROLLS,
    },
    {
        name: 't1Scrolls',
        label: 'T1 Scrolls',
        options: T1_SCROLLS,
    },
    {
        name: 'skillCape',
        label: 'Skill Cape',
        options: SKILL_CAPES,
    },
    {
        name: 'consumable',
        label: 'Consumable',
        options: CONSUMABLES,
    },
];

// Level to XP Mapping
export const LEVEL_TO_XP = XP_TABLE;

// Initial calculator state
export const INITIAL_SKILL_BOOSTS = {
    tool: 'none',
    clanHouse: 'none',
    personalHouse: 'none',
    t3Scrolls: '0',
    t2Scrolls: '0',
    t1Scrolls: '0',
    skillCape: 'none',
    outfitPieces: 0,
    consumable: 'none',
    xpBoost: false,
    negotiationPotion: false,
    trickeryPotion: false,
    knowledgePotion: false,
    potioneering: false,
    guardiansChisel: false,
    forgeryPotion: false,
    guardiansTrowel: false,
};
