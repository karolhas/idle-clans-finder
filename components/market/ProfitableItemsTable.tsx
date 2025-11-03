"use client";

import { useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { FaInfoCircle, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import type { ProfitableRow } from "@/hooks/useMarketData";

interface Props {
  items: ProfitableRow[];
  potionEnabled?: boolean;
  potionCost?: number; // cost deducted from total profit when potion is enabled
}

const PAGE_SIZE = 20;

const formatNum = (n: number) => new Intl.NumberFormat().format(Math.round(n));

export default function ProfitableItemsTable({
  items,
  potionEnabled = false,
  potionCost = 0,
}: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  // fixed page size and tri-state sort (none | asc | desc)
  const [sort, setSort] = useState<{
    key: keyof ProfitableRow | null;
    dir: "none" | "asc" | "desc";
  }>({ key: "profitPercent", dir: "desc" });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? items.filter((i) => i.name.toLowerCase().includes(q))
      : items;

    const profitPositive = base.filter((it) => {
      // Hide volume 0 strictly; keep null/undefined as unknown (display as 1 by default)
      if (it.volume === 0) return false;
      const vol = it.volume ?? 1;
      const gross = it.profitEach * vol;
      const total = potionEnabled ? gross - (potionCost || 0) : gross;
      return total > 0;
    });

    const sorted =
      sort.key && sort.dir !== "none"
        ? [...profitPositive].sort((a, b) => {
            const ak = a[sort.key as keyof ProfitableRow] as unknown as number;
            const bk = b[sort.key as keyof ProfitableRow] as unknown as number;
            const dir = sort.dir === "asc" ? 1 : -1;
            return (ak - bk) * dir;
          })
        : profitPositive;
    return sorted;
  }, [items, query, sort, potionEnabled, potionCost]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filtered.slice(start, end);

  const header = (
    label: string,
    key: keyof ProfitableRow,
    withBorder: boolean = true
  ) => {
    const isActive = sort.key === key;
    const icon =
      !isActive || sort.dir === "none" ? (
        <FaSort className="opacity-40" />
      ) : sort.dir === "asc" ? (
        <FaSortUp />
      ) : (
        <FaSortDown />
      );
    const cycle = () => {
      setSort((s) => {
        if (s.key !== key) return { key, dir: "desc" }; // Highest first
        if (s.dir === "desc") return { key, dir: "asc" }; // Lowest
        if (s.dir === "asc") return { key: null, dir: "none" }; // None
        return { key, dir: "desc" };
      });
    };
    return (
      <th
        className={`px-3 py-2 cursor-pointer text-left ${
          withBorder ? "border-l border-emerald-800/60" : ""
        }`}
        onClick={cycle}
      >
        <span className="inline-flex items-center gap-1 whitespace-nowrap">
          {label}
          {icon}
        </span>
      </th>
    );
  };

  return (
    <div className="border border-emerald-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#001818] rounded-t-lg">
        <h3 className="text-emerald-300 font-semibold flex items-center gap-2">
          <span>Profitable Items</span>
          <FaInfoCircle
            className="text-emerald-400/80 cursor-pointer"
            data-tooltip-id="market-profitable-tip"
            data-tooltip-content="Displays items that can be purchased from other players and sold directly to the game for a profit. The game’s buyback price exceeds the current market value."
            data-tooltip-place="bottom-start"
          />
          <span className="text-gray-400 text-sm ml-2">
            (total items: {filtered.length})
          </span>
        </h3>
        <Tooltip id="market-profitable-tip" place="bottom-start" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search items..."
          className="hidden md:block px-2 py-1 text-sm rounded bg-gray-200 text-gray-800 border border-gray-400"
        />
      </div>

      <div className="overflow-x-auto rounded-b-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-[#002020] text-emerald-200">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              {header("Game Sell Value", "gameSell")}
              {header("Market Sell Price", "currentPrice")}
              <th className="px-3 py-2 text-left border-l border-emerald-800/60">
                Volume
              </th>
              {header("Profit/Each", "profitEach")}
              <th className="px-3 py-2 text-left border-l border-emerald-800/60">
                Total Profit
              </th>
              {header("Profit %", "profitPercent")}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((it) => {
              const volume = it.volume ?? 1; // default
              const grossTotal = it.profitEach * volume;
              const totalProfit = potionEnabled
                ? grossTotal - (potionCost || 0)
                : grossTotal;
              return (
                <tr
                  key={it.itemId}
                  className="odd:bg-[#021b1b] even:bg-[#031e1e]"
                >
                  <td className="px-3 py-2 text-emerald-100">
                    <div className="leading-tight">
                      <div className="font-medium">
                        {it.name.replace(/_/g, " ")}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-emerald-300 border-l border-emerald-800/60">
                    {formatNum(it.gameSell)}
                  </td>
                  <td className="px-3 py-2 text-emerald-300 border-l border-emerald-800/60">
                    {formatNum(it.currentPrice)}
                  </td>
                  <td className="px-3 py-2 text-emerald-300 border-l border-emerald-800/60">
                    {formatNum(volume)}
                  </td>
                  <td className="px-3 py-2 text-green-400 font-semibold border-l border-emerald-800/60">
                    {formatNum(it.profitEach)}
                  </td>
                  <td className="px-3 py-2 text-green-400 font-semibold border-l border-emerald-800/60">
                    {formatNum(totalProfit)}
                  </td>
                  <td className="px-3 py-2 border-l border-emerald-800/60">
                    <span className="px-2 py-1 rounded bg-green-900 text-green-300">
                      {it.profitPercent.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center px-4 py-3 bg-[#001818] text-emerald-200">
        <div className="flex items-center gap-3">
          <button
            className="px-2 py-1 border border-emerald-700 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            &lt;
          </button>
          <span>
            {page} / {totalPages}
          </span>
          <button
            className="px-2 py-1 border border-emerald-700 rounded disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
