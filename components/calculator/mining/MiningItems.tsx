"use client";

import { useCalculator } from "../CalculatorContext";
import { SKILL_ITEMS_MAP } from "@/utils/gamedata/skill-items";
import { LEVEL_TO_XP } from "@/utils/gamedata/calculator-constants";
import { SkillItem } from "@/types/calculator.types";
import { useState } from "react";
import React from "react";

export default function MiningItems() {
  const { state, setSelectedItem } = useCalculator();
  const { currentSkill, selectedItem } = state;
  const [sortBy, setSortBy] = useState<"level" | "exp" | "gold">("level");

  // Get the mining items
  const miningItems = SKILL_ITEMS_MAP[currentSkill] || [];

  // Sort items based on selected criterion
  const sortedItems = [...miningItems].sort((a, b) => {
    if (sortBy === "level") return a.level - b.level;
    if (sortBy === "exp") return b.expPerSecond - a.expPerSecond;
    return b.goldPerSecond - a.goldPerSecond;
  });

  const handleSelectItem = (itemName: string) => {
    setSelectedItem(itemName === selectedItem ? null : itemName);
  };

  // Find current level based on XP to determine which items the player can mine
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
    <div className="bg-black/60 p-6 rounded-2xl border-2 border-white/10 relative backdrop-blur-md shadow-xl hover:border-teal-500/50 hover:shadow-teal-900/20 transition-all duration-300 group mb-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          Select Mining Resources
        </h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="sortBy" className="text-sm text-gray-300">
            Sort by:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "level" | "exp" | "gold")
            }
            className="py-1 px-2 text-sm rounded-md bg-black/60 border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="level">Level</option>
            <option value="exp">XP per Second</option>
            <option value="gold">Gold per Second</option>
          </select>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-black sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Ore
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Level
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                XP
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Time (s)
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                XP/s
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Gold
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Gold/s
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedItems.map((item: SkillItem) => {
              const canMine = currentLevel >= item.level;
              const isSelected = selectedItem === item.name;

              return (
                <tr
                  key={item.name}
                  className={`
                                    cursor-pointer transition-colors
                                    ${
                                      !canMine
                                        ? "opacity-40 grayscale"
                                        : "hover:bg-white/5"
                                    }
                                    ${
                                      isSelected
                                        ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                                        : "border-l-2 border-transparent"
                                    }
                                `}
                  onClick={() => canMine && handleSelectItem(item.name)}
                >
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-white">
                    {item.name}
                  </td>
                  <td
                    className={`px-3 py-3 whitespace-nowrap text-sm font-mono ${
                      !canMine ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {item.level}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {item.exp}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {item.seconds}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {item.expPerSecond.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {item.goldValue.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {item.goldPerSecond.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {miningItems.length === 0 && (
        <div className="text-center text-gray-400 py-4">
          No mining resources available yet.
        </div>
      )}
    </div>
  );
}
