'use client';

import { useCalculator } from '../CalculatorContext';
import { SKILL_ITEMS_MAP } from '@/utils/gamedata/skill-items';
import { LEVEL_TO_XP } from '@/utils/gamedata/calculator-constants';
import { SkillItem } from '@/types/calculator.types';
import { useState } from 'react';
import React from 'react';

// Extended interface for smithing items with material requirements
interface SmithingItem extends SkillItem {
    oreBarsNeeded?: number;
    coalNeeded?: number;
    tinNeeded?: number;
}

export default function SmithingItems() {
    const { state, setSelectedItem } = useCalculator();
    const { currentSkill, selectedItem } = state;
    const [sortBy, setSortBy] = useState<'level' | 'exp' | 'gold'>('level');

    // Get the smithing items
    const smithingItems =
        SKILL_ITEMS_MAP[currentSkill] || ([] as SmithingItem[]);

    // Group items by category
    const groupedItems: Record<string, SmithingItem[]> = {};
    smithingItems.forEach((item) => {
        const category = item.category || 'Other';
        if (!groupedItems[category]) {
            groupedItems[category] = [];
        }
        groupedItems[category].push(item as SmithingItem);
    });

    // Sort items within each category based on selected criterion
    Object.keys(groupedItems).forEach((category) => {
        groupedItems[category].sort((a, b) => {
            if (sortBy === 'level') return a.level - b.level;
            if (sortBy === 'exp') return b.expPerSecond - a.expPerSecond;
            return b.goldPerSecond - a.goldPerSecond;
        });
    });

    const handleSelectItem = (itemName: string) => {
        setSelectedItem(itemName === selectedItem ? null : itemName);
    };

    // Find current level based on XP to determine which items the player can smith
    const getCurrentLevel = (exp: number): number => {
        for (let level = 150; level >= 1; level--) {
            if (exp >= LEVEL_TO_XP[level]) {
                return level;
            }
        }
        return 1;
    };

    // Helper to display material requirements
    const getMaterialText = (item: SmithingItem, category: string): string => {
        const parts = [];

        if (item.oreBarsNeeded) {
            const materialName = category === 'Bars' ? 'Ore' : 'Bar';
            parts.push(
                `${item.oreBarsNeeded} ${materialName}${
                    item.oreBarsNeeded > 1 ? 's' : ''
                }`
            );
        }

        if (item.coalNeeded) {
            parts.push(`${item.coalNeeded} Coal`);
        }

        if (item.tinNeeded) {
            parts.push(`${item.tinNeeded} Tin`);
        }

        return parts.length > 0 ? parts.join(', ') : '';
    };

    const currentLevel = getCurrentLevel(state.currentExp);

    return (
        <div className="bg-[#001010] rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-emerald-300">
                    Select Smithing Items
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
                                Item
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
                                Materials
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
                                Gold
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                            >
                                Gold/s
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#001010] divide-y divide-gray-800">
                        {Object.keys(groupedItems).map((category) => (
                            <React.Fragment key={category}>
                                <tr className="bg-[#002020]">
                                    <td
                                        colSpan={8}
                                        className="px-3 py-2 whitespace-nowrap text-sm font-semibold text-emerald-300"
                                    >
                                        {category}
                                    </td>
                                </tr>
                                {groupedItems[category].map(
                                    (item: SmithingItem) => {
                                        const canCraft =
                                            currentLevel >= item.level;
                                        const isSelected =
                                            selectedItem === item.name;
                                        const materialsText = getMaterialText(
                                            item,
                                            category
                                        );

                                        return (
                                            <tr
                                                key={item.name}
                                                className={`
                                                cursor-pointer hover:bg-[#002020] transition-colors
                                                ${!canCraft ? 'opacity-50' : ''}
                                                ${
                                                    isSelected
                                                        ? 'bg-emerald-900/30'
                                                        : ''
                                                }
                                            `}
                                                onClick={() =>
                                                    canCraft &&
                                                    handleSelectItem(item.name)
                                                }
                                            >
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-white">
                                                    {item.name}
                                                </td>
                                                <td
                                                    className={`px-3 py-2 whitespace-nowrap text-sm ${
                                                        !canCraft
                                                            ? 'text-red-400'
                                                            : 'text-emerald-400'
                                                    }`}
                                                >
                                                    {item.level}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                                    {materialsText || '-'}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                                    {item.exp}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                                    {item.seconds}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                                    {item.expPerSecond.toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                                    {item.goldValue.toLocaleString()}
                                                </td>
                                                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-300">
                                                    {item.goldPerSecond.toFixed(
                                                        2
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {smithingItems.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                    No smithing items available yet.
                </div>
            )}
        </div>
    );
}
