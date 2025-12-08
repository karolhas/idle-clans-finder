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
    maxCount: number = 100
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

        // API returns consistent format: { username, level, score, expCapDate }
        // For skills: use level as value
        // For bosses/raids: use score as value
        const isSkillCategory = category === 'skills';

        let entries: LeaderboardEntry[] = [];
        if (Array.isArray(response.data)) {
            entries = response.data.map((entry: any, index: number) => ({
                rank: startCount + index,
                name: entry.username || entry.name || `Player ${startCount + index}`,
                value: isSkillCategory ? (entry.level || 0) : (entry.score || 0)
            }));
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
                // 404 might mean no data available for this stat
                console.log('No leaderboard data available for this stat');
                return { entries: [], totalCount: 0 };
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
