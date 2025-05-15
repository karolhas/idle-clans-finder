'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import SearchHistory from '@/components/SearchHistory';
import ClanInfoModal from '@/components/ClanInfoModal';
import ClanSkillDisplay from '@/components/skills/ClanSkillDisplay';
import { useSearchStore } from '@/lib/store/searchStore';

import { ClanData } from '@/types/clan.types';
import { fetchClanByName } from '@/lib/api/apiService';
import { FaSearch } from 'react-icons/fa';

export default function ClanPage() {
    const { clanName } = useParams<{ clanName: string }>();
    const router = useRouter();
    const {
        playerSearchQuery,
        clanSearchQuery,
        setPlayerSearchQuery,
        setClanSearchQuery,
        getCachedClan,
        setCachedClan,
    } = useSearchStore();

    const [clanData, setClanData] = useState<ClanData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<'player' | 'clan'>('clan');
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

    useEffect(() => {
        if (clanName && clanSearchQuery !== clanName) {
            setClanSearchQuery(clanName);
        }
    }, [clanName]);

    useEffect(() => {
        const cached = getCachedClan(clanName);
        if (cached) {
            setCachedClan(clanName, cached);
        }
    }, [clanName, getCachedClan, setCachedClan]);

    const handleTabChange = (tab: 'player' | 'clan') => {
        setActiveTab(tab);
        setError(null);

        // If we have a player search query, navigate to player page
        if (tab === 'player' && playerSearchQuery) {
            router.push(`/player/${encodeURIComponent(playerSearchQuery)}`);
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

        const loadClan = async () => {
            setLoading(true);
            try {
                // Check cache first
                const cachedData = getCachedClan(trimmed);
                if (cachedData) {
                    setClanData(cachedData);
                    setLoading(false);
                    return;
                }

                const rawData = await fetchClanByName(trimmed);

                let parsedSkills = undefined;
                if (rawData.serializedSkills) {
                    try {
                        parsedSkills = JSON.parse(rawData.serializedSkills);
                    } catch (err) {
                        console.error('Error parsing skills:', err);
                    }
                }

                const mergedData: ClanData = {
                    ...rawData,
                    skills: parsedSkills,
                };

                setClanData(mergedData);
                setCachedClan(trimmed, mergedData);
                setError(null);

                setClanRecentSearches((prev) => {
                    const updated = prev.includes(trimmed)
                        ? prev
                        : [trimmed, ...prev];
                    return updated.slice(0, 5);
                });
            } catch {
                setError('Clan not found.');
                setClanData(null);
            } finally {
                setLoading(false);
            }
        };

        loadClan();
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
                                    disabled={loading}
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
                                    loading ||
                                    !(
                                        activeTab === 'player'
                                            ? playerSearchQuery
                                            : clanSearchQuery
                                    ).trim()
                                }
                                className={`px-6 py-2 bg-emerald-600 text-white rounded-lg transition-colors cursor-pointer
                            ${loading ? 'opacity-50' : 'hover:bg-emerald-700'}`}
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

                <div className="h-10 md:h-16" />

                {activeTab === 'clan' && (
                    <>
                        {loading && (
                            <p className="text-gray-400">
                                Loading clan data...
                            </p>
                        )}
                        {error && (
                            <p className="text-red-400 font-semibold">
                                {error}
                            </p>
                        )}

                        {clanData && (
                            <>
                                <ClanInfoModal
                                    isOpen={false}
                                    standalone={true}
                                    onClose={() => {}}
                                    clanName={decodeURIComponent(clanName)}
                                    memberCount={
                                        clanData.memberlist?.length || 0
                                    }
                                    clanData={clanData}
                                />

                                {clanData.skills && (
                                    <ClanSkillDisplay
                                        skills={clanData.skills}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
