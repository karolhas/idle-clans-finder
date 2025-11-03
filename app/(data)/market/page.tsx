"use client";

import { useState } from "react";
import { FaStore, FaSync } from "react-icons/fa";
import { useMarketData } from "@/hooks/useMarketData";
import ProfitableItemsTable from "@/components/market/ProfitableItemsTable";
import UnderpricedItemsTable from "@/components/market/UnderpricedItemsTable";

export default function MarketPage() {
  // Modifiers: Clan +10% ON by default, Potion +5% OFF by default
  const [clan10, setClan10] = useState(true);
  const [potion5, setPotion5] = useState(false);
  const [useAutoPotionCost, setUseAutoPotionCost] = useState(true);
  const [manualPotionCost, setManualPotionCost] = useState<string>("");

  const { loading, error, profitable, underpriced, refresh, autoPotionCost } =
    useMarketData(clan10, potion5);

  const potionCost = useAutoPotionCost
    ? autoPotionCost || 0
    : Number.parseInt(manualPotionCost || "0", 10) || 0;

  return (
    <main className="p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center">
          <FaStore className="mr-3" />
          Market
        </h1>

        <div className="border border-emerald-700 rounded-lg mb-6">
          <div className="bg-[#002020] rounded-t-lg p-6">
            <h2 className="text-white text-lg font-semibold mb-2">Profit</h2>
            <p className="text-gray-300 text-sm">
              Real-time data from player market. Daily Average uses 24h mean
              from the API. Game sell modifiers can be toggled.
            </p>
          </div>
          <div className="p-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-emerald-200">
              <input
                type="checkbox"
                checked={clan10}
                onChange={(e) => setClan10(e.target.checked)}
              />
              <span>Clan +10%</span>
            </label>
            <label className="flex items-center gap-2 text-emerald-200">
              <input
                type="checkbox"
                checked={potion5}
                onChange={(e) => setPotion5(e.target.checked)}
              />
              <span>Potion +5%</span>
            </label>
            {potion5 && (
              <div className="flex items-center gap-2 text-emerald-200">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useAutoPotionCost}
                    onChange={(e) => setUseAutoPotionCost(e.target.checked)}
                  />
                  <span>Auto potion price</span>
                </label>
                {!useAutoPotionCost && (
                  <input
                    type="number"
                    min={0}
                    step={1}
                    placeholder="Potion cost"
                    value={manualPotionCost}
                    onChange={(e) => setManualPotionCost(e.target.value)}
                    className="px-2 py-1 rounded bg-gray-200 text-gray-800 border border-gray-400 w-32"
                  />
                )}
                {useAutoPotionCost && (
                  <span className="text-sm text-emerald-300">
                    Current:{" "}
                    {autoPotionCost ? autoPotionCost.toLocaleString() : "—"}
                  </span>
                )}
              </div>
            )}
            <button
              className="ml-auto px-3 py-1 bg-emerald-700 hover:bg-emerald-800 rounded text-white flex items-center gap-2 disabled:opacity-50"
              onClick={refresh}
              disabled={loading}
            >
              <FaSync /> Fetch Data
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading && (
          <div className="bg-[#002020] p-8 rounded-lg shadow-lg text-center mb-6">
            <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-300 mt-3">Loading latest market data…</p>
          </div>
        )}

        <div className="space-y-6">
          <ProfitableItemsTable
            items={profitable}
            potionEnabled={potion5}
            potionCost={potionCost}
          />
          <UnderpricedItemsTable items={underpriced} />
        </div>
      </div>
    </main>
  );
}
