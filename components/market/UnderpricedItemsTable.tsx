"use client";

import { useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { FaInfoCircle, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import type { UnderpricedRow } from "@/hooks/useMarketData";

interface Props {
  items: UnderpricedRow[];
}

const PAGE_SIZE = 20;
const formatNum = (n: number) => new Intl.NumberFormat().format(Math.round(n));

export default function UnderpricedItemsTable({ items }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{
    key: keyof UnderpricedRow | null;
    dir: "none" | "asc" | "desc";
  }>({ key: "priceRatio", dir: "asc" });
  // per-row fetch removed; rely on latest API data

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = q
      ? items.filter((i) => i.name.toLowerCase().includes(q))
      : items;

    // Hide entries with volume = 0 (using current known lowestPriceVolume)
    const withVolume = base.filter((it) => (it.volume ?? 0) > 0);

    const sorted =
      sort.key && sort.dir !== "none"
        ? [...withVolume].sort((a, b) => {
            const ak = a[sort.key as keyof UnderpricedRow] as unknown as number;
            const bk = b[sort.key as keyof UnderpricedRow] as unknown as number;
            const dir = sort.dir === "asc" ? 1 : -1;
            return (ak - bk) * dir;
          })
        : withVolume;
    return sorted;
  }, [items, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filtered.slice(start, end);

  const header = (
    label: string,
    key: keyof UnderpricedRow,
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
        if (s.key !== key) return { key, dir: "desc" };
        if (s.dir === "desc") return { key, dir: "asc" };
        if (s.dir === "asc") return { key: null, dir: "none" };
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

  // no per-row action

  return (
    <div className="border border-emerald-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#001818] rounded-t-lg">
        <h3 className="text-emerald-300 font-semibold flex items-center gap-2">
          <span>Underpriced Items</span>
          <FaInfoCircle
            className="text-emerald-400/80 cursor-pointer"
            data-tooltip-id="market-underpriced-tip"
            data-tooltip-content="Highlights items currently listed below their usual average price, suggesting potential buying opportunities. These items might be temporarily undervalued and could rise in price later."
            data-tooltip-place="bottom-start"
          />
          <span className="text-gray-400 text-sm ml-2">
            (total items: {filtered.length})
          </span>
        </h3>
        <Tooltip id="market-underpriced-tip" place="bottom-start" />
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
              {header("Daily Average", "averagePrice1d")}
              {header("Current Price", "currentPrice")}
              {header("Price Ratio", "priceRatio")}
              {header("Price Difference", "priceDiff")}
              <th className="px-3 py-2 text-left border-l border-emerald-800/60">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((it) => {
              const vol = it.volume ?? null;
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
                    {formatNum(it.averagePrice1d)}
                  </td>
                  <td className="px-3 py-2 text-emerald-300 border-l border-emerald-800/60">
                    {formatNum(it.currentPrice)}
                  </td>
                  <td className="px-3 py-2">
                    <span className="px-2 py-1 rounded bg-green-900 text-green-300">
                      {it.priceRatio.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-3 py-2 text-green-400 font-semibold border-l border-emerald-800/60">
                    {formatNum(it.priceDiff)}
                  </td>
                  <td className="px-3 py-2 text-emerald-300 border-l border-emerald-800/60">
                    {vol == null ? "?" : formatNum(vol)}
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
