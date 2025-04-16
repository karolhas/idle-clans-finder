'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import { fetchPlayerProfile } from '@/lib/api/apiService';
import SearchResults from '@/components/SearchResults';
import SearchBar from '@/components/SearchBar';
import Sidebar from '@/components/Sidebar';
import SearchHistory from '@/components/SearchHistory';

import { Player } from '@/types/player.types';

export default function PlayerPage() {
    const { playerName } = useParams<{ playerName: string }>();
    const router = useRouter();

    const [player, setPlayer] = useState<Player | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save to localStorage on update
    useEffect(() => {
        if (recentSearches.length > 0) {
            localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        }
    }, [recentSearches]);

    const fetchData = async (name: string) => {
        if (!name) return;

        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchPlayerProfile(name);
            setPlayer(data);

            setRecentSearches((prev) => {
                const updated = prev.includes(name) ? prev : [name, ...prev];
                return updated.slice(0, 5); // Limit to 5 entries
            });
        } catch {
            setError('Player not found');
            setPlayer(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch when route param changes
    useEffect(() => {
        if (playerName) {
            fetchData(playerName);
        }
    }, [playerName]);

    const handleRecentSearchClick = (name: string) => {
        router.push(`/player/${encodeURIComponent(name)}`);
    };

    const removeSearch = (name: string) => {
        const filtered = recentSearches.filter((q) => q !== name);
        setRecentSearches(filtered);
        localStorage.setItem('recentSearches', JSON.stringify(filtered));
    };

    const clearSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
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

                    <SearchBar
                        onSearch={(query) => fetchData(query)}
                        isLoading={isLoading}
                    />

                    {(player || error) && (
                        <SearchResults
                            player={player || ({} as Player)}
                            error={error || undefined}
                            onSearchMember={(name) => fetchData(name)}
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
