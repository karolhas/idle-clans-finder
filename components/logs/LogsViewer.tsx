"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { fetchPlayerProfile } from "@/lib/api/apiService";
import {
  FaUser,
  FaShieldAlt,
  FaSearch,
  FaTimes,
  FaHistory,
  FaChevronDown,
  FaChevronUp,
  FaTrash,
} from "react-icons/fa";

type Mode = "clan" | "player";

interface Props {
  initialMode?: Mode;
  initialQuery?: string;
  autoSearch?: boolean;
}

type LogRow = {
  timestamp: string;
  message: string;
  memberUsername?: string;
  clanName?: string;
};

const MAX_LOGS = 500;
const PAGE_SIZE = 100;

export default function LogsViewer({
  initialMode = "player",
  initialQuery = "",
  autoSearch = false,
}: Props) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [query, setQuery] = useState(initialQuery);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [error, setError] = useState("");

  // Recent searches state
  const [playerSearches, setPlayerSearches] = useState<string[]>([]);
  const [clanSearches, setClanSearches] = useState<string[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  // URL & routing hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Load recent searches on mount
  useEffect(() => {
    const savedPlayerSearches = localStorage.getItem(
      "recentLogsPlayerSearches"
    );
    if (savedPlayerSearches) {
      setPlayerSearches(JSON.parse(savedPlayerSearches));
    }

    const savedClanSearches = localStorage.getItem("recentLogsClanSearches");
    if (savedClanSearches) {
      setClanSearches(JSON.parse(savedClanSearches));
    }
  }, []);

  // Update localStorage whenever searches change
  useEffect(() => {
    if (playerSearches.length > 0) {
      localStorage.setItem(
        "recentLogsPlayerSearches",
        JSON.stringify(playerSearches)
      );
    }
    if (clanSearches.length > 0) {
      localStorage.setItem(
        "recentLogsClanSearches",
        JSON.stringify(clanSearches)
      );
    }
  }, [playerSearches, clanSearches]);

  const addToRecentSearches = (term: string, mode: Mode) => {
    if (mode === "player") {
      setPlayerSearches((prev) => {
        const newSearches = prev.includes(term) ? prev : [term, ...prev];
        return newSearches.slice(0, 5); // Max 5 searches
      });
    } else {
      setClanSearches((prev) => {
        const newSearches = prev.includes(term) ? prev : [term, ...prev];
        return newSearches.slice(0, 5); // Max 5 searches
      });
    }
  };

  const clearHistory = () => {
    if (mode === "player") {
      setPlayerSearches([]);
      localStorage.removeItem("recentLogsPlayerSearches");
    } else {
      setClanSearches([]);
      localStorage.removeItem("recentLogsClanSearches");
    }
  };

  const updateUrl = (nextQ: string, nextMode: Mode) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (nextQ) params.set("q", nextQ);
    else params.delete("q");
    params.set("mode", nextMode);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchClanLogs = async (name: string) => {
    const q = name.trim();
    if (!q) {
      setError("Please enter a clan name.");
      return;
    }

    setLoading(true);
    setError("");
    setLogs([]);
    setLoadedCount(0);

    const base = `https://query.idleclans.com/api/Clan/logs/clan/${encodeURIComponent(
      q
    )}`;

    try {
      let all: LogRow[] = [];
      let skip = 0;
      let pagingSupported = true;
      let safetySeenFirstStamp: string | null = null;

      while (all.length < MAX_LOGS) {
        const remaining = MAX_LOGS - all.length;
        const limit = Math.min(PAGE_SIZE, remaining);
        const url = `${base}?skip=${skip}&limit=${limit}`;

        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 404) break;
          pagingSupported = false;
          break;
        }

        const batchJson: unknown = await res.json();
        const batch: LogRow[] = Array.isArray(batchJson)
          ? (batchJson as LogRow[])
          : [batchJson as LogRow];

        if (batch.length === 0) break;

        const firstTs = batch[0]?.timestamp ?? null;
        if (safetySeenFirstStamp && firstTs === safetySeenFirstStamp) {
          pagingSupported = false;
          break;
        }
        safetySeenFirstStamp = firstTs;

        all = all.concat(batch);
        setLoadedCount(all.length);

        if (batch.length < limit) break;
        skip += limit;

        await new Promise((r) => setTimeout(r, 300));
      }

      if (!pagingSupported) {
        const res = await fetch(base);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const singleJson: unknown = await res.json();
        const single: LogRow[] = Array.isArray(singleJson)
          ? (singleJson as LogRow[])
          : [singleJson as LogRow];
        all = single.slice(0, MAX_LOGS);
        setLoadedCount(all.length);
      }

      all.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
      setLogs(all);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Error fetching clan logs: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerLogs = async (name: string) => {
    const q = name.trim();
    if (!q) {
      setError("Please enter a player name.");
      return;
    }

    setLoading(true);
    setError("");
    setLogs([]);
    setLoadedCount(0);

    try {
      // Step 1: Fetch player profile to get guild name
      let guildName = "";
      try {
        const profile = await fetchPlayerProfile(q);
        guildName = profile.guildName ?? "";
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg === "Player not found.") {
          setError("Player not found.");
          setLoading(false);
          return;
        }
        throw err;
      }

      if (!guildName) {
        setError("Player is not in a clan.");
        setLoading(false);
        return;
      }

      let all: LogRow[] = [];
      let skip = 0;

      while (all.length < MAX_LOGS) {
        const remaining = MAX_LOGS - all.length;
        const limit = Math.min(PAGE_SIZE, remaining);
        // Use the endpoint: api/Clan/logs/clan/{clanName}/{playerName}
        const url = `https://query.idleclans.com/api/Clan/logs/clan/${encodeURIComponent(
          guildName
        )}/${encodeURIComponent(q)}?skip=${skip}&limit=${limit}`;

        const res = await fetch(url);
        if (!res.ok) {
          if (res.status === 404) {
            // Logs not found (e.g. player has no logs in this clan recently)
            break;
          }
          throw new Error(`API error: ${res.status}`);
        }

        const batchJson: unknown = await res.json();
        const batch: LogRow[] = Array.isArray(batchJson)
          ? (batchJson as LogRow[])
          : [batchJson as LogRow];

        all = all.concat(batch);
        setLoadedCount(all.length);

        if (batch.length < limit) break;
        skip += limit;

        await new Promise((r) => setTimeout(r, 300));
      }

      all.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp));
      setLogs(all);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(`Error fetching player logs: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const onSearch = () => {
    const q = query.trim();
    if (!q) return;
    updateUrl(q, mode);
    if (mode === "clan") {
      addToRecentSearches(q, "clan");
      fetchClanLogs(q);
    } else {
      addToRecentSearches(q, "player");
      fetchPlayerLogs(q);
    }
  };

  useEffect(() => {
    if (autoSearch && initialQuery) {
      onSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep state in sync with URL (back/forward/share)
  useEffect(() => {
    const urlQ = searchParams.get("q") ?? "";
    const urlMode = (
      searchParams.get("mode") === "clan" ? "clan" : "player"
    ) as Mode;

    if (urlQ === query && urlMode === mode) return;

    setMode(urlMode);
    setQuery(urlQ);
    setLogs([]);
    setSearchTerm("");
    setError("");
    setLoadedCount(0);

    if (autoSearch && urlQ) {
      if (urlMode === "clan") fetchClanLogs(urlQ);
      else fetchPlayerLogs(urlQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filteredLogs = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return logs.filter((log) => {
      const msg = (log.message ?? "").toLowerCase();
      const mem = (log.memberUsername ?? "").toLowerCase();
      const cln = (log.clanName ?? "").toLowerCase();
      return (
        msg.includes(term) ||
        mem.includes(term) ||
        (mode === "player" ? cln.includes(term) : false)
      );
    });
  }, [logs, searchTerm, mode]);

  return (
    <div className="mx-auto max-w-6xl relative overflow-hidden">
      {/* Background Glow Effects - consistent with SearchContainer */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 p-6 md:p-8 rounded-3xl border-2 border-emerald-700/30 bg-gradient-to-br from-[#001515] to-[#001212] shadow-[0_0_40px_rgba(16,185,129,0.1)] overflow-hidden">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-2 drop-shadow-sm">
            Logs Viewer
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Track player and clan activities in real-time
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-black/40 p-1.5 rounded-xl inline-flex border border-white/5 backdrop-blur-md shadow-inner">
            <button
              type="button"
              onClick={() => {
                setMode("player");
                setLogs([]);
                setSearchTerm("");
                setError("");
                setLoadedCount(0);
                updateUrl(query, "player");
              }}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                mode === "player"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaUser
                className={`w-4 h-4 ${
                  mode === "player" ? "text-emerald-200" : "text-gray-500"
                }`}
              />
              Player Logs
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("clan");
                setLogs([]);
                setSearchTerm("");
                setError("");
                setLoadedCount(0);
                updateUrl(query, "clan");
              }}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                mode === "clan"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/50"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <FaShieldAlt
                className={`w-4 h-4 ${
                  mode === "clan" ? "text-emerald-200" : "text-gray-500"
                }`}
              />
              Clan Logs
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-center w-full">
            <div className="relative group w-full max-w-2xl">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    mode === "player"
                      ? "Enter player name..."
                      : "Enter clan name..."
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  className="w-full pl-12 pr-32 py-3 bg-[#0a1f1f]/80 border-2 border-white/10 rounded-xl text-base text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300 backdrop-blur-xl shadow-inner"
                  disabled={loading}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300">
                  <FaSearch className="w-5 h-5" />
                </div>

                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-28 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}

                <button
                  onClick={onSearch}
                  disabled={loading || !query.trim()}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    loading || !query.trim()
                      ? "bg-white/5 text-gray-500 cursor-not-allowed"
                      : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 hover:scale-105"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>
                        {loadedCount > 0 ? `${loadedCount}` : "Loading"}
                      </span>
                    </div>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Searches */}
          {(mode === "player" ? playerSearches : clanSearches).length > 0 && (
            <div className="mt-4 w-full max-w-2xl animate-fade-in">
              <div className="flex items-center justify-between mb-3 text-xs md:text-sm text-gray-400 px-1">
                <button
                  onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <FaHistory className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-medium">Recent Searches</span>
                  {isHistoryVisible ? (
                    <FaChevronUp className="w-3 h-3" />
                  ) : (
                    <FaChevronDown className="w-3 h-3" />
                  )}
                </button>
                {isHistoryVisible && (
                  <button
                    onClick={clearHistory}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors group"
                  >
                    <FaTrash className="w-3 h-3" />
                    <span className="group-hover:underline">Clear History</span>
                  </button>
                )}
              </div>

              {isHistoryVisible && (
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {(mode === "player" ? playerSearches : clanSearches).map(
                    (term, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(term);
                          // We need to defer the search slightly or handle it directly
                          // Since state update is async, direct call is better but need to pass term
                          // Or update url and fetch directly
                          updateUrl(term, mode);
                          if (mode === "clan") fetchClanLogs(term);
                          else fetchPlayerLogs(term);
                          addToRecentSearches(term, mode);
                        }}
                        className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200 text-sm text-gray-300 hover:text-emerald-300"
                      >
                        <span>{term}</span>
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-400 mb-6 text-center max-w-2xl mx-auto">
          {mode === "player"
            ? `Viewing player's clan logs (up to ${MAX_LOGS}). Filter by message content, player name, or clan name.`
            : `Viewing clan logs (up to ${MAX_LOGS}). Use the filter below to narrow down messages or find specific members.`}
        </p>

        {logs.length > 0 && (
          <div className="mb-6 flex justify-center">
            <div className="relative w-full max-w-lg group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder={
                  mode === "player"
                    ? "Filter by keyword, player, or clan..."
                    : "Filter results..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-emerald-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:bg-black/40 transition-all duration-300"
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/30 text-red-200 text-center backdrop-blur-sm">
            {error}
          </div>
        )}

        {filteredLogs.length > 0 && (
          <p className="text-sm text-emerald-400/80 mb-4 text-center font-medium">
            Showing {filteredLogs.length.toLocaleString()} log
            {filteredLogs.length === 1 ? "" : "s"} (loaded{" "}
            {loadedCount.toLocaleString()})
          </p>
        )}

        {filteredLogs.length > 0 ? (
          <div className="rounded-xl border border-emerald-800/30 bg-black/20 overflow-hidden shadow-inner backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-emerald-950/40 text-emerald-100/90 text-sm uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4 font-semibold border-b border-emerald-800/30">
                      #
                    </th>
                    {mode === "player" && (
                      <th className="px-6 py-4 font-semibold border-b border-emerald-800/30">
                        Clan
                      </th>
                    )}
                    <th className="px-6 py-4 font-semibold border-b border-emerald-800/30">
                      Member
                    </th>
                    <th className="px-6 py-4 font-semibold border-b border-emerald-800/30">
                      Message
                    </th>
                    <th className="px-6 py-4 font-semibold border-b border-emerald-800/30">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-800/20 text-sm text-gray-300">
                  {filteredLogs.map((log, idx) => (
                    <tr
                      key={`${log.timestamp}-${idx}`}
                      className="hover:bg-emerald-600/5 transition-colors duration-150 group"
                    >
                      <td className="px-6 py-3.5 text-gray-500 font-mono text-xs">
                        {idx + 1}
                      </td>
                      {mode === "player" && (
                        <td className="px-6 py-3.5 text-emerald-300 font-medium">
                          {log.clanName ?? "—"}
                        </td>
                      )}
                      <td className="px-6 py-3.5 font-medium text-white group-hover:text-emerald-200 transition-colors">
                        {log.memberUsername ?? "Unknown"}
                      </td>
                      <td className="px-6 py-3.5 leading-relaxed">
                        {log.message}
                      </td>
                      <td className="px-6 py-3.5 text-gray-400 whitespace-nowrap text-xs">
                        {new Date(log.timestamp).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          !loading &&
          logs.length > 0 && (
            <div className="p-8 text-center text-gray-400 bg-black/20 rounded-xl border border-white/5">
              <p>No logs match your filter.</p>
            </div>
          )
        )}

        {!loading && logs.length === 0 && !error && (
          <div className="p-12 text-center text-gray-400 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-4 text-emerald-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                ></path>
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-300">
              No logs to display
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {mode === "player"
                ? query
                  ? "No clan logs found for this player."
                  : "Search a player above to see their clan history."
                : query
                ? "No logs found for this clan."
                : "Search a clan above to start viewing their activity logs."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
