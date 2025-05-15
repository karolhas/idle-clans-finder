'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { fetchPlayerProfile } from '@/lib/api/apiService';
import SearchResults from '@/components/SearchResults';
import SearchHistory from '@/components/SearchHistory';
import { useSearchStore } from '@/lib/store/searchStore';

import { Player } from '@/types/player.types';
import { FaSearch } from 'react-icons/fa';

export default function PlayerPage() {
    const { playerName } = useParams<{ playerName: string }>();
    const router = useRouter();
    const {
        playerSearchQuery,
        clanSearchQuery,
        setPlayerSearchQuery,
        setClanSearchQuery,
        getCachedPlayer,
        setCachedPlayer,
    } = useSearchStore();

    const [player, setPlayer] = useState<Player | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'player' | 'clan'>('player');
    const [playerRecentSearches, setPlayerRecentSearches] = useState<string[]>(
        []
    );
    const [clanRecentSearches, setClanRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const savedPlayerSearches = localStorage.getItem(
            'recentPlayerSearches'
        );
        if (savedPlayerSearches) {
            setPlayerRecentSearches(JSON.parse(savedPlayerSearches));
        }

        const savedClanSearches = localStorage.getItem('recentClanSearches');
        if (savedClanSearches) {
            setClanRecentSearches(JSON.parse(savedClanSearches));
        }
    }, []);

    useEffect(() => {
        if (playerRecentSearches.length > 0) {
            localStorage.setItem(
                'recentPlayerSearches',
                JSON.stringify(playerRecentSearches)
            );
        }
    }, [playerRecentSearches]);

    useEffect(() => {
        if (clanRecentSearches.length > 0) {
            localStorage.setItem(
                'recentClanSearches',
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

    // Update URL when search query changes
    useEffect(() => {
        if (playerSearchQuery) {
            router.push(`/player/${playerSearchQuery}`);
        }
    }, [playerSearchQuery, router]);

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
            setError('Player not found');
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
        }
    }, [playerName]);

    const handleTabChange = (tab: 'player' | 'clan') => {
        setActiveTab(tab);
        setError(null);

        // If we have a clan search query, navigate to clan page
        if (tab === 'clan' && clanSearchQuery) {
            router.push(`/clan/${encodeURIComponent(clanSearchQuery)}`);
        }
    };

    const handlePlayerSearch = (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        setPlayerSearchQuery(trimmed);
        router.push(`/player/${encodeURIComponent(trimmed)}`);

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

    const removePlayerSearch = (name: string) => {
        const filtered = playerRecentSearches.filter((q) => q !== name);
        setPlayerRecentSearches(filtered);
        localStorage.setItem('recentPlayerSearches', JSON.stringify(filtered));
    };

    const removeClanSearch = (name: string) => {
        const filtered = clanRecentSearches.filter((q) => q !== name);
        setClanRecentSearches(filtered);
        localStorage.setItem('recentClanSearches', JSON.stringify(filtered));
    };

    const clearPlayerSearches = () => {
        setPlayerRecentSearches([]);
        localStorage.removeItem('recentPlayerSearches');
    };

    const clearClanSearches = () => {
        setClanRecentSearches([]);
        localStorage.removeItem('recentClanSearches');
    };

    return (
        <main className="p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center mb-8">
                    <h1 className="text-2xl font-bold text-emerald-400 flex items-center">
                        <FaSearch className="mr-3" />
                        Search
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex mb-2 bg-transparent border border-emerald-700 p-1 rounded-lg">
                    <button
                        className={`flex-1 py-1 px-4 rounded-lg text-center transition-colors ${
                            activeTab === 'player'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-transparent text-gray-300 hover:bg-emerald-600/10'
                        }`}
                        onClick={() => handleTabChange('player')}
                    >
                        Player
                    </button>
                    <button
                        className={`flex-1 py-1 px-4 rounded-lg text-center transition-colors ${
                            activeTab === 'clan'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-transparent text-gray-300 hover:bg-emerald-600/10'
                        }`}
                        onClick={() => handleTabChange('clan')}
                    >
                        Clan
                    </button>
                </div>

                {/* Tab content */}
                <div className="border border-emerald-700 rounded-lg">
                    <div className="bg-[#002020] rounded-lg p-6">
                        <h2 className="text-white text-lg font-semibold mb-2">
                            Search for{' '}
                            {activeTab === 'player' ? 'a player' : 'a clan'}
                        </h2>
                        <p className="text-gray-300 text-sm">
                            Enter the{' '}
                            {activeTab === 'player' ? 'player' : 'clan'} name
                            you want to find
                        </p>
                    </div>
                    <div className="p-6">
                        {/* Search form */}
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (
                                    activeTab === 'player' &&
                                    playerSearchQuery.trim()
                                ) {
                                    handlePlayerSearch(
                                        playerSearchQuery.trim()
                                    );
                                } else if (
                                    activeTab === 'clan' &&
                                    clanSearchQuery.trim()
                                ) {
                                    handleClanSearch(clanSearchQuery.trim());
                                }
                            }}
                            className="flex gap-2 max-w-full"
                        >
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={
                                        activeTab === 'player'
                                            ? playerSearchQuery
                                            : clanSearchQuery
                                    }
                                    onChange={(e) => {
                                        if (activeTab === 'player') {
                                            setPlayerSearchQuery(
                                                e.target.value
                                            );
                                        } else {
                                            setClanSearchQuery(e.target.value);
                                        }
                                    }}
                                    placeholder={`${
                                        activeTab === 'player'
                                            ? 'Player'
                                            : 'Clan'
                                    } name`}
                                    className="w-full px-4 py-2 bg-gray-200 border border-gray-700 text-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                    disabled={isLoading}
                                />
                                {(activeTab === 'player'
                                    ? playerSearchQuery
                                    : clanSearchQuery) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (activeTab === 'player') {
                                                setPlayerSearchQuery('');
                                            } else {
                                                setClanSearchQuery('');
                                            }
                                        }}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600"
                                        aria-label="Clear search"
                                    >
                                        <span className="mr-2">✕</span>
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={
                                    isLoading ||
                                    !(
                                        activeTab === 'player'
                                            ? playerSearchQuery
                                            : clanSearchQuery
                                    ).trim()
                                }
                                className={`px-6 py-2 bg-emerald-600 text-white rounded-lg transition-colors cursor-pointer
                            ${
                                isLoading
                                    ? 'opacity-50'
                                    : 'hover:bg-emerald-700'
                            }`}
                                aria-label="search-button"
                            >
                                {isLoading ? (
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

                {/* Results */}
                {activeTab === 'player' && (player || error) && (
                    <SearchResults
                        player={player || ({} as Player)}
                        error={error || undefined}
                        onSearchMember={(name) =>
                            router.push(`/player/${encodeURIComponent(name)}`)
                        }
                    />
                )}

                {/* Search History */}
                <SearchHistory
                    recentSearches={
                        activeTab === 'player'
                            ? playerRecentSearches
                            : clanRecentSearches
                    }
                    onSearchClick={
                        activeTab === 'player'
                            ? handleRecentPlayerSearchClick
                            : handleRecentClanSearchClick
                    }
                    onRemoveSearch={
                        activeTab === 'player'
                            ? removePlayerSearch
                            : removeClanSearch
                    }
                    onClearAll={
                        activeTab === 'player'
                            ? clearPlayerSearches
                            : clearClanSearches
                    }
                />
            </div>
        </main>
    );
}
