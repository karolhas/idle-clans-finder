"use client";

//hooks
import { useState } from "react";
import Image from "next/image";
//api
import { fetchPlayerProfile } from "@/lib/api/apiService";
//components
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Sidebar from "@/components/Sidebar";
//types
import { Player } from "@/types/player.types";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchPlayerProfile(query);
      setSearchResults(data);
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

  return (
    <div className="flex">
      <Sidebar />
      <main className="md:ml-64 flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
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

          <SearchBar onSearch={handleSearch} isLoading={isLoading} searchResult={searchResults ? searchResults.nickname : null} />
          {(searchResults || error) && (
            <SearchResults
              player={searchResults || ({} as Player)}
              error={error || undefined}
            />
          )}
        </div>
      </main>
    </div>
  );
}