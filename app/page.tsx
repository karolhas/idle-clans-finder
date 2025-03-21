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
  const [showMobileSearches, setShowMobileSearches] = useState(false);

  // Load recent searches
  useEffect(() => {
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

      setRecentSearches((prev) => {
        const newSearches = prev.includes(query) ? prev : [query, ...prev];
        return newSearches.slice(0, 5);
      });
    } catch (error: unknown) {
      setError("Error fetching player data. Please try again.");
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const removeSearch = (query: string) => {
    const updatedSearches = recentSearches.filter((search) => search !== query);
    setRecentSearches(updatedSearches);
    localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="md:ml-64 flex-1 p-4 md:p-8 flex">
        <div className="max-w-5xl mx-auto flex-1">
          {/* Mobile: Recent Searches at the Top */}
          <div className="md:hidden mb-4">
            <button
              onClick={() => setShowMobileSearches(!showMobileSearches)}
              className="bg-emerald-500 text-white px-4 py-2 rounded shadow w-auto mx-auto"
            >
              {showMobileSearches ? "Hide Recent Searches" : "Show Recent Searches"}
            </button>

            {showMobileSearches && (
              <div className="bg-gray-100 p-4 rounded shadow mt-2">
                <h2 className="text-lg font-bold text-emerald-500 mb-2 text-center">
                  Recent Searches
                </h2>
                {recentSearches.length > 0 ? (
                  <ul className="space-y-2">
                    {recentSearches.map((query, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-white p-2 rounded shadow"
                      >
                        <button
                          className="text-gray-800 text-sm"
                          onClick={() => handleSearch(query)}
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
                ) : (
                  <p className="text-gray-500 text-sm text-center">
                    No recent searches
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Logo & Title */}
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

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {/* Search Results */}
          {(searchResults || error) && (
            <SearchResults
              player={searchResults || ({} as Player)}
              error={error || undefined}
            />
          )}
        </div>

        {/* Desktop: Recent Searches Sidebar */}
        <aside className="w-64 p-4 bg-[color] rounded-lg shadow-lg flex flex-col hidden md:flex">
          <h2 className="text-lg font-bold text-emerald-500 mb-2 text-center">
            Player Search History
          </h2>
          {recentSearches.length > 0 ? (
            <div className="flex-1 overflow-hidden">
              <ul className="space-y-2">
                {recentSearches.map((query, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-white p-2 rounded shadow"
                  >
                    <button
                      className="text-gray-800 text-sm"
                      onClick={() => handleSearch(query)}
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
