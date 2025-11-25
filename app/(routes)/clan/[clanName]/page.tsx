"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ClanInfoModal from "@/components/modals/ClanInfoModal";
import ClanSkillDisplay from "@/components/skills/ClanSkillDisplay";
import { useSearchStore } from "@/lib/store/searchStore";
import UnifiedSearch from "@/components/search/UnifiedSearch";

import { ClanData } from "@/types/clan.types";
import { fetchClanByName } from "@/lib/api/apiService";

export default function ClanPage() {
  const { clanName } = useParams<{ clanName: string }>();
  const router = useRouter();
  const {
    playerSearchQuery,
    clanSearchQuery,
    setPlayerSearchQuery,
    setClanSearchQuery,
    getCachedClan,
    setCachedClan,
  } = useSearchStore();

  const [clanData, setClanData] = useState<ClanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"player" | "clan">("clan");
  const [playerRecentSearches, setPlayerRecentSearches] = useState<string[]>(
    []
  );
  const [clanRecentSearches, setClanRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const savedPlayerSearches = localStorage.getItem("recentPlayerSearches");
    if (savedPlayerSearches) {
      setPlayerRecentSearches(JSON.parse(savedPlayerSearches));
    }

    const savedClanSearches = localStorage.getItem("recentClanSearches");
    if (savedClanSearches) {
      setClanRecentSearches(JSON.parse(savedClanSearches));
    }
  }, []);

  useEffect(() => {
    if (playerRecentSearches.length > 0) {
      localStorage.setItem(
        "recentPlayerSearches",
        JSON.stringify(playerRecentSearches)
      );
    }
  }, [playerRecentSearches]);

  useEffect(() => {
    if (clanRecentSearches.length > 0) {
      localStorage.setItem(
        "recentClanSearches",
        JSON.stringify(clanRecentSearches)
      );
    }
  }, [clanRecentSearches]);

  useEffect(() => {
    if (clanName && clanSearchQuery !== clanName) {
      setClanSearchQuery(clanName);
    }
  }, [clanName]);

  useEffect(() => {
    if (clanName) {
      const loadInitialClan = async () => {
        setLoading(true);
        setError(null);
        try {
          // Check cache first
          const cachedData = getCachedClan(clanName);
          if (cachedData) {
            setClanData(cachedData);
            setLoading(false);
            return;
          }

          const rawData = await fetchClanByName(clanName);

          let parsedSkills = undefined;
          if (rawData.serializedSkills) {
            try {
              parsedSkills = JSON.parse(rawData.serializedSkills);
            } catch (err) {
              console.error("Error parsing skills:", err);
            }
          }

          const mergedData: ClanData = {
            ...rawData,
            skills: parsedSkills,
          };

          setClanData(mergedData);
          setCachedClan(clanName, mergedData);
          setError(null);

          setClanRecentSearches((prev) => {
            const updated = prev.includes(clanName)
              ? prev
              : [clanName, ...prev];
            return updated.slice(0, 5);
          });
        } catch (err) {
          console.error("Error loading clan:", err);
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to load clan data. Please try again.");
          }
          setClanData(null);
        } finally {
          setLoading(false);
        }
      };

      loadInitialClan();
    }
  }, [clanName, getCachedClan, setCachedClan]);

  const handleTabChange = (tab: "player" | "clan") => {
    setActiveTab(tab);
    setError(null);

    // If we have a player search query, navigate to player page
    if (tab === "player" && playerSearchQuery) {
      router.push(`/player/${encodeURIComponent(playerSearchQuery)}`);
    }
  };

  const handlePlayerSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setPlayerSearchQuery(trimmed);
    router.push(`/player/${encodeURIComponent(trimmed)}`);

    setPlayerRecentSearches((prev) => {
      const updated = prev.includes(trimmed) ? prev : [trimmed, ...prev];
      return updated.slice(0, 5);
    });
  };

  const handleClanSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setClanSearchQuery(trimmed);
    router.push(`/clan/${encodeURIComponent(trimmed)}`);
  };

  const handleRecentPlayerSearchClick = (name: string) => {
    router.push(`/player/${encodeURIComponent(name)}`);
  };

  const handleRecentClanSearchClick = (name: string) => {
    router.push(`/clan/${encodeURIComponent(name)}`);
  };

  const clearPlayerSearches = () => {
    setPlayerRecentSearches([]);
    localStorage.removeItem("recentPlayerSearches");
  };

  const clearClanSearches = () => {
    setClanRecentSearches([]);
    localStorage.removeItem("recentClanSearches");
  };

  const handleSearch = (query: string) => {
    if (activeTab === "player") {
      handlePlayerSearch(query);
    } else {
      handleClanSearch(query);
    }
  };

  return (
    <main className="min-h-screen bg-[#031111] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UnifiedSearch
          activeTab={activeTab}
          onTabChange={handleTabChange}
          searchQuery={
            activeTab === "player" ? playerSearchQuery : clanSearchQuery
          }
          setSearchQuery={(q) =>
            activeTab === "player"
              ? setPlayerSearchQuery(q)
              : setClanSearchQuery(q)
          }
          onSearch={handleSearch}
          isLoading={loading}
          recentSearches={
            activeTab === "player" ? playerRecentSearches : clanRecentSearches
          }
          onRecentSearchClick={
            activeTab === "player"
              ? handleRecentPlayerSearchClick
              : handleRecentClanSearchClick
          }
          onClearHistory={
            activeTab === "player" ? clearPlayerSearches : clearClanSearches
          }
        />

        {/* Clan Search Results */}
        {activeTab === "clan" && (
          <>
            {loading && (
              <p className="text-gray-400 mt-8">Loading clan data...</p>
            )}
            {error && (
              <p className="text-red-400 font-semibold mt-8">{error}</p>
            )}

            {clanData && (
              <div className="mt-8">
                <ClanInfoModal
                  isOpen={false}
                  standalone={true}
                  onClose={() => {}}
                  clanName={decodeURIComponent(clanName)}
                  memberCount={clanData.memberlist?.length || 0}
                  clanData={clanData}
                />

                {clanData.skills && (
                  <div className="mt-6">
                    <ClanSkillDisplay skills={clanData.skills} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
