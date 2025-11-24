"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Player } from "@/types/player.types";
import { ClanData } from "@/types/clan.types";
import { fetchPlayerProfile, fetchClanByName } from "@/lib/api/apiService";
import { useSearchStore } from "@/lib/store/searchStore";
import SearchResults from "@/components/SearchResults";
import SearchHistory from "@/components/SearchHistory";
import ClanInfoModal from "@/components/ClanInfoModal";
import ClanSkillDisplay from "@/components/skills/ClanSkillDisplay";

// New components
import SearchTabs from "./search/SearchTabs";
import SearchForm from "./search/SearchForm";
import SearchContainer from "./search/SearchContainer";

export default function SearchInterface() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"player" | "clan">("player");
  const [playerSearchResults, setPlayerSearchResults] = useState<Player | null>(null);
  const [clanSearchResults, setClanSearchResults] = useState<ClanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playerSearches, setPlayerSearches] = useState<string[]>([]);
  const [clanSearches, setClanSearches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { latestPlayerLookup } = useSearchStore();

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
      localStorage.setItem("recentPlayerSearches", JSON.stringify(playerSearches));
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

  const removeSearch = (query: string) => {
    if (activeTab === "player") {
      const updatedSearches = playerSearches.filter((search) => search !== query);
      setPlayerSearches(updatedSearches);
      localStorage.setItem("recentPlayerSearches", JSON.stringify(updatedSearches));
    } else {
      const updatedSearches = clanSearches.filter((search) => search !== query);
      setClanSearches(updatedSearches);
      localStorage.setItem("recentClanSearches", JSON.stringify(updatedSearches));
    }
  };

  const handleRecentSearchClick = (query: string) => {
    handleSearch(query);
  };

  return (
    <div className="w-full">
      <SearchContainer
        title="Search"
        description="Find players and clans to view their stats, members and achievements."
      >
        <SearchTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-2">
                Search for {activeTab === "player" ? "a player" : "a clan"}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
                Enter the {activeTab === "player" ? "player" : "clan"} name you want to find
            </p>

            <SearchForm
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={handleSearch}
                placeholder={`${activeTab === "player" ? "Player" : "Clan"} name...`}
                isLoading={isLoading}
            />
        </div>
      </SearchContainer>

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
                clanName={clanSearchResults.clanName || clanSearchResults.guildName || "Clan"}
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

      {/* Search History */}
      <div className="mt-12">
        <SearchHistory
          recentSearches={activeTab === "player" ? playerSearches : clanSearches}
          onSearchClick={handleRecentSearchClick}
          onRemoveSearch={removeSearch}
          onClearAll={clearSearches}
        />
      </div>
    </div>
  );
}
