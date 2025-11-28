"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchItemComprehensive,
  fetchLatestMarketPrices,
} from "@/lib/api/market";
import type {
  ItemComprehensive,
  LatestPriceEntry,
  ProfitableRow,
  UnderpricedRow,
} from "@/types/market.types";
import {
  computeGameSell,
  getIndexedItem,
  getItemsIndex,
  findVolumeAtLowest,
  getNegotiationPotionId,
} from "@/utils/market";

interface UseMarketDataResult {
  loading: boolean;
  error: string | null;
  profitable: ProfitableRow[];
  underpriced: UnderpricedRow[];
  refresh: () => Promise<void>;
  fetchVolumeFor: (itemId: number) => Promise<{
    volumeAtLowest: number | null;
    details: ItemComprehensive | null;
  }>; // used by tables
  autoPotionCost: number; // latest market lowest price for potion_of_negotiation
}

export const useMarketData = (
  clan10: boolean,
  potion5: boolean
): UseMarketDataResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latest, setLatest] = useState<LatestPriceEntry[]>([]);
  const [autoPotionCost, setAutoPotionCost] = useState<number>(0);

  // No caching – always fetch latest

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const prices = await fetchLatestMarketPrices(true);
      setLatest(prices);
      // derive potion cost from latest prices
      const potionId = getNegotiationPotionId();
      if (potionId != null) {
        const p = prices.find((e) => e.itemId === potionId);
        if (
          p &&
          typeof p.lowestSellPrice === "number" &&
          p.lowestSellPrice > 0
        ) {
          setAutoPotionCost(p.lowestSellPrice);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load market");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (latest.length === 0) {
      refresh();
    }
  }, [latest.length, refresh]);

  // Join with game data and compute derived datasets
  const { profitable, underpriced } = useMemo(() => {
    const profitableRows: ProfitableRow[] = [];
    const underpricedRows: UnderpricedRow[] = [];

    // ensure index initialized
    getItemsIndex();

    for (const entry of latest) {
      const base =
        entry && typeof entry.itemId === "number"
          ? getIndexedItem(entry.itemId)
          : undefined;
      if (!base) continue;
      const lowest =
        typeof entry.lowestSellPrice === "number" && entry.lowestSellPrice > 0
          ? entry.lowestSellPrice
          : null;
      if (!lowest) continue;
      const avg =
        typeof entry.dailyAveragePrice === "number" &&
        entry.dailyAveragePrice > 0
          ? entry.dailyAveragePrice
          : null;
      const gameSell = computeGameSell(base.value, clan10, potion5);

      // Profitable (only items that can be sold to game)
      const canSell = base.canSellToGame !== false;
      const profitEach = gameSell - lowest;
      if (canSell && profitEach > 0) {
        const profitPercent = (profitEach / lowest) * 100;
        profitableRows.push({
          itemId: base.id,
          name: base.name,
          baseValue: base.value,
          gameSell,
          currentPrice: lowest,
          profitEach,
          profitPercent,
          volume:
            typeof entry.lowestPriceVolume === "number"
              ? entry.lowestPriceVolume
              : null,
        });
      }

      // Underpriced
      if (avg && lowest < avg) {
        const priceRatio = (lowest / avg) * 100;
        const priceDiff = avg - lowest;
        underpricedRows.push({
          itemId: base.id,
          name: base.name,
          averagePrice1d: avg,
          currentPrice: lowest,
          priceRatio,
          priceDiff,
          volume:
            typeof entry.lowestPriceVolume === "number"
              ? entry.lowestPriceVolume
              : null,
        });
      }
    }

    return { profitable: profitableRows, underpriced: underpricedRows };
  }, [latest, clan10, potion5]);

  const fetchVolumeFor = useCallback(async (itemId: number) => {
    let data: ItemComprehensive | null = null;
    try {
      data = await fetchItemComprehensive(itemId);
    } catch (err) {
      console.error("Error fetching volume for item", itemId, err);
      return { volumeAtLowest: null, details: null };
    }
    const volumeAtLowest = findVolumeAtLowest(data?.lowestPrices);
    return { volumeAtLowest, details: data };
  }, []);

  return {
    loading,
    error,
    profitable,
    underpriced,
    refresh,
    fetchVolumeFor,
    autoPotionCost,
  };
};
