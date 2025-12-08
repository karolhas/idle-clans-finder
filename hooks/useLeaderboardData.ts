'use client';

import { useState, useEffect } from 'react';
import { LeaderboardData, GameMode, LeaderboardStat, EntityType, LeaderboardCategory } from '@/types/leaderboard.types';
import { fetchLeaderboard, fetchClanLeaderboard } from '@/lib/api/apiService';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result: LeaderboardData;
        if (entityType === 'clan') {
          result = await fetchClanLeaderboard(gameMode, maxCount);
        } else {
          // For players and pets, stat should not be null
          result = await fetchLeaderboard(gameMode, entityType, category, stat!, startCount, maxCount);
        }
        
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [gameMode, entityType, category, stat, startCount, maxCount]);

  return { data, loading, error };
};