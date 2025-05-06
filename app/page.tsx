'use client';

// hooks
import { useEffect, useState } from 'react';
// api
import { fetchPlayerProfile, fetchClanByName } from '@/lib/api/apiService';
// components
import SearchResults from '@/components/SearchResults';
import SearchHistory from '@/components/SearchHistory';
import ClanInfoModal from '@/components/ClanInfoModal';
import ClanSkillDisplay from '@/components/skills/ClanSkillDisplay';
// types
import { Player } from '@/types/player.types';
import { ClanData } from '@/types/clan.types';
import { FaSearch } from 'react-icons/fa';

export default function Home() {
    const [activeTab, setActiveTab] = useState<'player' | 'clan'>('player');
    const [playerSearchResults, setPlayerSearchResults] =
        useState<Player | null>(null);
    const [clanSearchResults, setClanSearchResults] = useState<ClanData | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [playerSearches, setPlayerSearches] = useState<string[]>([]);
    const [clanSearches, setClanSearches] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Load recent searches on component mount
    useEffect(() => {
        const savedPlayerSearches = localStorage.getItem(
            'recentPlayerSearches'
        );
        if (savedPlayerSearches) {
            setPlayerSearches(JSON.parse(savedPlayerSearches));
        }

        const savedClanSearches = localStorage.getItem('recentClanSearches');
        if (savedClanSearches) {
            setClanSearches(JSON.parse(savedClanSearches));
        }
    }, []);

    // Update localStorage whenever searches change
    useEffect(() => {
        if (playerSearches.length > 0) {
            localStorage.setItem(
                'recentPlayerSearches',
                JSON.stringify(playerSearches)
            );
        }

        if (clanSearches.length > 0) {
            localStorage.setItem(
                'recentClanSearches',
                JSON.stringify(clanSearches)
            );
        }
    }, [playerSearches, clanSearches]);

    const handlePlayerSearch = async (query: string) => {
        setSearchQuery(query);
        setIsLoading(true);
        setError(null);
        // Don't clear clan results when searching for a player
        // setClanSearchResults(null);

        try {
            const data = await fetchPlayerProfile(query);
            setPlayerSearchResults(data);
            setSearchQuery(''); // Clear the search query after search

            // No duplicate searches saved
            setPlayerSearches((prev) => {
                const newSearches = prev.includes(query)
                    ? prev
                    : [query, ...prev];
                return newSearches.slice(0, 5); // Max 5 searches shown
            });
        } catch (err: unknown) {
            console.error('Error searching for player:', err);
            setError('Player not found');
            setPlayerSearchResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClanSearch = async (query: string) => {
        setSearchQuery(query);
        setIsLoading(true);
        setError(null);
        // Don't clear player results when searching for a clan
        // setPlayerSearchResults(null);

        try {
            const rawData = await fetchClanByName(query);

            // Parse serialized skills if available
            let parsedSkills = undefined;
            if (rawData.serializedSkills) {
                try {
                    parsedSkills = JSON.parse(rawData.serializedSkills);
                } catch (err) {
                    console.error('Error parsing skills:', err);
                }
            }

            // Create the final clan data with parsed skills
            const clanData: ClanData = {
                ...rawData,
                skills: parsedSkills,
            };

            setClanSearchResults(clanData);
            setSearchQuery(''); // Clear the search query after search

            // No duplicate searches saved
            setClanSearches((prev) => {
                const newSearches = prev.includes(query)
                    ? prev
                    : [query, ...prev];
                return newSearches.slice(0, 5); // Max 5 searches shown
            });
        } catch (err: unknown) {
            console.error('Error searching for clan:', err);
            setError('Clan not found');
            setClanSearchResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Add a handler for tab changes to clear the error state
    const handleTabChange = (tab: 'player' | 'clan') => {
        setActiveTab(tab);
        setError(null); // Clear any error messages when switching tabs
        setSearchQuery(''); // Clear the search query when switching tabs
    };

    const handleSearch = (query: string) => {
        if (activeTab === 'player') {
            handlePlayerSearch(query);
        } else {
            handleClanSearch(query);
        }
    };

    const clearSearches = () => {
        if (activeTab === 'player') {
            setPlayerSearches([]);
            localStorage.removeItem('recentPlayerSearches');
        } else {
            setClanSearches([]);
            localStorage.removeItem('recentClanSearches');
        }
    };

    const removeSearch = (query: string) => {
        if (activeTab === 'player') {
            const updatedSearches = playerSearches.filter(
                (search) => search !== query
            );
            setPlayerSearches(updatedSearches);
            localStorage.setItem(
                'recentPlayerSearches',
                JSON.stringify(updatedSearches)
            );
        } else {
            const updatedSearches = clanSearches.filter(
                (search) => search !== query
            );
            setClanSearches(updatedSearches);
            localStorage.setItem(
                'recentClanSearches',
                JSON.stringify(updatedSearches)
            );
        }
    };

    const handleRecentSearchClick = (query: string) => {
        handleSearch(query);
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
                    <div className="bg-emerald-900/50 p-6">
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
                                if (searchQuery.trim()) {
                                    handleSearch(searchQuery.trim());
                                }
                            }}
                            className="flex gap-2 max-w-full"
                        >
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    placeholder={`${
                                        activeTab === 'player'
                                            ? 'Player'
                                            : 'Clan'
                                    } name`}
                                    className="w-full px-4 py-2 bg-gray-200 border border-gray-700 text-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                    disabled={isLoading}
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-600"
                                        aria-label="Clear search"
                                    >
                                        <span className="mr-2">✕</span>
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading || !searchQuery.trim()}
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
                {activeTab === 'player' && (playerSearchResults || error) && (
                    <SearchResults
                        player={playerSearchResults || ({} as Player)}
                        error={error || undefined}
                        onSearchMember={handlePlayerSearch}
                        onSearchClan={(clanName: string) => {
                            setActiveTab('clan');
                            handleClanSearch(clanName);
                        }}
                    />
                )}

                {/* Clan Search Results */}
                {activeTab === 'clan' && (
                    <>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}
                        {clanSearchResults && (
                            <div className="mt-8">
                                <ClanInfoModal
                                    isOpen={false}
                                    standalone={true}
                                    onClose={() => {}}
                                    clanName={
                                        clanSearchResults.clanName ||
                                        clanSearchResults.guildName ||
                                        'Clan'
                                    }
                                    memberCount={
                                        clanSearchResults.memberlist?.length ||
                                        0
                                    }
                                    clanData={clanSearchResults}
                                    onSearchMember={(memberName) => {
                                        setActiveTab('player');
                                        handlePlayerSearch(memberName);
                                    }}
                                />

                                {clanSearchResults.skills && (
                                    <ClanSkillDisplay
                                        skills={clanSearchResults.skills}
                                    />
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Search History */}
                <SearchHistory
                    recentSearches={
                        activeTab === 'player' ? playerSearches : clanSearches
                    }
                    onSearchClick={handleRecentSearchClick}
                    onRemoveSearch={removeSearch}
                    onClearAll={clearSearches}
                />
            </div>
        </main>
    );
}
