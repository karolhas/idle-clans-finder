'use client';

import { useState, useEffect } from 'react';
import { FaCalculator, FaSearch, FaTimes } from 'react-icons/fa';
import { fetchPlayerProfile, fetchClanByName } from '@/lib/api/apiService';
import { Player } from '@/types/player.types';
import type { PlayerClan } from '@/types/player.types';
import Calculator from '@/components/calculator/Calculator';

export default function CalculatorPage() {
    const [username, setUsername] = useState('');
    const [playerData, setPlayerData] = useState<Player | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load username from localStorage on mount, with expiry
    useEffect(() => {
        const saved = localStorage.getItem('idleclans_calculator_username');
        if (saved) {
            try {
                const { value, timestamp } = JSON.parse(saved);
                if (Date.now() - timestamp < 5 * 60 * 1000) {
                    setUsername(value);
                } else {
                    localStorage.removeItem('idleclans_calculator_username');
                }
            } catch {
                // fallback for old format
                setUsername(saved);
            }
        }
    }, []);

    // Save username to localStorage on change, with timestamp
    useEffect(() => {
        if (username) {
            localStorage.setItem(
                'idleclans_calculator_username',
                JSON.stringify({ value: username, timestamp: Date.now() })
            );
        }
    }, [username]);

    const fetchProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const data = await fetchPlayerProfile(username);
            let clanData = null;
            if (data.guildName) {
                try {
                    clanData = await fetchClanByName(data.guildName);
                } catch (clanErr) {
                    console.error('Failed to fetch clan data:', clanErr);
                }
            }
            setPlayerData({
                ...data,
                clan: (clanData as unknown as PlayerClan) || {},
            });
        } catch (err) {
            setError(
                'Failed to fetch player profile. Please check the username and try again.'
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center">
                    <FaCalculator className="mr-3" />
                    XP Calculator
                </h1>

                <div className="border border-emerald-700 rounded-lg mb-6">
                    <div className="bg-[#002020] rounded-lg p-6">
                        <h2 className="text-white text-lg font-semibold mb-2">
                            Search for a player
                        </h2>
                        <p className="text-gray-300 text-sm">
                            Enter the Idle Clans username to calculate XP
                            requirements
                        </p>
                    </div>
                    <div className="p-6">
                        <form
                            onSubmit={fetchProfile}
                            className="flex gap-2 max-w-full"
                        >
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    placeholder="Player name"
                                    className="w-full px-4 py-2 bg-gray-200 border border-gray-700 text-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                    disabled={loading}
                                />
                                {username && (
                                    <button
                                        type="button"
                                        onClick={() => setUsername('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600"
                                        aria-label="Clear search"
                                    >
                                        <FaTimes className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !username.trim()}
                                className={`px-6 py-2 bg-emerald-600 text-white rounded-lg transition-colors cursor-pointer
                                ${
                                    loading
                                        ? 'opacity-50'
                                        : 'hover:bg-emerald-700'
                                }`}
                                aria-label="search-button"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <span className="flex items-center">
                                        <FaSearch className="w-5 h-5" />
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {playerData ? (
                    <div className="bg-[#002020] p-6 rounded-lg shadow-lg">
                        <div className="flex flex-col sm:flex-row items-start justify-between mb-6 gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-emerald-300">
                                    {playerData.username}&apos;s Calculator
                                </h2>
                                <p className="text-gray-400">
                                    {playerData.guildName
                                        ? `Clan: ${playerData.guildName}`
                                        : 'No Clan'}
                                </p>
                            </div>
                        </div>

                        <Calculator playerData={playerData} />
                    </div>
                ) : (
                    <div className="bg-[#002020] p-8 rounded-lg shadow-lg text-center">
                        <p className="text-xl text-center text-gray-300 mb-2">
                            Enter your Idle Clans username above to load your
                            profile data
                        </p>
                        <p className="text-gray-400">
                            The calculator will use your profile data to provide
                            accurate XP calculations
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
