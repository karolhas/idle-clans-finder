import axios from 'axios';
import { Player } from '@/types/player.types';
import { ClanData } from '@/types/clan.types';

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
