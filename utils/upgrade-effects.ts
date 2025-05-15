import marketData from './localmarket.json';

// Interface for upgrade tier effects
export interface UpgradeTierEffect {
    tier: number;
    name: string | null;
    effect: string;
    cost: number | null;
}

interface MarketUpgrade {
    name: string;
    tiers: UpgradeTierEffect[];
    maxTier: number;
}

interface MarketData {
    [category: string]: MarketUpgrade[];
}

// Map of upgrade keys to their corresponding names in localmarket.json
const upgradeNameMap: Record<string, string> = {
    theFisherman: 'The fisherman',
    powerForager: 'Power forager',
    theLumberjack: 'The lumberjack',
    efficientFisherman: 'Most efficient fisherman',
    farmingTrickery: 'Farming trickery',
    smeltingMagic: 'Smelting magic',
    plankBargain: 'Plank bargain',
};

// Function to get tier effect for an upgrade
export function getUpgradeTierEffect(
    upgradeName: string,
    tier: number
): UpgradeTierEffect | null {
    const marketName = upgradeNameMap[upgradeName];
    if (!marketName || tier <= 0) return null;

    // Search through categories in marketData
    const data = marketData as unknown as MarketData;
    for (const category in data) {
        const upgrades = data[category];

        const upgrade = upgrades.find((u) => u.name === marketName);
        if (upgrade && upgrade.tiers && upgrade.tiers.length >= tier) {
            return upgrade.tiers[tier - 1];
        }
    }

    return null;
}

// Get formatted display text for an upgrade with tier info
export function getUpgradeDisplayText(
    upgradeName: string,
    tier: number
): string {
    const tierEffect = getUpgradeTierEffect(upgradeName, tier);

    if (!tierEffect) {
        return '';
    }

    return `T${tier} (${tierEffect.effect})`;
}
