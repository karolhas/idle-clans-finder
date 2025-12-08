'use client';

import { useState, useEffect, useCallback } from 'react';
import { LeaderboardData, GameMode, LeaderboardStat, EntityType, LeaderboardCategory } from '@/types/leaderboard.types';
import { fetchLeaderboard } from '@/lib/api/apiService';

export const useLeaderboardData = (
  gameMode: GameMode,
  entityType: EntityType,
  category: LeaderboardCategory,
  stat: LeaderboardStat | null,
  startCount: number = 1,
  maxCount: number = 100
) => {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (entityType === 'clan') {
        // Clan leaderboard uses same API as players/pets
        const result = await fetchLeaderboard(gameMode, entityType, category, stat!, startCount, maxCount);
        setData(result);
        setHasMore(result.entries.length === maxCount);
      } else {
        // Load initial batch of data
        const result = await fetchLeaderboard(gameMode, entityType, category, stat!, startCount, maxCount);
        setData(result);
        setHasMore(result.entries.length === maxCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [gameMode, entityType, category, stat, startCount, maxCount]);

  const loadMoreData = useCallback(async () => {
    if (!data || loadingMore || !hasMore || entityType === 'clan') return;

    try {
      setLoadingMore(true);
      const currentCount = data.entries.length;
      const nextStartCount = startCount + currentCount;
      const nextMaxCount = nextStartCount + maxCount - 1;

      const result = await fetchLeaderboard(gameMode, entityType, category, stat!, nextStartCount, nextMaxCount);

      if (result.entries.length === 0) {
        setHasMore(false);
      } else {
        setData({
          entries: [...data.entries, ...result.entries],
          totalCount: data.totalCount + result.entries.length
        });
        setHasMore(result.entries.length === maxCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more data');
    } finally {
      setLoadingMore(false);
    }
  }, [data, loadingMore, hasMore, entityType, gameMode, category, stat, startCount, maxCount]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return { data, loading, loadingMore, error, hasMore, loadMoreData };
};