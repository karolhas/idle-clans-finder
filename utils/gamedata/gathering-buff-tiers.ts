import { UpgradeTierInfo } from '@/types/calculator.types';
import localMarketData from '../localmarket.json';

interface MarketTier {
    tier: number;
    name: string | null;
    cost: number | null;
    effect: string;
}

interface MarketUpgrade {
    name: string;
    tiers: MarketTier[];
    maxTier: number;
}

interface MarketData {
    [category: string]: MarketUpgrade[];
}

// Helper function to extract tier information from localmarket.json
function getUpgradeTiersFromMarket(upgradeName: string): UpgradeTierInfo[] {
    const tiers: UpgradeTierInfo[] = [{ name: 'None', value: '0', effect: '' }];

    // Search through categories in marketData
    const data = localMarketData as unknown as MarketData;
    for (const category in data) {
        const upgrades = data[category];

        const upgrade = upgrades.find((u) => u.name === upgradeName);
        if (upgrade && upgrade.tiers) {
            upgrade.tiers.forEach((tier: MarketTier, index: number) => {
                tiers.push({
                    name: `T${index + 1}${tier.name ? ` (${tier.name})` : ''}`,
                    value: `${index + 1}`,
                    effect: tier.effect,
                });
            });
            break;
        }
    }

    return tiers;
}

// The Fisherman Tiers
export const THE_FISHERMAN_TIERS: UpgradeTierInfo[] =
    getUpgradeTiersFromMarket('The fisherman');

// Power Forager Tiers
export const POWER_FORAGER_TIERS: UpgradeTierInfo[] =
    getUpgradeTiersFromMarket('Power forager');

// The Lumberjack Tiers
export const THE_LUMBERJACK_TIERS: UpgradeTierInfo[] =
    getUpgradeTiersFromMarket('The lumberjack');

// Efficient Fisherman Tiers
export const EFFICIENT_FISHERMAN_TIERS: UpgradeTierInfo[] =
    getUpgradeTiersFromMarket('Most efficient fisherman');

// Farming Trickery Tiers
export const FARMING_TRICKERY_TIERS: UpgradeTierInfo[] =
    getUpgradeTiersFromMarket('Farming trickery');

// Smelting Magic Tiers
export const SMELTING_MAGIC_TIERS: UpgradeTierInfo[] =
    getUpgradeTiersFromMarket('Smelting magic');

// Plank Bargain Tiers
export const PLANK_BARGAIN_TIERS: UpgradeTierInfo[] =
    getUpgradeTiersFromMarket('Plank bargain');

// Map for easier lookup
export const BUFF_TIERS_MAP: Record<string, UpgradeTierInfo[]> = {
    theFisherman: THE_FISHERMAN_TIERS,
    powerForager: POWER_FORAGER_TIERS,
    theLumberjack: THE_LUMBERJACK_TIERS,
    efficientFisherman: EFFICIENT_FISHERMAN_TIERS,
    farmingTrickery: FARMING_TRICKERY_TIERS,
    smeltingMagic: SMELTING_MAGIC_TIERS,
    plankBargain: PLANK_BARGAIN_TIERS,
};
