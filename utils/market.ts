import fullGameData from '@/utils/idleclans_game_data.json';
import type { IndexedItem, PriceLevel } from '@/types/market.types';

let cachedIndex: Map<number, IndexedItem> | null = null;

type JsonValue = any;

export const getItemsIndex = (): Map<number, IndexedItem> => {
  if (cachedIndex) return cachedIndex;
  const map = new Map<number, IndexedItem>();
  // The new game data file has structure: { Items: { Items: [ { ItemId, Name, BaseValue, CanNotBeSoldToGameShop, ... } ] } }
  const items: JsonValue[] = fullGameData?.Items?.Items ?? [];
  for (const it of items) {
    if (it && typeof it.ItemId === 'number' && typeof it.Name === 'string' && typeof it.BaseValue === 'number') {
      map.set(it.ItemId, {
        id: it.ItemId,
        name: it.Name,
        value: it.BaseValue,
        categoryPath: ['Items'],
        canSellToGame: it.CanNotBeSoldToGameShop ? false : true,
      });
    }
  }
  cachedIndex = map;
  return map;
};

export const getIndexedItem = (itemId: number): IndexedItem | undefined => {
  return getItemsIndex().get(itemId);
};

let cachedNegotiationPotionId: number | null = null;
export const getNegotiationPotionId = (): number | null => {
  if (cachedNegotiationPotionId !== null) return cachedNegotiationPotionId;
  const items: JsonValue[] = fullGameData?.Items?.Items ?? [];
  for (const it of items) {
    if (typeof it?.Name === 'string' && it.Name === 'potion_of_negotiation') {
      cachedNegotiationPotionId = typeof it.ItemId === 'number' ? it.ItemId : null;
      break;
    }
  }
  return cachedNegotiationPotionId;
};

export const toDisplayName = (rawName: string): string => {
  return rawName.replace(/_/g, ' ');
};

export const computeGameSell = (
  baseValue: number,
  clan10: boolean,
  potion5: boolean
): number => {
  const multiplier = 1 + (clan10 ? 0.1 : 0) + (potion5 ? 0.05 : 0);
  return Math.floor(baseValue * multiplier);
};

export const findVolumeAtLowest = (levels?: PriceLevel[]): number | null => {
  if (!levels || levels.length === 0) return null;
  // Assume first entry is the lowest price
  const first = levels[0];
  if (typeof first?.volume === 'number') return first.volume;
  return null;
};


