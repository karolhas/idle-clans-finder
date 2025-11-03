import axios from 'axios';
import type { ItemComprehensive, LatestPricesResponse } from '@/types/market.types';

const BASE_URL = 'https://query.idleclans.com/api';
const TIMEOUT = 8000;

export const fetchLatestMarketPrices = async (
  includeAveragePrice: boolean = true
): Promise<LatestPricesResponse> => {
  const url = `${BASE_URL}/PlayerMarket/items/prices/latest`;
  try {
    const response = await axios.get(url, {
      params: { includeAveragePrice, _: Date.now() }, // cache-busting param
      timeout: TIMEOUT,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    // API returns an array of items
    return (response.data ?? []) as LatestPricesResponse;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Market request timed out');
      }
      const msg = error.response?.data?.message || 'Failed to load market prices';
      throw new Error(msg);
    }
    throw new Error('Failed to load market prices');
  }
};

export const fetchItemComprehensive = async (
  itemId: number
): Promise<ItemComprehensive> => {
  const url = `${BASE_URL}/PlayerMarket/items/prices/latest/comprehensive/${encodeURIComponent(
    itemId
  )}`;
  try {
    const response = await axios.get(url, {
      timeout: TIMEOUT,
      params: { _: Date.now() }, // cache-busting
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    return (response.data ?? { itemId }) as ItemComprehensive;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Comprehensive market request timed out');
      }
      const msg = error.response?.data?.message || 'Failed to load item details';
      throw new Error(msg);
    }
    throw new Error('Failed to load item details');
  }
};


