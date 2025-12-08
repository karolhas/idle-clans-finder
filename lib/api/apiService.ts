import axios from 'axios';
import { Player } from '@/types/player.types';
import { ClanData } from '@/types/clan.types';
import { LeaderboardData, GameMode, LeaderboardStat, EntityType, LeaderboardCategory, LeaderboardEntry } from '@/types/leaderboard.types';

const BASE_URL = 'https://query.idleclans.com/api';
const TIMEOUT = 5000; // 5 seconds timeout

export const fetchPlayerProfile = async (username: string): Promise<Player> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/Player/profile/${encodeURIComponent(username)}`,
            { timeout: TIMEOUT }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            if (error.response?.status === 404) {
                throw new Error('Player not found.');
            }
        }
        throw new Error('Failed to fetch player data. Please try again.');
    }
};

export const fetchClanMembers = async (clanName: string): Promise<ClanData> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/Clan/recruitment/${encodeURIComponent(clanName)}`,
            { timeout: TIMEOUT }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            if (error.response?.status === 404) {
                throw new Error('Clan not found.');
            }
        }
        throw new Error('Failed to fetch clan data. Please try again.');
    }
};

export const fetchClanByName = async (clanName: string): Promise<ClanData> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/Clan/recruitment/${encodeURIComponent(clanName)}`,
            { timeout: TIMEOUT }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            if (error.response?.status === 404) {
                throw new Error('Clan not found.');
            }
        }
        throw new Error('Failed to fetch clan data. Please try again.');
    }
};

export const fetchLeaderboard = async (
    gameMode: GameMode,
    entityType: EntityType,
    category: LeaderboardCategory,
    stat: LeaderboardStat,
    startCount: number = 1,
    maxCount: number = 50
): Promise<LeaderboardData> => {
    try {
        const leaderboardName = `${entityType === 'pet' ? 'pets' : 'players'}:${gameMode}`;
        const response = await axios.get(
            `${BASE_URL}/Leaderboard/top/${leaderboardName}/${stat}`,
            {
                timeout: TIMEOUT,
                params: { startCount, maxCount }
            }
        );
        // Handle different possible response formats
        let entries: LeaderboardEntry[] = [];
        
        if (Array.isArray(response.data)) {
            if (response.data.length === 0) {
                // Empty array means no more data
                entries = [];
            } else if (typeof response.data[0] === 'number') {
                // Response is array of numbers (just values)
                entries = response.data.map((value: number, index: number) => ({
                    rank: startCount + index,
                    name: `Player ${startCount + index}`,
                    value: value
                }));
            } else if (typeof response.data[0] === 'object') {
                // Response is array of objects
                entries = response.data.map((entry: any, index: number) => ({
                    rank: entry.rank || (startCount + index),
                    name: entry.name || entry.playerName || entry.username || entry.player || `Player ${startCount + index}`,
                    value: entry.value || entry.score || entry.experience || entry.level || entry
                }));
            }
        } else if (typeof response.data === 'object') {
            // Response might be an object with rankings
            // Try to extract entries from various possible structures
            const possibleArrays = response.data.entries || response.data.rankings || response.data.players || response.data.top || Object.values(response.data);
            if (Array.isArray(possibleArrays)) {
                entries = possibleArrays.map((entry: any, index: number) => ({
                    rank: entry.rank || (startCount + index),
                    name: entry.name || entry.playerName || entry.username || entry.player || `Player ${startCount + index}`,
                    value: entry.value || entry.score || entry.experience || entry.level || entry
                }));
            }
        }
        
        return {
            entries,
            totalCount: entries.length
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            if (error.response?.status === 404) {
                // 404 might mean no more data available, return empty array instead of error
                console.log('No more leaderboard data available (404)');
                return { entries: [], totalCount: 0 };
            }
            if (error.response?.status && error.response.status >= 400) {
                console.error('API response status:', error.response.status);
                console.error('API response data:', error.response?.data);
                // For 400 errors (bad request), it likely means we've reached the API limit
                if (error.response.status === 400) {
                    console.log('Reached API pagination limit (400 error)');
                    return { entries: [], totalCount: 0 };
                }
                // For other 4xx/5xx errors, still throw
                throw new Error(`API error: ${error.response.status}`);
            }
        }
        throw new Error('Failed to fetch leaderboard data. Please try again.');
    }
};

export const fetchClanLeaderboard = async (
    gameMode: GameMode,
    limit: number = 100
): Promise<LeaderboardData> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/ClanCup/leaderboard/${gameMode}/totalPoints`,
            {
                timeout: TIMEOUT,
                params: { limit }
            }
        );
        // Assuming the response is an array of clan entries with rank, clanName, score
        const entries = response.data.map((entry: any, index: number) => ({
            rank: index + 1,
            name: entry.clanName || entry.name,
            value: entry.score || entry.totalPoints || entry.points || entry
        }));
        return {
            entries,
            totalCount: entries.length
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            if (error.response?.status === 404) {
                throw new Error('Clan leaderboard data not found.');
            }
        }
        throw new Error('Failed to fetch clan leaderboard data. Please try again.');
    }
};
