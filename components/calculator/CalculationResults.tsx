"use client";

import { useCalculator } from "./CalculatorContext";
import { SKILL_ITEMS_MAP } from "@/utils/gamedata/skill-items";
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
} from "@/utils/gamedata/calculator-constants";

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
      <div className="bg-black/60 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center animate-fade-in">
        <h2 className="text-lg font-bold text-teal-400 mb-2">Results</h2>
        <div className="text-gray-300">
          Select an item to view detailed calculations
        </div>
      </div>
    );
  }

  // Get the selected item data
  const items = SKILL_ITEMS_MAP[currentSkill] || [];
  const item = items.find((i) => i.name === selectedItem);

  if (!item) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm text-center animate-fade-in">
        <h2 className="text-lg font-bold text-emerald-400 mb-2">Results</h2>
        <div className="text-red-400 font-medium">Selected item not found</div>
      </div>
    );
  }

  // Get all the boosts for the current skill
  const currentBoosts = skillBoosts[currentSkill];

  // Calculate total XP boost percentage
  const calculateTotalXpBoost = () => {
    let totalBoost = 0;

    // Clan house and Personal house always affect XP boost
    // Clan house
    const clanHouseBoost =
      CLAN_HOUSE_TIERS.find((t) => t.value === generalBuffs.clanHouse)?.boost ||
      0;
    totalBoost += clanHouseBoost;

    // Personal house
    const personalHouseBoost =
      PERSONAL_HOUSE_TIERS.find((t) => t.value === generalBuffs.personalHouse)
        ?.boost || 0;
    totalBoost += personalHouseBoost;

    // Consumable - now affects XP boost instead of time reduction
    const consumableBoost =
      CONSUMABLES.find((c) => c.value === currentBoosts.consumable)?.boost || 0;
    totalBoost += consumableBoost;

    // For Crafting's Refinement items, also include cape, outfit, and tool boosts in XP calculation
    if (currentSkill === "crafting" && item.category === "Refinement") {
      // Tool boost - affects XP for refinement
      const toolBoost =
        TOOLS_BY_SKILL[currentSkill]?.find(
          (t) => t.value === currentBoosts.tool
        )?.boost || 0;
      totalBoost += toolBoost;

      // Skill cape - affects XP for refinement
      const skillCapeBoost =
        SKILL_CAPES.find((t) => t.value === currentBoosts.skillCape)?.boost ||
        0;
      totalBoost += skillCapeBoost;

      // Outfit pieces - affects XP for refinement
      const outfitBoost =
        OUTFIT_PIECES.find((p) => p.value === currentBoosts.outfitPieces)
          ?.boost || 0;
      totalBoost += outfitBoost;
    }

    // Return both total boost without XP Boost and with XP Boost
    const baseBoost = totalBoost;
    const boostWithXP = currentBoosts.xpBoost ? totalBoost + 30 : totalBoost;

    return { baseBoost, boostWithXP };
  };

  // Calculate total time reduction percentage
  const calculateTimeReduction = () => {
    let timeReduction = 0;

    // Knowledge potion multiplier for scrolls (if active)
    const knowledgePotionMultiplier = currentBoosts.knowledgePotion ? 1.5 : 1;

    // Tool boost - reduces time (except for Crafting's Refinement items where it affects XP)
    if (!(currentSkill === "crafting" && item.category === "Refinement")) {
      const toolBoost =
        TOOLS_BY_SKILL[currentSkill]?.find(
          (t) => t.value === currentBoosts.tool
        )?.boost || 0;
      timeReduction += toolBoost;
    }

    // Scrolls - reduce time, now affected by Knowledge Potion
    // For Crafting's Refinement items, scrolls don't reduce time
    if (!(currentSkill === "crafting" && item.category === "Refinement")) {
      const t3ScrollsBoost =
        T3_SCROLLS.find((t) => t.value === currentBoosts.t3Scrolls)?.boost || 0;
      const t2ScrollsBoost =
        T2_SCROLLS.find((t) => t.value === currentBoosts.t2Scrolls)?.boost || 0;
      const t1ScrollsBoost =
        T1_SCROLLS.find((t) => t.value === currentBoosts.t1Scrolls)?.boost || 0;

      // Apply Knowledge Potion boost to scrolls if active
      const totalScrollBoost =
        (t3ScrollsBoost + t2ScrollsBoost + t1ScrollsBoost) *
        knowledgePotionMultiplier;
      timeReduction += totalScrollBoost;
    }

    // Skill cape - reduces time (except for Crafting's Refinement items where it affects XP)
    if (!(currentSkill === "crafting" && item.category === "Refinement")) {
      const skillCapeBoost =
        SKILL_CAPES.find((t) => t.value === currentBoosts.skillCape)?.boost ||
        0;
      timeReduction += skillCapeBoost;
    }

    // Outfit pieces - reduce time (except for Crafting's Refinement items where it affects XP)
    if (!(currentSkill === "crafting" && item.category === "Refinement")) {
      const outfitBoost =
        OUTFIT_PIECES.find((p) => p.value === currentBoosts.outfitPieces)
          ?.boost || 0;
      timeReduction += outfitBoost;
    }

    // Gathering-specific boosts
    // The Fisherman and The Lumberjack no longer reduce time, they increase loot
    // Power Forager doesn't reduce time, it increases loot
    if (currentSkill === "farming" && gatheringBuffs.farmingTrickery > 0)
      timeReduction += 25;

    // Power farm hand
    if (currentSkill === "farming" && gatheringBuffs.powerFarmHand > 0)
      timeReduction += 15;

    // Guardian's Trowel - reduce time for farming skill
    if (currentSkill === "farming" && currentBoosts.guardiansTrowel)
      timeReduction += 5;

    // Clan Gatherers Upgrade - 5% speed boost for gathering skills
    if (
      state.upgradeBuffs.gatherers &&
      (currentSkill === "fishing" ||
        currentSkill === "mining" ||
        currentSkill === "foraging" ||
        currentSkill === "woodcutting")
    ) {
      timeReduction += 5; // Only 5% time reduction from gatherers
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
    currentSkill === "crafting" &&
    currentBoosts.guardiansChisel &&
    item.category === "Refinement"
  ) {
    baseXpWithoutXPBoost *= 1.1; // +10% XP for Refinement items
    boostedXp *= 1.1; // +10% XP for Refinement items
  }

  // For Crafting's Refinement items, apply scrolls as a multiplier to the boosted XP
  if (currentSkill === "crafting" && item.category === "Refinement") {
    // Knowledge potion multiplier for scrolls (if active)
    const knowledgePotionMultiplier = currentBoosts.knowledgePotion ? 1.5 : 1;

    // Get scroll boosts
    const t3ScrollsBoost =
      T3_SCROLLS.find((t) => t.value === currentBoosts.t3Scrolls)?.boost || 0;
    const t2ScrollsBoost =
      T2_SCROLLS.find((t) => t.value === currentBoosts.t2Scrolls)?.boost || 0;
    const t1ScrollsBoost =
      T1_SCROLLS.find((t) => t.value === currentBoosts.t1Scrolls)?.boost || 0;

    // Calculate total scroll boost and apply as multiplier
    const totalScrollBoost =
      (t3ScrollsBoost + t2ScrollsBoost + t1ScrollsBoost) *
      knowledgePotionMultiplier;

    // Apply scroll boost as a multiplier to the already boosted XP
    baseXpWithoutXPBoost *= 1 + totalScrollBoost / 100;
    boostedXp *= 1 + totalScrollBoost / 100;
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

  // Calculate crafts needed based solely on XP needed
  const craftsNeeded = Math.ceil(xpNeeded / boostedXp);

  // Calculate total time and gold
  const totalTimeSecs = craftsNeeded * boostedTime;
  const totalGold = craftsNeeded * boostedGold;

  // Calculate total logs for woodcutting (includes The Lumberjack bonus logs)
  let totalLogs = craftsNeeded;
  if (currentSkill === "woodcutting" && gatheringBuffs.theLumberjack > 0) {
    // The Lumberjack tiers: 1=20%, 2=40%, 3=60%, 4=80%, 5=100%
    const tierPercent =
      [0, 20, 40, 60, 80, 100][gatheringBuffs.theLumberjack] || 0;
    // Add extra logs from The Lumberjack bonus
    totalLogs = Math.ceil(craftsNeeded * (1 + tierPercent / 100));
  }

  // Format time for display (days, hours, minutes)
  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let timeString = "";
    if (days > 0) timeString += `${days}d `;
    if (hours > 0 || days > 0) timeString += `${hours}h `;
    if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
    if (secs > 0 && days === 0) timeString += `${secs}s`;

    return timeString.trim();
  };

  // Calculate Tasks per Hour (3600/Boosted time)
  const tasksPerHour = boostedTime > 0 ? Math.floor(3600 / boostedTime) : 0;

  // Calculate real Tasks per Hour for fishing with The Fisherman buff
  let realTasksPerHour = tasksPerHour;
  if (currentSkill === "fishing" && gatheringBuffs.theFisherman > 0) {
    // The Fisherman tiers: 1=20%, 2=40%, 3=60%, 4=80%, 5=100%
    const tierPercent =
      [0, 20, 40, 60, 80, 100][gatheringBuffs.theFisherman] || 0;
    realTasksPerHour = Math.floor(tasksPerHour * (1 + tierPercent / 100));
  }

  // Adjust tasks per hour for foraging with Power Forager (which doubles loot, not reduces time)
  let adjustedTasksPerHour = realTasksPerHour;
  if (currentSkill === "foraging" && gatheringBuffs.powerForager > 0) {
    // Power Forager gives 10% per tier (from 1-5) chance to double loot
    const powerForagerBonus = gatheringBuffs.powerForager * 0.1; // 10% per tier
    // Adjust tasks per hour by the chance to double loot
    adjustedTasksPerHour = Math.floor(tasksPerHour * (1 + powerForagerBonus));
  }

  // Adjust tasks per hour for woodcutting with The Lumberjack (increases items gathered)
  if (currentSkill === "woodcutting" && gatheringBuffs.theLumberjack > 0) {
    // The Lumberjack tiers: 1=20%, 2=40%, 3=60%, 4=80%, 5=100%
    const tierPercent =
      [0, 20, 40, 60, 80, 100][gatheringBuffs.theLumberjack] || 0;
    adjustedTasksPerHour = Math.floor(
      adjustedTasksPerHour * (1 + tierPercent / 100)
    );
  }

  // Calculate Ores Saved per Hour and Bars Saved per Hour (for smithing only)
  let oresSavedPerHour = 0;
  let barsSavedPerHour = 0;

  if (currentSkill === "smithing") {
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
    const isCreatingBars = item.name.toLowerCase().includes("bar");

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
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Helper function to check if item is instant craft (Refinement or Enchanting Scrolls)
  const isInstantCraft = () => {
    return item.category === "Refinement" || item.seconds === 0;
  };

  // Helper function to check if item has no gold rewards
  const hasNoGoldReward = () => {
    return item.category === "Refinement" || item.goldValue === 0;
  };

  // --- FISHING: Cooked Fish and Cooking XP calculations ---
  let cookingActionsPerHour = 0;
  let cookedFishPerHour = 0;
  let cookingXpPerHour = 0;
  if (currentSkill === "fishing") {
    // Efficient Fisherman tiers: 1=10%, 2=20%, 3=30%, 4=40%, 5=50%
    const efficientFishermanPercent =
      [0, 10, 20, 30, 40, 50][gatheringBuffs.efficientFisherman] || 0;
    // The Fisherman tiers: 1=20%, 2=40%, 3=60%, 4=80%, 5=100%
    const fishermanPercent =
      [0, 20, 40, 60, 80, 100][gatheringBuffs.theFisherman] || 0;
    // Cooking Actions per Hour
    cookingActionsPerHour = tasksPerHour * (efficientFishermanPercent / 100);
    // Cooking XP per Hour
    let cookingExp = 0;
    if ("cookingExp" in item) {
      cookingExp = item.cookingExp as number;
    }
    cookingXpPerHour = Math.floor(
      cookingActionsPerHour *
        (cookingExp * (1 + totalXpBoost.boostWithXP / 100))
    );
    // Cooked Fish per Hour
    cookedFishPerHour = Math.floor(
      cookingActionsPerHour * (1 + fishermanPercent / 100)
    );
  }

  return (
    <div className="bg-black/60 p-6 rounded-2xl border-2 border-white/10 relative backdrop-blur-md shadow-xl hover:border-teal-500/50 hover:shadow-teal-900/20 transition-all duration-300 group mb-6">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        Calculation Results
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-black/20 border border-white/5 rounded-lg p-4">
          <h3 className="text-emerald-400 font-medium mb-2">Selected Item</h3>
          <p className="text-white text-lg font-medium">{item.name}</p>
          <div className="grid grid-cols-3 gap-2 mt-5">
            <div>
              <div className="text-xs text-gray-400">Base XP</div>
              <div className="text-sm text-white">{baseXp}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Base Time</div>
              <div className="text-sm text-white">
                {isInstantCraft() ? "Instant" : `${baseTime}s`}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Base Gold</div>
              <div className="text-sm text-white">
                {hasNoGoldReward() ? "N/A" : baseGold}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black/20 border border-white/5 rounded-lg p-4">
          <h3 className="text-emerald-400 font-medium mb-3 text-xs uppercase tracking-wider">
            Boosted Values
          </h3>
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <div className="text-[10px] text-gray-400 uppercase">
                XP Boost
              </div>
              <div className="text-sm text-emerald-400 font-bold">
                +{totalXpBoost.boostWithXP.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase">
                Time Red.
              </div>
              <div className="text-sm text-emerald-400 font-bold">
                {isInstantCraft() ? "N/A" : `-${timeReduction.toFixed(1)}%`}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase">
                Gold Boost
              </div>
              <div className="text-sm text-emerald-400 font-bold">
                {hasNoGoldReward() ? "N/A" : `+${goldBoost.toFixed(1)}%`}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div>
              <div className="text-[10px] text-gray-400 uppercase">
                Boosted XP
              </div>
              <div className="text-sm text-white font-mono">
                {boostedXp.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase">
                Boosted Time
              </div>
              <div className="text-sm text-white font-mono">
                {isInstantCraft() ? "Instant" : `${boostedTime.toFixed(2)}s`}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase">
                Boosted Gold
              </div>
              <div className="text-sm text-white font-mono">
                {hasNoGoldReward() ? "N/A" : boostedGold.toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-black/20 border border-white/5 rounded-lg p-4">
          <h3 className="text-emerald-400 font-medium mb-3 text-xs uppercase tracking-wider">
            Hourly Rates
          </h3>
          {currentSkill === "fishing" ? (
            <div className="grid grid-cols-2 gap-4">
              {/* Left column */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400">Fishing XP / Hour</div>
                  <div className="text-sm text-white font-mono font-bold mt-1">
                    {isInstantCraft() ? "Instant" : formatNumber(xpPerHour)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Fish / Hour</div>
                  <div className="text-sm text-white font-mono font-bold mt-1">
                    {formatNumber(realTasksPerHour)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Gold / Hour</div>
                  <div className="text-sm text-white font-mono font-bold mt-1">
                    {hasNoGoldReward() ? "N/A" : formatNumber(goldPerHour)}
                  </div>
                </div>
              </div>
              {/* Right column */}
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-400">Cooking XP / Hour</div>
                  <div className="text-sm text-white font-mono font-bold mt-1">
                    {formatNumber(cookingXpPerHour)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">
                    Cooked Fish / Hour
                  </div>
                  <div className="text-sm text-white font-mono font-bold mt-1">
                    {formatNumber(cookedFishPerHour)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-400">XP / Hour</div>
                <div className="text-sm text-white font-mono font-bold mt-1">
                  {isInstantCraft() ? "Instant" : formatNumber(xpPerHour)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400">Gold / Hour</div>
                <div className="text-sm text-white font-mono font-bold mt-1">
                  {hasNoGoldReward() ? "N/A" : formatNumber(goldPerHour)}
                </div>
              </div>
              {!isInstantCraft() && (
                <div>
                  <div className="text-xs text-gray-400">Tasks / Hour</div>
                  <div className="text-sm text-white font-mono font-bold mt-1">
                    {formatNumber(adjustedTasksPerHour)}
                  </div>
                </div>
              )}
              {currentSkill === "smithing" && (
                <>
                  <div>
                    <div className="text-xs text-gray-400">Ores Saved/Hour</div>
                    <div className="text-sm text-white font-mono font-bold">
                      {formatNumber(oresSavedPerHour)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Bars Saved/Hour</div>
                    <div className="text-sm text-white font-mono font-bold">
                      {formatNumber(barsSavedPerHour)}
                    </div>
                  </div>
                </>
              )}
              {currentBoosts.xpBoost && (
                <div
                  className={currentSkill === "smithing" ? "" : "col-span-2"}
                >
                  <div className="text-xs text-gray-400 mb-1">
                    XP / Hour (with XP Boost)
                  </div>
                  <div className="text-sm text-emerald-400 font-mono font-bold">
                    {isInstantCraft()
                      ? "Instant"
                      : formatNumber(xpPerHourWithBoost)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-black/20 border border-white/5 rounded-lg p-4">
          <h3 className="text-emerald-400 font-medium mb-3 text-xs uppercase tracking-wider">
            Target Calculations
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="text-xs text-gray-400">Items to Craft</div>
              <div className="text-base text-white font-mono font-bold">
                {craftsNeeded.toLocaleString()}
              </div>
            </div>
            {currentSkill === "woodcutting" && (
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <div className="text-xs text-gray-400">Total Logs (+Bonus)</div>
                <div className="text-base text-white font-mono font-bold">
                  {totalLogs.toLocaleString()}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <div className="text-xs text-gray-400">Time Required</div>
              <div className="text-base text-white font-mono font-bold text-right">
                {isInstantCraft() ? "Instant" : formatTime(totalTimeSecs)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-400">Total Gold Value</div>
              <div className="text-base text-emerald-400 font-mono font-bold">
                {hasNoGoldReward()
                  ? "N/A"
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
