"use client";

import { useTableData } from "@/hooks/useTableData";
import { ProfitableRow } from "@/types/market.types";
import { useCallback } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaInfoCircle,
  FaSearch,
  FaSort,
  FaSortDown,
  FaSortUp,
} from "react-icons/fa";
import { Tooltip } from "react-tooltip";

interface Props {
  items: ProfitableRow[];
  potionEnabled?: boolean;
  potionCost?: number; // cost deducted from total profit when potion is enabled
}

const formatNum = (n: number) => new Intl.NumberFormat().format(Math.round(n));

export default function ProfitableItemsTable({
  items,
  potionEnabled = false,
  potionCost = 0,
}: Props) {
  const customFilter = useCallback(
    (it: ProfitableRow) => {
      if ((it.volume || 0) === 0) return false;
      const vol = it.volume ?? 1;
      const gross = it.profitEach * vol;
      const total = potionEnabled ? gross - (potionCost || 0) : gross;
      return total > 0;
    },
    [potionEnabled, potionCost]
  );

  const customSort = useCallback(
    (
      a: ProfitableRow,
      b: ProfitableRow,
      key: keyof ProfitableRow | string | null,
      dir: "asc" | "desc"
    ) => {
      let valA = 0;
      let valB = 0;
      const direction = dir === "asc" ? 1 : -1;

      if (key === "totalProfit") {
        // Calculate total profit for sorting
        const volA = a.volume ?? 1;
        const grossA = a.profitEach * volA;
        valA = potionEnabled ? grossA - (potionCost || 0) : grossA;

        const volB = b.volume ?? 1;
        const grossB = b.profitEach * volB;
        valB = potionEnabled ? grossB - (potionCost || 0) : grossB;
      } else {
        const k = key as keyof ProfitableRow;
        const vA = a[k];
        const vB = b[k];
        valA = typeof vA === "number" ? vA : 0;
        valB = typeof vB === "number" ? vB : 0;
      }

      return (valA - valB) * direction;
    },
    [potionEnabled, potionCost]
  );

  const {
    query,
    setQuery,
    page,
    setPage,
    sort,
    setSort,
    pageItems,
    totalPages,
    totalItems,
  } = useTableData<ProfitableRow>(items, {
    searchFields: ["name"],
    defaultSort: { key: "profitPercent", dir: "desc" },
    pageSize: 20,
    customFilter,
    customSort,
  });

  const header = (
    label: string,
    key: keyof ProfitableRow | string,
    align: "left" | "right" = "right"
  ) => {
    const isActive = sort.key === key;
    const icon =
      !isActive || sort.dir === "none" ? (
        <FaSort className="opacity-20 group-hover:opacity-50" />
      ) : sort.dir === "asc" ? (
        <FaSortUp className="text-emerald-400" />
      ) : (
        <FaSortDown className="text-emerald-400" />
      );

    const cycle = () => {
      setSort((s) => {
        if (s.key !== key) return { key, dir: "desc" };
        if (s.dir === "desc") return { key, dir: "asc" };
        if (s.dir === "asc") return { key: null, dir: "none" };
        return { key, dir: "desc" };
      });
    };

    return (
      <th
        className={`px-4 py-3 cursor-pointer text-xs font-medium text-gray-400 uppercase tracking-wider hover:bg-white/5 transition-colors group select-none text-${align}`}
        onClick={cycle}
      >
        <div
          className={`flex items-center gap-2 ${
            align === "right" ? "justify-end" : "justify-start"
          }`}
        >
          {label}
          {icon}
        </div>
      </th>
    );
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <FaInfoCircle
            className="text-emerald-400/80 cursor-pointer hover:text-emerald-300 transition-colors"
            data-tooltip-id="market-profitable-tip"
            data-tooltip-content="Items that can be bought from players and sold to the game for profit."
          />
          <span>{totalItems} items</span>
          <Tooltip
            id="market-profitable-tip"
            style={{
              backgroundColor: "#064e3b",
              color: "#fff",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className="relative w-full sm:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items..."
            className="w-full sm:w-48 pl-9 pr-3 py-1.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full whitespace-nowrap">
          <thead>
            <tr className="bg-black/20 border-b border-white/5">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Item Name
              </th>
              {header("Game Sell", "gameSell")}
              {header("Market Price", "currentPrice")}
              {header("Volume", "volume")}
              {header("Profit/E", "profitEach")}
              {header("Total", "totalProfit")}
              {header("Profit %", "profitPercent")}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pageItems.map((it) => {
              const volume = it.volume ?? 1;
              const grossTotal = it.profitEach * volume;
              const totalProfit = potionEnabled
                ? grossTotal - (potionCost || 0)
                : grossTotal;

              return (
                <tr
                  key={it.itemId}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-4 py-3 text-sm text-emerald-100 font-medium">
                    {it.name.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 text-right">
                    {formatNum(it.gameSell)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 text-right">
                    {formatNum(it.currentPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 text-right font-mono">
                    {formatNum(volume)}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-400 font-medium text-right">
                    {formatNum(it.profitEach)}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-400 font-bold text-right shadow-emerald-500/5">
                    {formatNum(totalProfit)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {it.profitPercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-white/5 flex items-center justify-center gap-4 bg-black/40">
          <button
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <FaChevronLeft className="w-3 h-3" />
          </button>
          <span className="text-xs text-gray-500 font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <FaChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
