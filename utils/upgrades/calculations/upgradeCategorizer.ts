//utils
import { UPGRADE_CATEGORIES } from "./../constants/upgradeCategories";

const initializeCategories = (): typeof UPGRADE_CATEGORIES => ({
  general: [],
  skilling: [],
  combat: [],
  unlockedWithItems: [],
});

const findCategoryForUpgrade = (
  upgradeName: string
): keyof typeof UPGRADE_CATEGORIES | null => {
  const [category] = Object.entries(UPGRADE_CATEGORIES).find(([upgrades]) =>
    upgrades.includes(upgradeName)
  ) || [null];

  return (category as keyof typeof UPGRADE_CATEGORIES) || null;
};

export const categorizeUpgrades = (
  upgrades: Record<string, unknown>
): typeof UPGRADE_CATEGORIES => {
  return Object.entries(upgrades).reduce((acc, [name]) => {
    const category = findCategoryForUpgrade(name);
    if (category) {
      acc[category].push(name);
    }
    return acc;
  }, initializeCategories());
};
