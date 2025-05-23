import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player } from '@/types/player.types';
import type { ClanData } from '@/types/clan.types';

interface CachedData<T> {
    data: T;
    timestamp: number;
}

interface SearchState {
    playerSearchQuery: string;
    clanSearchQuery: string;
    latestPlayerLookup: Player | null,
    setPlayerSearchQuery: (query: string) => void;
    setClanSearchQuery: (query: string) => void;
    getCachedPlayer: (username: string) => Player | null;
    getCachedClan: (clanName: string) => ClanData | null;
    setCachedPlayer: (username: string, data: Player) => void;
    setCachedClan: (clanName: string, data: ClanData) => void;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useSearchStore = create<SearchState>()(
    persist(
        (set) => ({
            playerSearchQuery: '',
            clanSearchQuery: '',
            latestPlayerLookup: null,
            setPlayerSearchQuery: (query: string) =>
                set({ playerSearchQuery: query }),
            setClanSearchQuery: (query: string) =>
                set({ clanSearchQuery: query }),

            getCachedPlayer: (username: string) => {
                const cached = localStorage.getItem(`player_${username}`);
                if (!cached) return null;

                const { data, timestamp }: CachedData<Player> =
                    JSON.parse(cached);
                if (Date.now() - timestamp > CACHE_DURATION) {
                    localStorage.removeItem(`player_${username}`);
                    return null;
                }

                return data;
            },

            getCachedClan: (clanName: string) => {
                const cached = localStorage.getItem(`clan_${clanName}`);
                if (!cached) return null;

                const { data, timestamp }: CachedData<ClanData> =
                    JSON.parse(cached);
                if (Date.now() - timestamp > CACHE_DURATION) {
                    localStorage.removeItem(`clan_${clanName}`);
                    return null;
                }

                return data;
            },

            setCachedPlayer: (username: string, data: Player) => {
                const cacheData: CachedData<Player> = {
                    data,
                    timestamp: Date.now(),
                };
                localStorage.setItem(
                    `player_${username}`,
                    JSON.stringify(cacheData)
                );
                set({ latestPlayerLookup: data });
            },

            setCachedClan: (clanName: string, data: ClanData) => {
                const cacheData: CachedData<ClanData> = {
                    data,
                    timestamp: Date.now(),
                };
                localStorage.setItem(
                    `clan_${clanName}`,
                    JSON.stringify(cacheData)
                );
            },
        }),
        {
            name: 'search-store',
            partialize: (state) => ({
                playerSearchQuery: state.playerSearchQuery,
                clanSearchQuery: state.clanSearchQuery,
            }),
        }
    )
);
