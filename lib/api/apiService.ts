import axios from 'axios';
import { Player } from '@/types/player.types';
import { ClanData } from '@/types/clan.types';

const BASE_URL = 'https://query.idleclans.com/api';

/**
 * Fetches a player's profile from the Idle Clans API
 * @param username The player's username
 * @returns Player data
 */
export const fetchPlayerProfile = async (username: string): Promise<Player> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/Player/profile/${encodeURIComponent(username)}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const fetchClanMembers = async (clanName: string): Promise<ClanData> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/Clan/recruitment/${encodeURIComponent(clanName)}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// New function for use in /clan/[clanName] page
export const fetchClanByName = async (clanName: string): Promise<ClanData> => {
    try {
        const response = await axios.get(
            `${BASE_URL}/Clan/recruitment/${encodeURIComponent(clanName)}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
