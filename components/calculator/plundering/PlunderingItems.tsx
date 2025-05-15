'use client';

import { useCalculator } from '../CalculatorContext';
import { SKILL_ITEMS_MAP } from '@/utils/gamedata/skill-items';
import { LEVEL_TO_XP } from '@/utils/gamedata/calculator-constants';
import { SkillItem } from '@/types/calculator.types';
import { useState } from 'react';
import React from 'react';

// Extended interface for plundering items
interface PlunderingItem extends SkillItem {
    successRate: number;
}

export default function PlunderingItems() {
    const { state, setSelectedItem } = useCalculator();
    const { currentSkill, selectedItem } = state;
    const [sortBy, setSortBy] = useState<'level' | 'exp' | 'gold'>('level');

    // Get the plundering items
    const plunderingItems =
        (SKILL_ITEMS_MAP[currentSkill] as PlunderingItem[]) || [];

    // Sort items based on selected criterion
    const sortedItems = [...plunderingItems].sort((a, b) => {
        if (sortBy === 'level') return a.level - b.level;
        if (sortBy === 'exp') return b.expPerSecond - a.expPerSecond;
        return b.goldPerSecond - a.goldPerSecond;
    });

    const handleSelectItem = (itemName: string) => {
        setSelectedItem(itemName === selectedItem ? null : itemName);
    };

    // Find current level based on XP to determine which locations the player can plunder
    const getCurrentLevel = (exp: number): number => {
        for (let level = 150; level >= 1; level--) {
            if (exp >= LEVEL_TO_XP[level]) {
                return level;
            }
        }
        return 1;
    };

    const currentLevel = getCurrentLevel(state.currentExp);

    return (
        <div className="bg-[#001010] rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-emerald-300">
                    Select Plundering Locations
                </h2>
                <div className="flex items-center space-x-2">
                    <label htmlFor="sortBy" className="text-sm text-gray-300">
                        Sort by:
                    </label>
                    <select
                        id="sortBy"
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(
                                e.target.value as 'level' | 'exp' | 'gold'
                            )
                        }
                        className="py-1 px-2 text-sm rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value="level">Level</option>
                        <option value="exp">XP per Second</option>
                        <option value="gold">Gold per Second</option>
                    </select>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-[#002020]">
                        <tr>
                            <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Location
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Level
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                XP
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Time (s)
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                XP/s
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Success Rate
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#001010] divide-y divide-gray-800">
                        {sortedItems.map((item: PlunderingItem) => {
                            const canPlunder = currentLevel >= item.level;
                            const isSelected = selectedItem === item.name;

                            return (
                                <tr
                                    key={item.name}
                                    className={`
                                    cursor-pointer hover:bg-[#002020] transition-colors
                                    ${!canPlunder ? 'opacity-50' : ''}
                                    ${isSelected ? 'bg-emerald-900/30' : ''}
                                `}
                                    onClick={() =>
                                        canPlunder &&
                                        handleSelectItem(item.name)
                                    }
                                >
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-white">
                                        {item.name}
                                    </td>
                                    <td
                                        className={`px-3 py-2 whitespace-nowrap text-sm ${
                                            !canPlunder
                                                ? 'text-red-400'
                                                : 'text-emerald-400'
                                        }`}
                                    >
                                        {item.level}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                        {item.exp}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                        {item.seconds}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                        {item.expPerSecond.toFixed(2)}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                        {item.successRate}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {plunderingItems.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                    No locations available for plundering yet.
                </div>
            )}
        </div>
    );
}
