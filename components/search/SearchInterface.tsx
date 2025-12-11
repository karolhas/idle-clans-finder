"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Player } from "@/types/player.types";
import { ClanData } from "@/types/clan.types";
import { fetchPlayerProfile, fetchClanByName } from "@/lib/api/apiService";
import { useSearchStore } from "@/lib/store/searchStore";
import SearchResults from "@/components/search/SearchResults";
import ClanInfoModal from "@/components/modals/ClanInfoModal";
import ClanSkillDisplay from "@/components/skills/ClanSkillDisplay";

// New components
import UnifiedSearch from "./UnifiedSearch";

export default function SearchInterface() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"player" | "clan">("player");
  const [playerSearchResults, setPlayerSearchResults] = useState<Player | null>(
    null
  );
  const [clanSearchResults, setClanSearchResults] = useState<ClanData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playerSearches, setPlayerSearches] = useState<string[]>([]);
  const [clanSearches, setClanSearches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { latestPlayerLookup } = useSearchStore();

  // Handle URL query parameter for pre-filling search
  useEffect(() => {
    const queryParam = searchParams.get('q');
    const typeParam = searchParams.get('type');
    if (queryParam && queryParam.trim()) {
      const trimmedQuery = queryParam.trim();
      setSearchQuery(trimmedQuery);
      // Set active tab based on type parameter, default to player
      const searchType = typeParam === 'clan' ? 'clan' : 'player';
      setActiveTab(searchType);
      // Auto-search based on the determined type
      if (searchType === 'clan') {
        handleClanSearch(trimmedQuery);
      } else {
        handlePlayerSearch(trimmedQuery);
      }
    }
  }, [searchParams]);

  // Load recent searches on component mount
  useEffect(() => {
    const savedPlayerSearches = localStorage.getItem("recentPlayerSearches");
    if (savedPlayerSearches) {
      setPlayerSearches(JSON.parse(savedPlayerSearches));
    }

    const savedClanSearches = localStorage.getItem("recentClanSearches");
    if (savedClanSearches) {
      setClanSearches(JSON.parse(savedClanSearches));
    }
  }, [latestPlayerLookup, router]);

  // Update localStorage whenever searches change
  useEffect(() => {
    if (playerSearches.length > 0) {
      localStorage.setItem(
        "recentPlayerSearches",
        JSON.stringify(playerSearches)
      );
    }
    if (clanSearches.length > 0) {
      localStorage.setItem("recentClanSearches", JSON.stringify(clanSearches));
    }
  }, [playerSearches, clanSearches]);

  const handlePlayerSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPlayerProfile(query);
      setPlayerSearchResults(data);
      setSearchQuery(""); // Clear the search query after search

      // No duplicate searches saved
      setPlayerSearches((prev) => {
        const newSearches = prev.includes(query) ? prev : [query, ...prev];
        return newSearches.slice(0, 5); // Max 5 searches shown
      });
    } catch (err: unknown) {
      console.error("Error searching for player:", err);
      setError("Player not found");
      setPlayerSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClanSearch = async (query: string) => {
    setSearchQuery(query);
    setIsLoading(true);
    setError(null);

    try {
      const rawData = await fetchClanByName(query);

      // Parse serialized skills if available
      let parsedSkills = undefined;
      if (rawData.serializedSkills) {
        try {
          parsedSkills = JSON.parse(rawData.serializedSkills);
        } catch (err) {
          console.error("Error parsing skills:", err);
        }
      }

      // Create the final clan data with parsed skills
      const clanData: ClanData = {
        ...rawData,
        skills: parsedSkills,
      };

      setClanSearchResults(clanData);
      setSearchQuery(""); // Clear the search query after search

      // No duplicate searches saved
      setClanSearches((prev) => {
        const newSearches = prev.includes(query) ? prev : [query, ...prev];
        return newSearches.slice(0, 5); // Max 5 searches shown
      });
    } catch (err: unknown) {
      console.error("Error searching for clan:", err);
      setError("Clan not found");
      setClanSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab: "player" | "clan") => {
    setActiveTab(tab);
    setError(null); // Clear any error messages when switching tabs
    setSearchQuery(""); // Clear the search query when switching tabs
  };

  const handleSearch = (query: string) => {
    if (activeTab === "player") {
      router.push(`/player/${encodeURIComponent(query)}`);
    } else {
      router.push(`/clan/${encodeURIComponent(query)}`);
    }
  };

  const clearSearches = () => {
    if (activeTab === "player") {
      setPlayerSearches([]);
      localStorage.removeItem("recentPlayerSearches");
    } else {
      setClanSearches([]);
      localStorage.removeItem("recentClanSearches");
    }
  };

  const handleRecentSearchClick = (query: string) => {
    handleSearch(query);
  };

  return (
    <div className="w-full">
      <UnifiedSearch
        activeTab={activeTab}
        onTabChange={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
        recentSearches={activeTab === "player" ? playerSearches : clanSearches}
        onRecentSearchClick={handleRecentSearchClick}
        onClearHistory={clearSearches}
      />

      {/* Results */}
      {activeTab === "player" && (playerSearchResults || error) && (
        <div className="mt-8">
          <SearchResults
            player={playerSearchResults || ({} as Player)}
            error={error || undefined}
            onSearchMember={handlePlayerSearch}
            onSearchClan={(clanName: string) => {
              setActiveTab("clan");
              handleClanSearch(clanName);
            }}
          />
        </div>
      )}

      {/* Clan Search Results */}
      {activeTab === "clan" && (
        <>
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-6 py-4 rounded-xl mb-4 mt-8 backdrop-blur-sm shadow-lg">
              {error}
            </div>
          )}
          {clanSearchResults && (
            <div className="mt-8">
              <ClanInfoModal
                isOpen={false}
                standalone={true}
                onClose={() => {}}
                clanName={
                  clanSearchResults.clanName ||
                  clanSearchResults.guildName ||
                  "Clan"
                }
                memberCount={clanSearchResults.memberlist?.length || 0}
                clanData={clanSearchResults}
                onSearchMember={(memberName) => {
                  setActiveTab("player");
                  handlePlayerSearch(memberName);
                }}
              />

              {clanSearchResults.skills && (
                <div className="mt-6">
                  <ClanSkillDisplay skills={clanSearchResults.skills} />
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
