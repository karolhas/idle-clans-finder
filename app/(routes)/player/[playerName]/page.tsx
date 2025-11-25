"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { fetchPlayerProfile } from "@/lib/api/apiService";
import SearchResults from "@/components/search/SearchResults";
import { useSearchStore } from "@/lib/store/searchStore";
import UnifiedSearch from "@/components/search/UnifiedSearch";

import { Player } from "@/types/player.types";

export default function PlayerPage() {
  const { playerName } = useParams<{ playerName: string }>();
  const router = useRouter();
  const {
    playerSearchQuery,
    clanSearchQuery,
    latestPlayerLookup,
    setPlayerSearchQuery,
    setClanSearchQuery,
    getCachedPlayer,
    setCachedPlayer,
  } = useSearchStore();

  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"player" | "clan">("player");
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

  // Load cached data on mount
  useEffect(() => {
    const cached = getCachedPlayer(playerName);
    if (cached) {
      setCachedPlayer(playerName, cached);
    }
  }, [playerName, getCachedPlayer, setCachedPlayer]);

  const fetchData = async (name: string) => {
    if (!name) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedData = getCachedPlayer(name);
      if (cachedData) {
        setPlayer(cachedData);
        setIsLoading(false);
        return;
      }

      const data = await fetchPlayerProfile(name);
      setPlayer(data);
      setCachedPlayer(name, data);

      setPlayerRecentSearches((prev) => {
        const updated = prev.includes(name) ? prev : [name, ...prev];
        return updated.slice(0, 5);
      });
    } catch {
      setError("Player not found");
      setPlayer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playerName && playerSearchQuery !== playerName) {
      setPlayerSearchQuery(playerName);
    }
    if (playerName) {
      fetchData(playerName);
    } else if (latestPlayerLookup) {
      setPlayerSearchQuery(latestPlayerLookup?.username);
      fetchData(latestPlayerLookup?.username);
    }
  }, [playerName]);

  const handleTabChange = (tab: "player" | "clan") => {
    setActiveTab(tab);
    setError(null);

    // If we have a clan search query, navigate to clan page
    if (tab === "clan" && clanSearchQuery) {
      router.push(`/clan/${encodeURIComponent(clanSearchQuery)}`);
    }
  };

  const handlePlayerSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setPlayerSearchQuery(trimmed);
    router.push(`/player/${encodeURIComponent(trimmed)}`);
    fetchData(trimmed);

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

    setClanRecentSearches((prev) => {
      const updated = prev.includes(trimmed) ? prev : [trimmed, ...prev];
      return updated.slice(0, 5);
    });
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
          isLoading={isLoading}
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

        {/* Results */}
        {activeTab === "player" && (player || error) && (
          <div className="mt-8">
            <SearchResults
              player={player || ({} as Player)}
              error={error || undefined}
              onSearchMember={(name) =>
                router.push(`/player/${encodeURIComponent(name)}`)
              }
            />
          </div>
        )}
      </div>
    </main>
  );
}
