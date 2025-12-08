'use client';

import { FaChartBar } from 'react-icons/fa';
import { useState } from 'react';
import { GameMode, LeaderboardStat, EntityType, LeaderboardCategory, SkillStat, BossStat, RaidStat } from '@/types/leaderboard.types';
import { useLeaderboardData } from '@/hooks/useLeaderboardData';
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable';

const PLAYER_SKILLS: { value: SkillStat; label: string }[] = [
  { value: 'total_level', label: 'Total Level' },
  { value: 'attack', label: 'Attack' },
  { value: 'strength', label: 'Strength' },
  { value: 'defence', label: 'Defence' },
  { value: 'archery', label: 'Archery' },
  { value: 'magic', label: 'Magic' },
  { value: 'health', label: 'Health' },
  { value: 'crafting', label: 'Crafting' },
  { value: 'woodcutting', label: 'Woodcutting' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'fishing', label: 'Fishing' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'mining', label: 'Mining' },
  { value: 'smithing', label: 'Smithing' },
  { value: 'foraging', label: 'Foraging' },
  { value: 'farming', label: 'Farming' },
  { value: 'agility', label: 'Agility' },
  { value: 'plundering', label: 'Plundering' },
  { value: 'enchanting', label: 'Enchanting' },
  { value: 'brewing', label: 'Brewing' },
  { value: 'exterminating', label: 'Exterminating' },
];

const PET_SKILLS: { value: SkillStat; label: string }[] = [
  { value: 'total_level', label: 'Total Level' },
  { value: 'crafting', label: 'Crafting' },
  { value: 'woodcutting', label: 'Woodcutting' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'fishing', label: 'Fishing' },
  { value: 'cooking', label: 'Cooking' },
  { value: 'mining', label: 'Mining' },
  { value: 'smithing', label: 'Smithing' },
  { value: 'foraging', label: 'Foraging' },
  { value: 'farming', label: 'Farming' },
  { value: 'agility', label: 'Agility' },
  { value: 'plundering', label: 'Plundering' },
  { value: 'enchanting', label: 'Enchanting' },
  { value: 'brewing', label: 'Brewing' },
  { value: 'exterminating', label: 'Exterminating' },
];

const BOSSES: { value: BossStat; label: string }[] = [
  { value: 'zeus', label: 'Zeus' },
  { value: 'medusa', label: 'Medusa' },
  { value: 'griffin', label: 'Griffin' },
  { value: 'hades', label: 'Hades' },
  { value: 'chimera', label: 'Chimera' },
  { value: 'devil', label: 'Devil' },
  { value: 'kronos', label: 'Kronos' },
  { value: 'sobek', label: 'Sobek' },
  { value: 'mesines', label: 'Mesines' },
];

const RAIDS: { value: RaidStat; label: string }[] = [
  { value: 'guardians_of_the_citadel', label: 'Guardians of the Citadel' },
  { value: 'reckoning_of_the_gods', label: 'Reckoning of the Gods' },
  { value: 'bloodmoon_massacre', label: 'Bloodmoon Massacre' },
];

