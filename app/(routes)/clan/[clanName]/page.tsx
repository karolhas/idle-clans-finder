'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import SearchBar from '@/components/SearchBar';
import SearchHistory from '@/components/SearchHistory';
import ClanInfoModal from '@/components/ClanInfoModal';
import ClanSkillDisplay from '@/components/skills/ClanSkillDisplay';

import { ClanData } from '@/types/clan.types';
import { fetchClanByName } from '@/lib/api/apiService';
import { FaSearch } from 'react-icons/fa';

export default function ClanPage() {
    const { clanName } = useParams<{ clanName: string }>();
    const router = useRouter();

    const [clanData, setClanData] = useState<ClanData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (!clanName) return;

        const loadClan = async () => {
            setLoading(true);
            try {
                const rawData = await fetchClanByName(clanName);

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
                setError(null);
            } catch {
                setError('Clan not found.');
                setClanData(null);
            } finally {
                setLoading(false);
            }
        };

        loadClan();
    }, [clanName]);

    const handleSearch = (query: string) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        if (trimmed.toLowerCase().startsWith('@clan ')) {
            const clan = trimmed.slice(6).trim();
            if (clan) {
                router.push(`/clan/${encodeURIComponent(clan)}`);
            }
        } else {
            router.push(`/player/${encodeURIComponent(trimmed)}`);
        }
    };

    const handleRecentClick = (query: string) => {
        router.push(`/player/${encodeURIComponent(query)}`);
    };

    const handleRemove = (query: string) => {
        const updated = recentSearches.filter((q) => q !== query);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const handleClearAll = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-4 sm:p-8">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center mb-8">
                        <h1 className="text-2xl font-bold text-emerald-400 flex items-center">
                            <FaSearch className="mr-3" />
                            Search for a player or clan
                        </h1>
                    </div>

                    <SearchBar onSearch={handleSearch} isLoading={loading} />

                    <SearchHistory
                        recentSearches={recentSearches}
                        onSearchClick={handleRecentClick}
                        onRemoveSearch={handleRemove}
                        onClearAll={handleClearAll}
                    />

                    <div className="h-10 md:h-16" />

                    {loading && (
                        <p className="text-gray-400">Loading clan data...</p>
                    )}
                    {error && (
                        <p className="text-red-400 font-semibold">{error}</p>
                    )}

                    {clanData && (
                        <>
                            <ClanInfoModal
                                isOpen={false}
                                standalone={true}
                                onClose={() => {}}
                                clanName={decodeURIComponent(clanName)}
                                memberCount={clanData.memberlist?.length || 0}
                                clanData={clanData}
                            />

                            {clanData.skills && (
                                <ClanSkillDisplay skills={clanData.skills} />
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
