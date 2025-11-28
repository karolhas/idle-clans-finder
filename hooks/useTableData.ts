"use client";

import { useMemo, useState } from "react";

interface SortConfig<T> {
  key: keyof T | string | null;
  dir: "none" | "asc" | "desc";
}

interface UseTableDataConfig<T> {
  searchFields: (keyof T)[];
  defaultSort?: SortConfig<T>;
  pageSize?: number;
  customFilter?: (item: T) => boolean;
  customSort?: (
    a: T,
    b: T,
    key: keyof T | string | null,
    dir: "asc" | "desc"
  ) => number;
}

export function useTableData<T>(items: T[], config: UseTableDataConfig<T>) {
  const {
    searchFields,
    defaultSort = { key: null, dir: "none" },
    pageSize = 20,
    customFilter,
    customSort,
  } = config;

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortConfig<T>>(defaultSort);

  const filteredItems = useMemo(() => {
    let result = items;

    if (query.trim()) {
      const lowerQuery = query.trim().toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const val = item[field];
          return String(val).toLowerCase().includes(lowerQuery);
        })
      );
    }

    if (customFilter) {
      result = result.filter(customFilter);
    }

    // 3. Sorting
    if (sort.key && sort.dir !== "none") {
      result = [...result].sort((a, b) => {
        if (customSort) {
          return customSort(
            a,
            b,
            sort.key,
            sort.dir === "asc" ? "asc" : "desc"
          );
        }

        const key = sort.key as keyof T;
        const valA = a[key];
        const valB = b[key];
        const dir = sort.dir === "asc" ? 1 : -1;

        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1; // nulls last
        if (valB === null || valB === undefined) return -1;

        if (typeof valA === "string" && typeof valB === "string") {
          return valA.localeCompare(valB) * dir;
        }

        if (typeof valA === "number" && typeof valB === "number") {
          return (valA - valB) * dir;
        }

        return 0;
      });
    }

    return result;
  }, [items, query, sort, searchFields, customFilter, customSort]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));

  // Ensure page is valid
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = filteredItems.slice(start, end);

  // Reset page when query changes
  useMemo(() => {
    if (page !== 1) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return {
    query,
    setQuery,
    page: currentPage,
    setPage,
    sort,
    setSort,
    pageItems,
    totalPages,
    totalItems: filteredItems.length,
  };
}
