"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { XP_TABLE } from "@/utils/common/constants/xpTable";
import { getLevel } from "@/utils/common/calculations/xpCalculations";

type SkillRow = {
  /** Raw key from API, used to resolve /public/skills/<key>.png */
  key: string;
  /** Display name (Capitalized) */
  skill: string;
  xp: number;
  level: number;
  toNext: number;
  progress: number; // 0..100
};

type CapeState = {
  nextCapeLevel: number | null;
  missing: SkillRow[];
  collapsed?: boolean;
};

interface Props {
  initialPlayer?: string;
  autoSearch?: boolean;
}

export default function NextSkill({
  initialPlayer = "",
  autoSearch = true,
}: Props) {
  // URL hooks (for deep links + shareable searches)
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [playerName, setPlayerName] = useState(initialPlayer);
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [capeProgress, setCapeProgress] = useState<CapeState | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [savedSearches, setSavedSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("playerSavedSearches");
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("playerSavedSearches", JSON.stringify(savedSearches));
  }, [savedSearches]);

  const capitalize = (s: string) => (s ? s[0].toUpperCase() + s.slice(1) : s);

  const updateUrl = (name: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (name) params.set("player", name);
    else params.delete("player");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const fetchPlayerData = async (nameArg?: string) => {
    const query = (nameArg ?? playerName).trim();
    if (!query) {
      setError("Please enter a player name.");
      return;
    }

    setError("");
    setSkills([]);
    setCapeProgress(null);
    setLoading(true);

    try {
      const res = await fetch(
        `https://query.idleclans.com/api/Player/profile/${encodeURIComponent(
          query
        )}`
      );
      if (!res.ok) throw new Error("Player not found");

      const data: { skillExperiences?: Record<string, number> } =
        await res.json();

      const se = data.skillExperiences;
      if (!se) {
        setError("No skill data available.");
        return;
      }

      const skillArray: SkillRow[] = Object.entries(se).map(
        ([skillKey, xp]) => {
          const level = getLevel(xp);
          const nextLevelXp =
            XP_TABLE[level + 1] ?? XP_TABLE[XP_TABLE.length - 1];
          const prevXp = XP_TABLE[level] ?? 0;
          const toNext = level < 120 ? Math.max(0, nextLevelXp - xp) : 0;
          const progress =
            level < 120 && nextLevelXp > prevXp
              ? ((xp - prevXp) / (nextLevelXp - prevXp)) * 100
              : 100;

          return {
            key: skillKey,
            skill: capitalize(skillKey),
            xp,
            level,
            toNext,
            progress,
          };
        }
      );


      // Cape milestones (lets hope no more get added)
      const capes = [90, 100, 110, 120];
      const nextCapeLevel =
        capes.find((lvl) => skillArray.some((s) => s.level < lvl)) ?? null;

      const missingForNextCape =
        nextCapeLevel !== null
          ? skillArray.filter((s) => s.level < nextCapeLevel)
          : [];

      const sortedMissing = [...missingForNextCape].sort(
        (a, b) => a.toNext - b.toNext
      );

      const focusCandidate =
        (sortedMissing[0]?.skill ??
          [...skillArray]
            .filter((s) => s.level < 120)
            .sort((a, b) => a.toNext - b.toNext)[0]?.skill) ?? null;

      let finalSkills: SkillRow[];
      if (focusCandidate) {
        const idx = skillArray.findIndex((s) => s.skill === focusCandidate);
        if (idx >= 0) {
          const focused = skillArray[idx];
          finalSkills = [
            focused,
            ...skillArray.slice(0, idx),
            ...skillArray.slice(idx + 1),
          ];
        } else {
          finalSkills = [...skillArray];
        }
      } else {
        // If everything is maxed, use a stable, sensible order
        finalSkills = [...skillArray].sort(
          (a, b) => b.level - a.level || b.xp - a.xp
        );
      }

      setSkills(finalSkills);
      setCapeProgress({ nextCapeLevel, missing: sortedMissing });

      // Save search history (dedupe, keep 8)
      setSavedSearches((prev) => {
        const without = prev.filter(
          (p) => p.toLowerCase() !== query.toLowerCase()
        );
        return [query, ...without].slice(0, 8);
      });

      // Keep URL shareable
      updateUrl(query);
    } catch (err) {
      console.error(err);
      setError("Could not fetch profile. Check the name and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-run if URL has ?player= or prop passed
  useEffect(() => {
    const urlPlayer = searchParams.get("player") ?? initialPlayer;
    if (autoSearch && urlPlayer) {
      setPlayerName(urlPlayer);
      fetchPlayerData(urlPlayer);
    }
  }, [autoSearch, initialPlayer, searchParams]); 

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") fetchPlayerData(playerName.trim());
  };

  // With the focus pinned to top, the first non-maxed row is the focus badge
  const focusSkillName = useMemo(() => {
    const first = skills.find((s) => s.level < 120);
    return first?.skill ?? null;
  }, [skills]);

  const hasSkills = useMemo(() => skills.length > 0, [skills]);

  const renderSkillIcon = (key: string, size = 20) => (
    <Image
      src={`/skills/${key}.png`}
      alt={`${key} icon`}
      width={size}
      height={size}
      className="inline-block mr-2 rounded-sm"
    />
  );

  return (
    <div className="mx-auto max-w-5xl">
      {/* Centered header + search */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-emerald-400 mb-4">
          What&apos;s My Next Skill?
        </h1>

        <div className="mx-auto max-w-xl">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <input
              type="text"
              placeholder="Enter player name..."
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={handleEnter}
              className="w-[280px] px-3 py-2 rounded-md border border-emerald-700 bg-[#001f1f] text-white outline-none"
            />
            <button
              onClick={() => fetchPlayerData(playerName.trim())}
              disabled={loading || !playerName.trim()}
              className="px-3 py-2 rounded-md bg-emerald-600 text-white disabled:opacity-60"
            >
              {loading ? "Loading…" : "Search"}
            </button>
          </div>

          {/* Recent searches */}
          {savedSearches.length > 0 && (
            <div className="mt-3 text-sm text-gray-300">
              <span className="mr-2">Recent:</span>
              {savedSearches.map((s) => (
                <button
                  key={s}
                  className="inline-flex items-center text-xs px-2 py-1 mr-2 mb-2 rounded bg-emerald-800/50 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    setPlayerName(s);
                    fetchPlayerData(s);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-6 text-red-400 bg-red-900/20 border border-red-800/50 rounded px-3 py-2 text-center">
          {error}
        </div>
      )}

      {/* Cape box */}
      {capeProgress && capeProgress.nextCapeLevel && (
        <div className="mt-6 rounded-lg border border-emerald-800/50 bg-[#002a2a]">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3 text-emerald-300 hover:text-white"
            onClick={() =>
              setCapeProgress((prev) =>
                prev ? { ...prev, collapsed: !prev.collapsed } : prev
              )
            }
          >
            <span>
              Completionist Cape Progress — Next: Level{" "}
              {capeProgress.nextCapeLevel}
            </span>
            <span
              className={`transition-transform ${
                !capeProgress.collapsed ? "rotate-0" : "-rotate-90"
              }`}
            >
              ▼
            </span>
          </button>

          {!capeProgress.collapsed && (
            <div className="px-4 pb-4">
              {capeProgress.missing.length === 0 ? (
                <p className="text-emerald-300">
                   You already meet the next cape requirement.
                </p>
              ) : (
                <>
                  <p className="text-gray-200 mb-2">
                    Missing <strong>{capeProgress.missing.length}</strong>{" "}
                    skill{capeProgress.missing.length > 1 ? "s" : ""}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {capeProgress.missing.map((s) => (
                      <li
                        key={s.key}
                        className="flex items-center text-gray-100 bg-[#003333] border border-[#004444] rounded px-3 py-2"
                      >

                        {renderSkillIcon(s.key, 20)}
                        <span className="mr-2">{s.skill}</span> — Level {s.level}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      {hasSkills && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-emerald-800/40">
          <table className="w-full text-left">
            <thead className="bg-emerald-900/40 text-emerald-100">
              <tr>
                <th className="px-3 py-2">Skill</th>
                <th className="px-3 py-2">Level</th>
                <th className="px-3 py-2">XP</th>
                <th className="px-3 py-2">Progress</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.key} className="odd:bg-[#001a1a]">
                  <td className="px-3 py-2">

                    {renderSkillIcon(s.key, 22)}
                    <span className="text-white align-middle">{s.skill}</span>

                    {s.skill === focusSkillName && s.level < 120 && (
                      <span
                        className="
                          ml-2 inline-flex items-center gap-1
                          uppercase tracking-wide font-bold
                          text-[10px] md:text-[11px]
                          px-2.5 py-1 rounded
                          bg-amber-500 text-black
                          ring-2 ring-amber-300 shadow
                          animate-pulse
                        "
                        title="Closest to next requirement"
                      >
                        <span aria-hidden>🎯</span>
                        Focus
                      </span>
                    )}

                    {/* Maxed badge */}
                    {s.level === 120 && (
                      <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-emerald-700 text-white">
                        Maxed
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">{s.level}</td>
                  <td className="px-3 py-2 font-semibold">
                    {s.level < 120
                      ? `${Math.floor(s.toNext).toLocaleString()} XP left`
                      : `${Math.floor(s.xp).toLocaleString()} XP`}
                  </td>
                  <td className="px-3 py-2">
                    <div className="w-full h-5 bg-[#003333] rounded overflow-hidden border border-[#004444]">
                      <div
                        className="h-full bg-emerald-600 text-white text-xs flex items-center justify-end pr-2"
                        style={{ width: `${s.progress.toFixed(1)}%` }}
                      >
                        {s.progress.toFixed(1)}%
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!error && !hasSkills && (
        <p className="mt-6 text-gray-300 text-center">
          Search a player to show skills and cape progress.
        </p>
      )}
    </div>
  );
}
