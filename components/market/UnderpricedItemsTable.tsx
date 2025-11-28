"use client";

import { useTableData } from "@/hooks/useTableData";
import { UnderpricedRow } from "@/types/market.types";
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
  items: UnderpricedRow[];
}

const formatNum = (n: number) => new Intl.NumberFormat().format(Math.round(n));

export default function UnderpricedItemsTable({ items }: Props) {
  const customFilter = (it: UnderpricedRow) => (it.volume ?? 0) > 0;

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
  } = useTableData<UnderpricedRow>(items, {
    searchFields: ["name"],
    defaultSort: { key: "priceRatio", dir: "asc" },
    pageSize: 20,
    customFilter,
  });

  const header = (
    label: string,
    key: keyof UnderpricedRow | string,
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
            data-tooltip-id="market-underpriced-tip"
            data-tooltip-content="Items listed below their daily average price."
          />
          <span>{totalItems} items</span>
          <Tooltip
            id="market-underpriced-tip"
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
              {header("Daily Avg", "averagePrice1d")}
              {header("Current", "currentPrice")}
              {header("Ratio", "priceRatio")}
              {header("Diff", "priceDiff")}
              {header("Volume", "volume")}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pageItems.map((it) => {
              const vol = it.volume ?? null;
              return (
                <tr
                  key={it.itemId}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-4 py-3 text-sm text-emerald-100 font-medium">
                    {it.name.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300 text-right">
                    {formatNum(it.averagePrice1d)}
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-300 font-medium text-right">
                    {formatNum(it.currentPrice)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {it.priceRatio.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-emerald-400 text-right font-medium">
                    {formatNum(it.priceDiff)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400 text-right font-mono">
                    {vol == null ? "?" : formatNum(vol)}
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
