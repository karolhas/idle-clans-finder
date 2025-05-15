import { SkillItem, SkillType } from '@/types/calculator.types';
import { MINING_ITEMS } from './mining-items';
import { CRAFTING_ITEMS } from './crafting-items';
import { CARPENTRY_ITEMS } from './carpentry-items';
import { FARMING_ITEMS } from './farming-items';
import { FORAGING_ITEMS } from './foraging-items';
import { ENCHANTING_ITEMS } from './enchanting-items';
import { WOODCUTTING_ITEMS } from './woodcutting-items';
import { AGILITY_ITEMS } from './agility-items';
import { FISHING_ITEMS } from './fishing-items';
import { PLUNDERING_ITEMS } from './plundering-items';
import { BREWING_ITEMS } from './brewing-items';
import { COOKING_ITEMS } from './cooking-items';
import { SMITHING_ITEMS } from './smithing-items';

// Map of skill types to their items
export const SKILL_ITEMS_MAP: Record<SkillType, SkillItem[]> = {
    mining: MINING_ITEMS,
    crafting: CRAFTING_ITEMS,
    carpentry: CARPENTRY_ITEMS as SkillItem[],
    farming: FARMING_ITEMS,
    foraging: FORAGING_ITEMS,
    enchanting: ENCHANTING_ITEMS,
    woodcutting: WOODCUTTING_ITEMS,
    agility: AGILITY_ITEMS,
    fishing: FISHING_ITEMS as SkillItem[],
    plundering: PLUNDERING_ITEMS as SkillItem[],
    smithing: SMITHING_ITEMS,
    cooking: COOKING_ITEMS,
    brewing: BREWING_ITEMS,
};
