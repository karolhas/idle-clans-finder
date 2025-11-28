import fullGameData from "@/utils/idleclans_game_data.json";

export interface ItemStats {
  strength: number;
  accuracy: number;
  defence: number;
  archeryStrength: number;
  archeryAccuracy: number;
  archeryDefence: number;
  magicStrength: number;
  magicAccuracy: number;
  magicDefence: number;
}

interface ItemDefinition {
  ItemId: number;
  StrengthBonus?: number;
  AccuracyBonus?: number;
  DefenceBonus?: number;
  ArcheryStrengthBonus?: number;
  ArcheryAccuracyBonus?: number;
  ArcheryDefenceBonus?: number;
  MagicStrengthBonus?: number;
  MagicAccuracyBonus?: number;
  MagicDefenceBonus?: number;
}

interface GameDataStructure {
  Items?: {
    Items?: ItemDefinition[];
  };
}

const itemsMap = new Map<number, ItemStats>();
let isInitialized = false;

function initializeStats() {
  if (isInitialized) return;

  const gameData = fullGameData as unknown as GameDataStructure;
  const items = gameData?.Items?.Items || [];

  for (const item of items) {
    if (item && typeof item.ItemId === "number") {
      itemsMap.set(item.ItemId, {
        strength: item.StrengthBonus || 0,
        accuracy: item.AccuracyBonus || 0,
        defence: item.DefenceBonus || 0,
        archeryStrength: item.ArcheryStrengthBonus || 0,
        archeryAccuracy: item.ArcheryAccuracyBonus || 0,
        archeryDefence: item.ArcheryDefenceBonus || 0,
        magicStrength: item.MagicStrengthBonus || 0,
        magicAccuracy: item.MagicAccuracyBonus || 0,
        magicDefence: item.MagicDefenceBonus || 0,
      });
    }
  }
  isInitialized = true;
}

export function getItemStats(itemId: number | null): ItemStats {
  if (itemId === null) {
    return {
      strength: 0,
      accuracy: 0,
      defence: 0,
      archeryStrength: 0,
      archeryAccuracy: 0,
      archeryDefence: 0,
      magicStrength: 0,
      magicAccuracy: 0,
      magicDefence: 0,
    };
  }

  initializeStats();
  return (
    itemsMap.get(itemId) || {
      strength: 0,
      accuracy: 0,
      defence: 0,
      archeryStrength: 0,
      archeryAccuracy: 0,
      archeryDefence: 0,
      magicStrength: 0,
      magicAccuracy: 0,
      magicDefence: 0,
    }
  );
}