export default function RankingsPage() {
  const [entityType, setEntityType] = useState<EntityType>('player');
  const [gameMode, setGameMode] = useState<GameMode>('default');
  const [category, setCategory] = useState<LeaderboardCategory>('skills');
  const [selectedStat, setSelectedStat] = useState<LeaderboardStat>('total_level');

  const { data, loading, loadingMore, error, hasMore, loadMoreData, dataSource, lastUpdated, forceRefresh } = useLeaderboardData(
    gameMode,
    entityType,
    category,
    selectedStat,
    1,
    100
  );

  return (
    <main className="p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center">
          <FaChartBar className="mr-3" />
          Leaderboards
        </h1>

        {/* Controls */}
        <div className="bg-[#002020] p-6 rounded-lg shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Entity Type Selector */}
            <div className="space-y-3">
              <label className="text-gray-300 font-medium text-sm uppercase tracking-wide">Entity Type</label>
              <select
                value={entityType}
                onChange={(e) => {
                  const newEntityType = e.target.value as EntityType;
                  setEntityType(newEntityType);
                  // If switching to pet and current category is bosses/raids, switch to skills
                  if (newEntityType === 'pet' && (category === 'bosses' || category === 'raids')) {
                    setCategory('skills');
                    setSelectedStat('total_level');
                  }
                  // If switching to pet and current stat is a combat skill or health, switch to total_level
                  if (newEntityType === 'pet' && category === 'skills' && ['attack', 'strength', 'defence', 'archery', 'magic', 'health'].includes(selectedStat)) {
                    setSelectedStat('total_level');
                  }
                }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="player" className="bg-[#002020]">Players</option>
                <option value="clan" className="bg-[#002020]">Clans</option>
                <option value="pet" className="bg-[#002020]">Pets</option>
              </select>
            </div>

            {/* Game Mode Selector */}
            <div className="space-y-3">
              <label className="text-gray-300 font-medium text-sm uppercase tracking-wide">Game Mode</label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value as GameMode)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="default" className="bg-[#002020]">Default</option>
                <option value="ironman" className="bg-[#002020]">Ironman</option>
                <option value="group_ironman" className="bg-[#002020]">Group Ironman</option>
              </select>
            </div>

            {/* Category and Stat Selectors - Show for all entity types */}
            <>
              {/* Category Selector */}
              <div className="space-y-3">
                <label className="text-gray-300 font-medium text-sm uppercase tracking-wide">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    const newCategory = e.target.value as LeaderboardCategory;
                    setCategory(newCategory);
                    // Set default stat based on category
                    if (newCategory === 'skills') setSelectedStat('total_level');
                    else if (newCategory === 'bosses') setSelectedStat('zeus');
                    else if (newCategory === 'raids') setSelectedStat('guardians_of_the_citadel');
                  }}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="skills" className="bg-[#002020]">Skills</option>
                  {entityType !== 'pet' && (
                    <>
                      <option value="bosses" className="bg-[#002020]">Bosses</option>
                      <option value="raids" className="bg-[#002020]">Raids</option>
                    </>
                  )}
                </select>
              </div>

              {/* Stat Selector */}
              <div className="space-y-3">
                <label className="text-gray-300 font-medium text-sm uppercase tracking-wide">
                  {category === 'skills' ? 'Skill' : category === 'bosses' ? 'Boss' : 'Raid'}
                </label>
                <select
                  value={selectedStat}
                  onChange={(e) => setSelectedStat(e.target.value as LeaderboardStat)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {category === 'skills' && (entityType === 'pet' ? PET_SKILLS : PLAYER_SKILLS).map((stat) => (
                    <option key={stat.value} value={stat.value} className="bg-[#002020]">
                      {stat.label}
                    </option>
                  ))}
                  {category === 'bosses' && entityType !== 'pet' && BOSSES.map((stat) => (
                    <option key={stat.value} value={stat.value} className="bg-[#002020]">
                      {stat.label}
                    </option>
                  ))}
                  {category === 'raids' && entityType !== 'pet' && RAIDS.map((stat) => (
                    <option key={stat.value} value={stat.value} className="bg-[#002020]">
                      {stat.label}
                    </option>
                  ))}
                </select>
              </div>
            </>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Data Source Indicator */}
        {dataSource && lastUpdated && !loading && (
          <div className="mb-4 text-right">
            <div className="inline-flex items-center gap-2 text-sm text-gray-400">
              <span 
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  dataSource === 'cache' 
                    ? 'bg-green-900/20 text-green-400 border border-green-500/20 cursor-pointer hover:bg-green-900/30 hover:border-green-500/40' 
                    : 'bg-blue-900/20 text-blue-400 border border-blue-500/20'
                }`}
                onClick={dataSource === 'cache' ? forceRefresh : undefined}
                title={dataSource === 'cache' ? 'Click to refresh with live data' : undefined}
              >
                {dataSource === 'cache' ? '💾 Local' : '🌐 Live'}
              </span>
              <span>Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <LeaderboardTable
          entries={data?.entries || []}
          isLoading={loading}
          entityType={entityType}
        />

        {/* Load More Button */}
        {data && data.entries.length > 0 && hasMore && entityType !== 'clan' && (
          <div className="mt-6 text-center">
            <button
              onClick={loadMoreData}
              disabled={loadingMore}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                'Load Next 100'
              )}
            </button>
          </div>
        )}

        {/* End of data message */}
        {data && data.entries.length > 0 && !hasMore && (
          <div className="mt-6 text-center text-gray-400">
            {entityType === 'clan'
              ? 'Showing top clans'
              : `Showing all ${data.entries.length} ${entityType === 'pet' ? 'pets' : 'players'}`
            }
          </div>
        )}

        {/* Initial message */}
        {data && data.entries.length === 0 && !loading && (
          <div className="mt-6 text-center text-gray-400">
            No data available for the selected criteria
          </div>
        )}
      </div>
    </main>
  );
}
