'use client';

// hooks
import { useEffect, useState } from 'react';
import Image from 'next/image';
// api
import { fetchPlayerProfile } from '@/lib/api/apiService';
// components
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import Sidebar from '@/components/Sidebar';
import SearchHistory from '@/components/SearchHistory';
// types
import { Player } from '@/types/player.types';

export default function Home() {
    const [searchResults, setSearchResults] = useState<Player | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Load recent searches
    useEffect(() => {
        // Retrieve recent searches
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    // Update localStorage whenever search is made
    useEffect(() => {
        if (recentSearches.length > 0) {
            localStorage.setItem(
                'recentSearches',
                JSON.stringify(recentSearches)
            );
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
                const newSearches = prev.includes(query)
                    ? prev
                    : [query, ...prev];
                return newSearches.slice(0, 5); // Max 5 searches shown. Change me as needed
            });
        } catch (error: unknown) {
            if (
                error instanceof Error &&
                'response' in error &&
                typeof error.response === 'object' &&
                error.response !== null &&
                'status' in error.response &&
                error.response.status === 404
            ) {
                setError('Player not found');
            } else {
                setError('Error fetching player data. Please try again.');
            }
            setSearchResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches'); // Clear from localStorage
    };

    const removeSearch = (query: string) => {
        const updatedSearches = recentSearches.filter(
            (search) => search !== query
        );
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    const handleRecentSearchClick = (query: string) => {
        handleSearch(query); // Trigger the search for that player when clicked
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-4 md:ml-64 md:p-8">
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

                    <SearchBar onSearch={handleSearch} isLoading={isLoading} />
                    {(searchResults || error) && (
                        <SearchResults
                            player={searchResults || ({} as Player)}
                            error={error || undefined}
                        />
                    )}
                    <SearchHistory
                        recentSearches={recentSearches}
                        onSearchClick={handleRecentSearchClick}
                        onRemoveSearch={removeSearch}
                        onClearAll={clearSearches}
                    />
                </div>
            </main>
        </div>
    );
}
