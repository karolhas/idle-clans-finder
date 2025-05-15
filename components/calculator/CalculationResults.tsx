'use client';

import { useCalculator } from './CalculatorContext';
import { SKILL_ITEMS_MAP } from '@/utils/gamedata/skill-items';
import {
    CLAN_HOUSE_TIERS,
    PERSONAL_HOUSE_TIERS,
    SKILL_CAPES,
    CONSUMABLES,
    TOOLS_BY_SKILL,
    T1_SCROLLS,
    T2_SCROLLS,
    T3_SCROLLS,
    OUTFIT_PIECES,
    LEVEL_TO_XP,
} from '@/utils/gamedata/calculator-constants';

export default function CalculationResults() {
    const { state } = useCalculator();
    const {
        currentSkill,
        selectedItem,
        skillBoosts,
        generalBuffs,
        gatheringBuffs,
        currentExp,
    } = state;

    // If no item is selected, show a message
    if (!selectedItem) {
        return (
            <div className="bg-[#001010] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                    Results
                </h2>
                <div className="text-center text-gray-400 py-4">
                    Select an item to view calculations
                </div>
            </div>
        );
    }

    // Get the selected item data
    const items = SKILL_ITEMS_MAP[currentSkill] || [];
    const item = items.find((i) => i.name === selectedItem);

    if (!item) {
        return (
            <div className="bg-[#001010] rounded-lg p-4">
                <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                    Results
                </h2>
                <div className="text-center text-red-400 py-4">
                    Selected item not found
                </div>
            </div>
        );
    }

    // Get all the boosts for the current skill
    const currentBoosts = skillBoosts[currentSkill];

    // Calculate total XP boost percentage
    const calculateTotalXpBoost = () => {
        let totalBoost = 0;

        // Only Clan house and Personal house affect XP boost
        // Clan house
        const clanHouseBoost =
            CLAN_HOUSE_TIERS.find((t) => t.value === generalBuffs.clanHouse)
                ?.boost || 0;
        totalBoost += clanHouseBoost;

        // Personal house
        const personalHouseBoost =
            PERSONAL_HOUSE_TIERS.find(
                (t) => t.value === generalBuffs.personalHouse
            )?.boost || 0;
        totalBoost += personalHouseBoost;

        // Consumable - now affects XP boost instead of time reduction
        const consumableBoost =
            CONSUMABLES.find((c) => c.value === currentBoosts.consumable)
                ?.boost || 0;
        totalBoost += consumableBoost;

        // Guardian's Chisel is handled separately for Refinement items

        // Return both total boost without XP Boost and with XP Boost
        const baseBoost = totalBoost;
        const boostWithXP = currentBoosts.xpBoost
            ? totalBoost + 30
            : totalBoost;

        return { baseBoost, boostWithXP };
    };

    // Calculate total time reduction percentage
    const calculateTimeReduction = () => {
        let timeReduction = 0;

        // Knowledge potion multiplier for scrolls (if active)
        const knowledgePotionMultiplier = currentBoosts.knowledgePotion
            ? 1.5
            : 1;

        // Tool boost - reduces time
        const toolBoost =
            TOOLS_BY_SKILL[currentSkill]?.find(
                (t) => t.value === currentBoosts.tool
            )?.boost || 0;
        timeReduction += toolBoost;

        // Scrolls - reduce time, now affected by Knowledge Potion
        const t3ScrollsBoost =
            T3_SCROLLS.find((t) => t.value === currentBoosts.t3Scrolls)
                ?.boost || 0;
        const t2ScrollsBoost =
            T2_SCROLLS.find((t) => t.value === currentBoosts.t2Scrolls)
                ?.boost || 0;
        const t1ScrollsBoost =
            T1_SCROLLS.find((t) => t.value === currentBoosts.t1Scrolls)
                ?.boost || 0;

        // Apply Knowledge Potion boost to scrolls if active
        const totalScrollBoost =
            (t3ScrollsBoost + t2ScrollsBoost + t1ScrollsBoost) *
            knowledgePotionMultiplier;
        timeReduction += totalScrollBoost;

        // Skill cape - reduces time
        const skillCapeBoost =
            SKILL_CAPES.find((t) => t.value === currentBoosts.skillCape)
                ?.boost || 0;
        timeReduction += skillCapeBoost;

        // Outfit pieces - reduce time
        const outfitBoost =
            OUTFIT_PIECES.find((p) => p.value === currentBoosts.outfitPieces)
                ?.boost || 0;
        timeReduction += outfitBoost;

        // Gathering-specific boosts - reduce time
        if (currentSkill === 'fishing' && gatheringBuffs.theFisherman)
            timeReduction += 25;
        // Power Forager doesn't reduce time, it increases loot
        if (currentSkill === 'woodcutting' && gatheringBuffs.theLumberjack)
            timeReduction += 25;
        if (currentSkill === 'farming' && gatheringBuffs.farmingTrickery)
            timeReduction += 25;

        // Efficient fisherman
        if (currentSkill === 'fishing' && gatheringBuffs.efficientFisherman)
            timeReduction += 15;

        // Power farm hand
        if (currentSkill === 'farming' && gatheringBuffs.powerFarmHand)
            timeReduction += 15;

        // Guardian's Trowel - reduce time for farming skill
        if (currentSkill === 'farming' && currentBoosts.guardiansTrowel)
            timeReduction += 5;

        // Clan Gatherers Upgrade - 5% speed boost for gathering skills
        if (
            state.upgradeBuffs.gatherers &&
            (currentSkill === 'woodcutting' ||
                currentSkill === 'fishing' ||
                currentSkill === 'mining' ||
                currentSkill === 'foraging')
        ) {
            timeReduction += 5;
        }

        return timeReduction;
    };

    // Calculate gold boost percentage
    const calculateGoldBoost = () => {
        let goldBoost = 0;

        // Offer they can't refuse
        if (generalBuffs.offerTheyCanRefuse) goldBoost += 10;

        // Negotiation potion - now 5% instead of 10%
        if (currentBoosts.negotiationPotion) goldBoost += 5;

        // Trickery potion now affects gold chance
        // Note: Since the game doesn't have a direct "gold chance" mechanic in the calculator,
        // we're treating it as a gold boost for simplicity
        if (currentBoosts.trickeryPotion) goldBoost += 15;

        return goldBoost;
    };

    // Calculate boosted XP, time, and gold
    const totalXpBoost = calculateTotalXpBoost();
    const timeReduction = calculateTimeReduction();
    const goldBoost = calculateGoldBoost();

    // Base values
    const baseXp = item.exp;
    const baseTime = item.seconds;
    const baseGold = item.goldValue;

    // Calculate base and boosted XP values
    let baseXpWithoutXPBoost = baseXp * (1 + totalXpBoost.baseBoost / 100);
    let boostedXp = baseXp * (1 + totalXpBoost.boostWithXP / 100);

    // Apply Guardian's Chisel bonus only to Refinement items
    if (
        currentSkill === 'crafting' &&
        currentBoosts.guardiansChisel &&
        item.category === 'Refinement'
    ) {
        baseXpWithoutXPBoost *= 1.1; // +10% XP for Refinement items
        boostedXp *= 1.1; // +10% XP for Refinement items
    }

    // Boosted time and gold values
    const boostedTime = baseTime * (1 - Math.min(timeReduction, 80) / 100); // Cap at 80% to match game mechanics
    const boostedGold = baseGold * (1 + goldBoost / 100);

    // Calculate XP per hour and gold per hour
    const xpPerHour = (baseXpWithoutXPBoost / boostedTime) * 3600; // XP per hour WITHOUT XP Boost
    const xpPerHourWithBoost = (boostedXp / boostedTime) * 3600; // XP per hour WITH XP Boost
    const goldPerHour = (boostedGold / boostedTime) * 3600;

    // Calculate how many times the item needs to be crafted
    const targetXp = LEVEL_TO_XP[state.targetLevel] || 0;
    const xpNeeded = Math.max(0, targetXp - currentExp);
    const craftsNeeded = Math.ceil(xpNeeded / boostedXp);

    // Calculate total time and gold
    const totalTimeSecs = craftsNeeded * boostedTime;
    const totalGold = craftsNeeded * boostedGold;

    // Format time for display (days, hours, minutes)
    const formatTime = (seconds: number) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        let timeString = '';
        if (days > 0) timeString += `${days}d `;
        if (hours > 0 || days > 0) timeString += `${hours}h `;
        if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
        if (secs > 0 && days === 0) timeString += `${secs}s`;

        return timeString.trim();
    };

    // Calculate Tasks per Hour (3600/Boosted time)
    const tasksPerHour = boostedTime > 0 ? Math.floor(3600 / boostedTime) : 0;

    // Adjust tasks per hour for foraging with Power Forager (which doubles loot, not reduces time)
    let adjustedTasksPerHour = tasksPerHour;
    if (currentSkill === 'foraging' && gatheringBuffs.powerForager > 0) {
        // Power Forager gives 10% per tier (from 1-5) chance to double loot
        const powerForagerBonus = gatheringBuffs.powerForager * 0.1; // 10% per tier
        // Adjust tasks per hour by the chance to double loot
        adjustedTasksPerHour = Math.floor(
            tasksPerHour * (1 + powerForagerBonus)
        );
    }

    // Calculate Ores Saved per Hour and Bars Saved per Hour (for smithing only)
    let oresSavedPerHour = 0;
    let barsSavedPerHour = 0;

    if (currentSkill === 'smithing') {
        // Get Smelting Magic tier
        const smeltingMagicTier = gatheringBuffs.smeltingMagic || 0;
        let smeltingMagicSaveChance = 0;

        // Smelting Magic gives chance to save ore: Tier 1: 10%, Tier 2: 20%, Tier 3: 30%
        if (smeltingMagicTier > 0 && smeltingMagicTier <= 3) {
            smeltingMagicSaveChance = smeltingMagicTier * 0.1; // 10% per tier
        }

        // Forgery Potion active status
        const forgeryPotionActive = currentBoosts.forgeryPotion;

        // Check if the item being crafted is a bar or equipment
        const isCreatingBars = item.name.toLowerCase().includes('bar');

        if (isCreatingBars) {
            // When making bars: Smelting Magic can save ores, but Forgery Potion doesn't apply
            oresSavedPerHour = Math.floor(
                adjustedTasksPerHour * smeltingMagicSaveChance
            );
            barsSavedPerHour = 0; // No bars saved when creating bars
        } else {
            // When making equipment: Forgery Potion can save bars, but Smelting Magic doesn't apply
            oresSavedPerHour = 0; // No ores saved when creating equipment
            barsSavedPerHour = forgeryPotionActive
                ? Math.floor(adjustedTasksPerHour * 0.1)
                : 0; // 10% chance to save bars with Forgery Potion
        }
    }

    // Format number with spaces between thousands
    const formatNumber = (num: number): string => {
        return Math.floor(num)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    // Helper function to check if item is instant craft (Refinement or Enchanting Scrolls)
    const isInstantCraft = () => {
        return item.category === 'Refinement' || item.seconds === 0;
    };

    // Helper function to check if item has no gold rewards
    const hasNoGoldReward = () => {
        return item.category === 'Refinement' || item.goldValue === 0;
    };

    return (
        <div className="bg-[#001010] rounded-lg p-4">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                Calculation Results
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-[#002020] rounded-md p-3">
                    <h3 className="text-emerald-400 font-medium mb-2">
                        Selected Item
                    </h3>
                    <p className="text-white text-lg font-medium">
                        {item.name}
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                            <div className="text-xs text-gray-400">Base XP</div>
                            <div className="text-sm text-white">{baseXp}</div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Base Time
                            </div>
                            <div className="text-sm text-white">
                                {isInstantCraft() ? 'Instant' : `${baseTime}s`}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Base Gold
                            </div>
                            <div className="text-sm text-white">
                                {hasNoGoldReward() ? 'N/A' : baseGold}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#002020] rounded-md p-3">
                    <h3 className="text-emerald-400 font-medium mb-2">
                        Boosted Values
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <div className="text-xs text-gray-400">
                                XP Boost
                            </div>
                            <div className="text-sm text-emerald-300">
                                +{totalXpBoost.boostWithXP.toFixed(1)}%
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Time Reduction
                            </div>
                            <div className="text-sm text-emerald-300">
                                {isInstantCraft()
                                    ? 'N/A'
                                    : `-${timeReduction.toFixed(1)}%`}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Gold Boost
                            </div>
                            <div className="text-sm text-emerald-300">
                                {hasNoGoldReward()
                                    ? 'N/A'
                                    : `+${goldBoost.toFixed(1)}%`}
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        <div>
                            <div className="text-xs text-gray-400">
                                Boosted XP
                            </div>
                            <div className="text-sm text-white">
                                {boostedXp.toFixed(2)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Boosted Time
                            </div>
                            <div className="text-sm text-white">
                                {isInstantCraft()
                                    ? 'Instant'
                                    : `${boostedTime.toFixed(2)}s`}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Boosted Gold
                            </div>
                            <div className="text-sm text-white">
                                {hasNoGoldReward()
                                    ? 'N/A'
                                    : boostedGold.toFixed(1)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#002020] rounded-md p-3">
                    <h3 className="text-emerald-400 font-medium mb-2">Rates</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <div className="text-xs text-gray-400">
                                XP per Hour
                            </div>
                            <div className="text-sm text-white">
                                {isInstantCraft()
                                    ? 'Instant'
                                    : formatNumber(xpPerHour)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Gold per Hour
                            </div>
                            <div className="text-sm text-white">
                                {hasNoGoldReward()
                                    ? 'N/A'
                                    : formatNumber(goldPerHour)}
                            </div>
                        </div>
                        {!isInstantCraft() && (
                            <div>
                                <div className="text-xs text-gray-400">
                                    Tasks per Hour
                                </div>
                                <div className="text-sm text-white">
                                    {formatNumber(adjustedTasksPerHour)}
                                </div>
                            </div>
                        )}
                        {currentSkill === 'smithing' && (
                            <>
                                <div>
                                    <div className="text-xs text-gray-400">
                                        Ores Saved/Hour
                                    </div>
                                    <div className="text-sm text-white">
                                        {formatNumber(oresSavedPerHour)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">
                                        Bars Saved/Hour
                                    </div>
                                    <div className="text-sm text-white">
                                        {formatNumber(barsSavedPerHour)}
                                    </div>
                                </div>
                            </>
                        )}
                        {currentBoosts.xpBoost && (
                            <div
                                className={
                                    currentSkill === 'smithing'
                                        ? ''
                                        : 'col-span-2'
                                }
                            >
                                <div className="text-xs text-gray-400 mt-2">
                                    XP per Hour (with XP Boost)
                                </div>
                                <div className="text-sm text-white">
                                    {isInstantCraft()
                                        ? 'Instant'
                                        : formatNumber(xpPerHourWithBoost)}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#002020] rounded-md p-3">
                    <h3 className="text-emerald-400 font-medium mb-2">
                        Target Calculations
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <div>
                            <div className="text-xs text-gray-400">
                                Items to Craft
                            </div>
                            <div className="text-sm text-white font-medium">
                                {craftsNeeded.toLocaleString()}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Total Time
                            </div>
                            <div className="text-sm text-white font-medium">
                                {isInstantCraft()
                                    ? 'Instant'
                                    : formatTime(totalTimeSecs)}
                            </div>
                        </div>
                        <div>
                            <div className="text-xs text-gray-400">
                                Total Gold
                            </div>
                            <div className="text-sm text-white font-medium">
                                {hasNoGoldReward()
                                    ? 'N/A'
                                    : totalGold.toLocaleString(undefined, {
                                          maximumFractionDigits: 0,
                                      })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
