"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

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
  initialMode = "clan",
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

  // URL & routing hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();


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

    const base = `https://query.idleclans.com/api/Clan/logs/clan/${encodeURIComponent(q)}`;

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
          pagingSupported = false;
          break;
        }

        const batchJson: unknown = await res.json();
        const batch: LogRow[] = Array.isArray(batchJson)
          ? (batchJson as LogRow[])
          : ([batchJson as LogRow]);

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
          : ([singleJson as LogRow]);
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
      let all: LogRow[] = [];
      let skip = 0;

      while (all.length < MAX_LOGS) {
        const remaining = MAX_LOGS - all.length;
        const limit = Math.min(PAGE_SIZE, remaining);
        const url = `https://query.idleclans.com/api/Player/clan-logs/${encodeURIComponent(q)}?skip=${skip}&limit=${limit}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const batchJson: unknown = await res.json();
        const batch: LogRow[] = Array.isArray(batchJson)
          ? (batchJson as LogRow[])
          : ([batchJson as LogRow]);

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
    if (mode === "clan") fetchClanLogs(q);
    else fetchPlayerLogs(q);
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
    const urlMode = (searchParams.get("mode") === "player" ? "player" : "clan") as Mode;

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
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Logs Viewer</h1>

      {/* Toggle */}
      <div className="flex justify-center gap-2 mb-3">
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
          className={`px-4 py-2 rounded-lg font-semibold text-white ${
            mode === "clan" ? "bg-emerald-600" : "bg-emerald-800/50"
          }`}
        >
          Clan Logs
        </button>
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
          className={`px-4 py-2 rounded-lg font-semibold text-white ${
            mode === "player" ? "bg-emerald-600" : "bg-emerald-800/50"
          }`}
        >
          Player Logs
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-wrap gap-2 items-center justify-center">
        <input
          type="text"
          placeholder={mode === "clan" ? "Enter clan name..." : "Enter player name..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          className="w-[280px] px-3 py-2 rounded-md border border-emerald-700 bg-[#001f1f] text-white outline-none"
        />
        <button
          onClick={onSearch}
          disabled={loading || !query.trim()}
          className="px-3 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-60"
        >
          {loading ? `Loading (${loadedCount}/${MAX_LOGS})` : "Search"}
        </button>
      </div>

      <p className="text-sm text-gray-300 mt-2 text-center">
        {mode === "clan"
          ? `Viewing clan logs (up to ${MAX_LOGS}). Use the filter to search messages or players.`
          : `Viewing player's clan logs (up to ${MAX_LOGS}). Use the filter to search messages, players, or clan names.`}
      </p>

      {logs.length > 0 && (
        <div className="mt-3 flex justify-center">
          <input
            type="text"
            placeholder={
              mode === "clan"
                ? "Filter logs by keyword or player..."
                : "Filter logs by keyword, player, or clan..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[420px] max-w-full px-3 py-2 rounded-md border border-emerald-700 bg-[#001f1f] text-white outline-none"
          />
        </div>
      )}

      {error && <div className="mt-3 text-center text-red-400">{error}</div>}

      {filteredLogs.length > 0 && (
        <p className="text-sm text-gray-300 mt-2 text-center">
          Showing {filteredLogs.length.toLocaleString()} log
          {filteredLogs.length === 1 ? "" : "s"} (loaded {loadedCount.toLocaleString()})
        </p>
      )}

      {filteredLogs.length > 0 ? (
        <div className="mt-3 overflow-x-auto rounded-lg border border-emerald-800/40">
          <table className="w-full text-left">
            <thead className="bg-emerald-900/40 text-emerald-100">
              <tr>
                <th className="px-3 py-2">#</th>
                {mode === "player" && <th className="px-3 py-2">Clan</th>}
                <th className="px-3 py-2">Member</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={`${log.timestamp}-${idx}`} className="odd:bg-[#001a1a]">
                  <td className="px-3 py-2">{idx + 1}</td>
                  {mode === "player" && <td className="px-3 py-2">{log.clanName ?? "—"}</td>}
                  <td className="px-3 py-2">{log.memberUsername ?? "Unknown"}</td>
                  <td className="px-3 py-2">{log.message}</td>
                  <td className="px-3 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading &&
        logs.length > 0 && (
          <p className="mt-3 text-center text-gray-300">No logs match your filter.</p>
        )
      )}

      {!loading && logs.length === 0 && !error && (
        <p className="mt-3 text-center text-gray-300">
          {mode === "clan"
            ? "Search a clan to display recent logs."
            : "Search a player to display their clan logs."}
        </p>
      )}
    </div>
  );
}
