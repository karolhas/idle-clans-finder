import { Upgrades } from "@/types/upgrades";

export const formatUpgradeName = (name: string): string => {
  return name
    .split(/(?=[A-Z])|[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const getMaxTiers = (upgradeName: string): number => {
  const maxTiers: { [key: string]: number } = {
    keepItSpacious: 190,
    valuedClanMember: 1,
    housing: 5,
    lazyRaider: 1,
    extraLoadouts: 15,
    offlineProgress: 6,
    toolbeltUpgrade: 6,
    ancientWisdom: 1,
    masterCrafter: 1,
    mostEfficientFisherman: 5,
    farmingTrickery: 5,
    theFisherman: 5,
    powerForager: 5,
    plankBargain: 3,
    smeltingMagic: 3,
    theLumberjack: 5,
    autoEating: 1,
    autoLooting: 1,
    bossSlayer: 1,
    ninja: 4,
    monsterHunter: 1,
    showUsTheMoney: 1,
    "kronosWho?": 1,
    pickyEater: 1,
    "ammo-saver": 6,
    teamwork: 1,
    bountyHunter: 1,
  };
  return maxTiers[upgradeName] || 1;
};

export const getImagePath = (name: string): string => {
  if (name === "kronosWho?") {
    return "/upgrades/kronosWho.png";
  }
  return `/upgrades/${name}.png`;
};

export const categorizeUpgrades = (upgrades: Upgrades) => {
  const categories = {
    general: [
      "keepItSpacious",
      "valuedClanMember",
      "housing",
      "lazyRaider",
      "extraLoadouts",
      "offlineProgress",
      "toolbeltUpgrade",
    ],
    skilling: [
      "ancientWisdom",
      "masterCrafter",
      "mostEfficientFisherman",
      "farmingTrickery",
      "theFisherman",
      "powerForager",
      "plankBargain",
      "smeltingMagic",
      "theLumberjack",
    ],
    combat: [
      "autoEating",
      "autoLooting",
      "bossSlayer",
      "ninja",
      "monsterHunter",
      "showUsTheMoney",
      "kronosWho?",
      "pickyEater",
      "ammo-saver",
      "teamwork",
      "bountyHunter",
    ],
    unlockedWithItems: [
      "arrowCrafter",
      "keepItBurning",
      "betterSkinner",
      "delicateManufacturing",
      "gettingInSync",
      "lastNegotiation",
      "prestigiousWoodworking",
      "responsibleDrinking",
      "betterFisherman",
      "betterLumberjack",
    ],
  };

  return Object.entries(upgrades).reduce(
    (acc, [name, value]) => {
      if (categories.general.includes(name)) acc.general[name] = value;
      else if (categories.skilling.includes(name)) acc.skilling[name] = value;
      else if (categories.combat.includes(name)) acc.combat[name] = value;
      else if (categories.unlockedWithItems.includes(name))
        acc.unlockedWithItems[name] = value;
      return acc;
    },
    {
      general: {} as Record<string, number>,
      skilling: {} as Record<string, number>,
      combat: {} as Record<string, number>,
      unlockedWithItems: {} as Record<string, number>,
    }
  );
};
