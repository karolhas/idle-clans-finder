// Types describing Idle Clans PlayerMarket endpoints

export interface LatestPriceEntry {
  itemId: number;
  // Current market snapshots
  lowestSellPrice: number; // current lowest sell offer price
  lowestPriceVolume: number; // volume available at lowest price
  highestBuyPrice: number; // current highest buy offer price
  highestPriceVolume: number; // volume at highest buy

  // 24h average
  dailyAveragePrice: number; // included when includeAveragePrice=true
}

export type LatestPricesResponse = LatestPriceEntry[];

export interface PriceLevel {
  price: number;
  volume: number;
}

export interface ItemComprehensive {
  itemId: number;
  lowestPrices?: PriceLevel[]; // ordered asc by price
  highestPrices?: PriceLevel[]; // ordered desc by price
  averagePrice1d?: number | null;
  averagePrice7d?: number | null;
  averagePrice30d?: number | null;
  tradeVolume1d?: number | null;
}

// Local index of items coming from simplified_game_data.json
export interface IndexedItem {
  id: number;
  name: string;
  value: number; // in-game sell value
  categoryPath: string[]; // where in the json it was found
  canSellToGame?: boolean;
}

export interface ProfitableRow {
  itemId: number;
  name: string;
  baseValue: number;
  gameSell: number;
  currentPrice: number;
  profitEach: number;
  profitPercent: number;
  volume?: number | null;
}

export interface UnderpricedRow {
  itemId: number;
  name: string;
  averagePrice1d: number;
  currentPrice: number;
  priceRatio: number;
  priceDiff: number;
  volume?: number | null;
}
