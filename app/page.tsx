"use client";

// hooks
import { useEffect, useState } from "react";
import Image from "next/image";
// api
import { fetchPlayerProfile } from "@/lib/api/apiService";
// components
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Sidebar from "@/components/Sidebar";
// types
import { Player } from "@/types/player.types";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Load recent searches
  useEffect(() => {
    // Retrieve recent searches 
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  // Update localStorage whenever search is made
  useEffect(() => {
    if (recentSearches.length > 0) {

      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    }
  }, [recentSearches]);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPlayerProfile(query);
      setSearchResults(data);

      // No duplicate searches saved
      setRecentSearches((prev) => {
        const newSearches = prev.includes(query) ? prev : [query, ...prev];
        return newSearches.slice(0, 5); // Max 5 searches shown. Change me as needed
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "status" in error.response &&
        error.response.status === 404
      ) {
        setError("Player not found");
      } else {
        setError("Error fetching player data. Please try again.");
      }
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches"); // Clear from localStorage
  };

  const removeSearch = (query: string) => {
    const updatedSearches = recentSearches.filter((search) => search !== query);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  const handleRecentSearchClick = (query: string) => {
    handleSearch(query); // Trigger the search for that player when clicked
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="md:ml-64 flex-1 p-4 md:p-8 flex">
        <div className="max-w-5xl mx-auto flex-1">
          <div className="flex items-center mb-8">
            <Image
              src="/logo.png"
              alt="logo idle clans"
              height={30}
              width={30}
              className="mr-2"
              priority
            />
            <h1 className="text-3xl font-bold text-emerald-400">
              Idle Clans Finder
            </h1>
          </div>

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          {(searchResults || error) && (
            <SearchResults
              player={searchResults || ({} as Player)}
              error={error || undefined}
            />
          )}
        </div>

        {/* Player Search History Section */}
        <aside className="w-64 p-4 bg-[color] rounded-lg shadow-lg flex flex-col">
          <h2 className="text-lg font-bold text-emerald-500 mb-2 text-center">Player Search History</h2>

          {/* Recent Searches List */}
          {recentSearches.length > 0 ? (
            <div className="flex-1 overflow-hidden">
              <ul className="space-y-2">
                {recentSearches.map((query, index) => (
                  <li key={index} className="flex justify-between items-center bg-white p-2 rounded shadow">
                    {/* Clickable player name */}
                    <button
                      className="text-gray-800 text-sm"
                      onClick={() => handleRecentSearchClick(query)}
                    >
                      {query}
                    </button>
                    <button
                      className="text-red-500 text-xs"
                      onClick={() => removeSearch(query)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={clearSearches}
                className="mt-2 w-full text-sm text-red-600 hover:underline"
              >
                Clear All
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No recent searches</p>
          )}
        </aside>
      </main>
    </div>
  );
}
