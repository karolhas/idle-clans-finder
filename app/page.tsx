"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(
        `https://query.idleclans.com/api/Player/profile/${query}`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching player data:", error);
      setSearchResults(null);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} />
          {searchResults && <SearchResults player={searchResults} />}
        </div>
      </main>
    </div>
  );
}
