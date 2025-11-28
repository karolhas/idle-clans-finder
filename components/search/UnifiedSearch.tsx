"use client";

import { useState } from "react";
import { FaHistory, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import SearchTabs from "./SearchTabs";
import SearchForm from "./SearchForm";

interface UnifiedSearchProps {
  activeTab: "player" | "clan";
  onTabChange: (tab: "player" | "clan") => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  isLoading: boolean;
  // History props
  recentSearches: string[];
  onRecentSearchClick: (query: string) => void;
  onClearHistory: () => void;
}

export default function UnifiedSearch({
  activeTab,
  onTabChange,
  searchQuery,
  setSearchQuery,
  onSearch,
  isLoading,
  recentSearches,
  onRecentSearchClick,
  onClearHistory,
}: UnifiedSearchProps) {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  return (
    <div className="w-full mx-auto relative overflow-hidden rounded-2xl border-2 border-emerald-700/30 bg-gradient-to-br from-[#001515] to-[#001212] p-4 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
      {/* Background Glow Effects */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        <SearchTabs activeTab={activeTab} onTabChange={onTabChange} />

        <div className="flex flex-col gap-4">
          <SearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={onSearch}
            placeholder={`${
              activeTab === "player" ? "Player" : "Clan"
            } name...`}
            isLoading={isLoading}
          />

          {/* Recent Searches Section */}
          {recentSearches.length > 0 && (
            <div className="mt-2 animate-fade-in">
              <div className="flex items-center justify-between mb-3 text-xs md:text-sm text-gray-400 px-1">
                <button
                  onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <FaHistory className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-medium">Recent Searches</span>
                  {isHistoryVisible ? (
                    <FaChevronUp className="w-3 h-3" />
                  ) : (
                    <FaChevronDown className="w-3 h-3" />
                  )}
                </button>
                {isHistoryVisible && (
                  <button
                    onClick={onClearHistory}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors group"
                  >
                    <FaTrash className="w-3 h-3" />
                    <span className="group-hover:underline">Clear History</span>
                  </button>
                )}
              </div>

              {isHistoryVisible && (
                <div className="flex flex-wrap gap-2">
                  {recentSearches.slice(0, 5).map((query, index) => (
                    <button
                      key={index}
                      onClick={() => onRecentSearchClick(query)}
                      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-200 text-sm text-gray-300 hover:text-emerald-300"
                    >
                      <span>{query}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
