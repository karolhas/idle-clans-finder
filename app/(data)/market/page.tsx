"use client";

import { useState } from "react";
import { FaStore, FaSync, FaTags, FaChartLine } from "react-icons/fa";
import { useMarketData } from "@/hooks/useMarketData";
import ProfitableItemsTable from "@/components/market/ProfitableItemsTable";
import UnderpricedItemsTable from "@/components/market/UnderpricedItemsTable";

export default function MarketPage() {
  // Modifiers: Clan +10% ON by default, Potion +5% OFF by default
  const [isClanBonusActive, setIsClanBonusActive] = useState(true);
  const [isPotionBonusActive, setIsPotionBonusActive] = useState(false);
  const [useAutoPotionCost, setUseAutoPotionCost] = useState(true);
  const [manualPotionCost, setManualPotionCost] = useState<string>("");

  const { loading, error, profitable, underpriced, refresh, autoPotionCost } =
    useMarketData(isClanBonusActive, isPotionBonusActive);

  const potionCost = useAutoPotionCost
    ? autoPotionCost || 0
    : Number.parseInt(manualPotionCost || "0", 10) || 0;

  return (
    <main className="min-h-screen bg-[#031111] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-700/30 bg-gradient-to-br from-[#001515] to-[#001212] p-6 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.1)] mb-8">
          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center gap-3">
                  <FaStore className="text-emerald-400" />
                  Market Analytics
                </h1>
                <p className="text-gray-400 mt-2 max-w-2xl">
                  Real-time market data analysis. Find profitable flips and
                  undervalued items. Daily Average uses 24h mean from the API.
                </p>
              </div>

              <button
                className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 shadow-lg ${
                  loading
                    ? "bg-white/5 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-900/20 hover:scale-105"
                }`}
                onClick={refresh}
                disabled={loading}
              >
                <FaSync className={loading ? "animate-spin" : ""} />
                {loading ? "Refreshing..." : "Refresh Data"}
              </button>
            </div>

            {/* Controls Section */}
            <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isClanBonusActive}
                    onChange={(e) => setIsClanBonusActive(e.target.checked)}
                  />
                  <div className="w-10 h-6 bg-gray-700 rounded-full peer-checked:bg-emerald-500 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="text-gray-300 font-medium group-hover:text-emerald-300 transition-colors">
                  Clan +10%
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={isPotionBonusActive}
                    onChange={(e) => setIsPotionBonusActive(e.target.checked)}
                  />
                  <div className="w-10 h-6 bg-gray-700 rounded-full peer-checked:bg-emerald-500 transition-colors"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                </div>
                <span className="text-gray-300 font-medium group-hover:text-emerald-300 transition-colors">
                  Potion +5%
                </span>
              </label>

              {isPotionBonusActive && (
                <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-wrap items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useAutoPotionCost}
                      onChange={(e) => setUseAutoPotionCost(e.target.checked)}
                      className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500 bg-gray-700"
                    />
                    <span className="text-sm text-gray-300">Auto cost</span>
                  </label>

                  {!useAutoPotionCost ? (
                    <input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="Cost"
                      value={manualPotionCost}
                      onChange={(e) => setManualPotionCost(e.target.value)}
                      className="w-32 px-3 py-1 bg-[#0a1f1f] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500/50"
                    />
                  ) : (
                    <span className="text-sm text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded">
                      {autoPotionCost ? autoPotionCost.toLocaleString() : "—"}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-emerald-400 mb-4">
              <FaTags />
              <h2>Profitable Items</h2>
            </div>
            <ProfitableItemsTable
              items={profitable}
              potionEnabled={isPotionBonusActive}
              potionCost={potionCost}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold text-emerald-400 mb-4">
              <FaChartLine />
              <h2>Underpriced Items</h2>
            </div>
            <UnderpricedItemsTable items={underpriced} />
          </div>
        </div>
      </div>
    </main>
  );
}
