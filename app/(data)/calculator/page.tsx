"use client";

import { useState, useEffect, useRef } from "react";
import { FaCalculator, FaSearch, FaTimes } from "react-icons/fa";
import { fetchPlayerProfile, fetchClanByName } from "@/lib/api/apiService";
import { Player } from "@/types/player.types";
import type { PlayerClan } from "@/types/player.types";
import Calculator from "@/components/calculator/Calculator";
import { useSearchStore } from "@/lib/store/searchStore";

export default function CalculatorPage() {
  const [username, setUsername] = useState("");
  const [playerData, setPlayerData] = useState<Player | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    latestPlayerLookup,
    getCachedPlayer,
    setCachedPlayer,
    getCachedClan,
    setCachedClan,
  } = useSearchStore();

  // Load username from localStorage on mount, with expiry
  useEffect(() => {
    let shouldFetch = false;

    if (latestPlayerLookup?.username) {
      setUsername(latestPlayerLookup.username);
      shouldFetch = true;
    }

    const saved = localStorage.getItem("idleclans_calculator_username");
    if (saved) {
      try {
        const { value, timestamp } = JSON.parse(saved);
        if (Date.now() - timestamp < 5 * 60 * 1000) {
          setUsername(value);
          shouldFetch = true;
        } else {
          localStorage.removeItem("idleclans_calculator_username");
        }
      } catch {
        // fallback for old format
        setUsername(saved);
        shouldFetch = true;
      }
    }

    // Auto-fetch only on initial mount if we have a valid username
    if (shouldFetch) {
      setTimeout(() => fetchProfile(), 100); // Small delay to ensure state is set
    }
  }, []);

  // Debounced function to save username to localStorage
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (username) {
      // Clear previous timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      // Set new timeout to save to localStorage after 500ms of no typing
      debounceTimeout.current = setTimeout(() => {
        localStorage.setItem(
          "idleclans_calculator_username",
          JSON.stringify({ value: username, timestamp: Date.now() })
        );
      }, 500);
    }

    // Cleanup timeout on unmount
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchProfile();
  };

  const fetchProfile = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Check cache first
      let playerData = getCachedPlayer(username);
      if (!playerData) {
        playerData = await fetchPlayerProfile(username);
        setCachedPlayer(username, playerData);
      }

      let clanData = null;
      if (playerData.guildName) {
        try {
          clanData = getCachedClan(playerData.guildName);
          if (!clanData) {
            clanData = await fetchClanByName(playerData.guildName);
            setCachedClan(playerData.guildName, clanData);
          }
        } catch (clanErr) {
          console.error("Failed to fetch clan data:", clanErr);
        }
      }
      setPlayerData({
        ...playerData,
        clan: (clanData as unknown as PlayerClan) || {},
      });
    } catch (err) {
      setError(
        "Failed to fetch player profile. Please check the username and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#031111] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Card */}
        <div className="w-full mx-auto relative overflow-hidden rounded-2xl border-2 border-emerald-700/30 bg-gradient-to-br from-[#001515] to-[#001212] p-4 md:p-8 shadow-[0_0_40px_rgba(16,185,129,0.1)] mb-8">
          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6">
            {/* Header / Title area replacing Tabs */}
            <div className="flex items-center justify-center p-4 rounded-2xl bg-black/20 border-2 border-white/5 backdrop-blur-md">
              <h1 className="text-2xl font-bold text-emerald-400 flex items-center gap-3">
                <FaCalculator className="w-6 h-6" />
                XP Calculator
              </h1>
            </div>

            <div className="flex flex-col gap-4">
              {/* Search Form */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <form onSubmit={handleSubmit} className="relative">
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter player name..."
                      className="w-full pl-12 pr-32 py-3 bg-[#0a1f1f]/80 border-2 border-white/10 rounded-xl text-base text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300 backdrop-blur-xl shadow-inner"
                      disabled={loading}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300">
                      <FaSearch className="w-5 h-5" />
                    </div>

                    {username && (
                      <button
                        type="button"
                        onClick={() => setUsername("")}
                        className="absolute right-36 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-red-400 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    )}

                    <button
                      type="submit"
                      disabled={loading || !username.trim()}
                      className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        loading || !username.trim()
                          ? "bg-white/5 text-gray-500 cursor-not-allowed"
                          : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 hover:scale-105"
                      }`}
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Load Profile"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mb-8 backdrop-blur-sm">
            {error}
          </div>
        )}

        {playerData ? (
          <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start justify-between mb-8 gap-4 border-b border-white/5 pb-6">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors">
                  {playerData.username}&apos;s Calculator
                </h2>
                <p className="text-gray-400">
                  {playerData.guildName
                    ? `Clan: ${playerData.guildName}`
                    : "No Clan"}
                </p>
              </div>
            </div>

            <Calculator playerData={playerData} />
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 p-12 rounded-2xl shadow-xl text-center backdrop-blur-xl">
            <div className="w-16 h-16 bg-black/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCalculator className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-emerald-500 mb-4">
              Ready to Calculate
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter your Idle Clans username above to load your profile data.
              The calculator will use your profile data to provide accurate XP
              calculations.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
