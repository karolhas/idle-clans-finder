"use client";

import Link from "next/link";
import { LeaderboardEntry } from "@/types/leaderboard.types";
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa";

interface Props {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
  entityType?: 'player' | 'clan' | 'pet';
}

const formatNum = (n: number) => new Intl.NumberFormat().format(Math.round(n));

const getRankIcon = (rank: number) => {
  if (rank === 1) return <FaTrophy className="text-yellow-400" />;
  if (rank === 2) return <FaMedal className="text-gray-400" />;
  if (rank === 3) return <FaAward className="text-amber-600" />;
  return null;
};

const getRankColor = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-amber-600";
  return "text-gray-300";
};

export default function LeaderboardTable({ entries, isLoading = false, entityType = 'player' }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="p-8 text-center text-gray-400">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
        <div className="p-8 text-center text-gray-400">
          No leaderboard data available.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {entries.map((entry) => (
              <tr key={entry.rank} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className={`text-lg font-bold ${getRankColor(entry.rank)}`}>
                      #{entry.rank}
                    </span>
                    {getRankIcon(entry.rank)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entityType === 'pet' ? (
                    <Link
                      href={`/search?q=${encodeURIComponent(entry.name)}`}
                      className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      {entry.name}
                    </Link>
                  ) : (entityType === 'player' || entityType === 'clan') ? (
                    <Link
                      href={`/search?q=${encodeURIComponent(entry.name)}${entityType === 'clan' ? '&type=clan' : ''}`}
                      className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      {entry.name}
                    </Link>
                  ) : (
                    <div className="text-sm font-medium text-white">
                      {entry.name}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-emerald-400 font-mono">
                    {formatNum(entry.value)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}