//hooks
import axios from "axios";

const BASE_URL = "https://query.idleclans.com/api";

export const fetchPlayerProfile = async (username: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/Player/profile/${username}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchClanMembers = async (clanName: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/Clan/recruitment/${clanName}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
