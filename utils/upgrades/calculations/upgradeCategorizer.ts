//utils
import { Upgrades } from '@/types/upgrades.types';
import { UPGRADE_CATEGORIES } from '../constants/upgradeCategories';

type CategorizedUpgrades = {
    general: Record<string, number>;
    skilling: Record<string, number>;
    combat: Record<string, number>;
    unlockedWithItems: Record<string, number>;
};

export const categorizeUpgrades = (upgrades: Upgrades): CategorizedUpgrades => {
    const result: CategorizedUpgrades = {
        general: {},
        skilling: {},
        combat: {},
        unlockedWithItems: {},
    };
    for (const [name, value] of Object.entries(upgrades)) {
        const category = Object.entries(UPGRADE_CATEGORIES).find(
            ([, categoryUpgrades]) => categoryUpgrades.includes(name)
        )?.[0] as keyof CategorizedUpgrades | undefined;

        if (category) {
            if (value !== undefined) {
                result[category][name] = value;
            }
        }
    }

    return result;
};
