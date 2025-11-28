"use client";

import { useCalculator } from "../CalculatorContext";
import { SKILL_ITEMS_MAP } from "@/utils/gamedata/skill-items";
import { LEVEL_TO_XP } from "@/utils/gamedata/calculator-constants";
import { SkillItem } from "@/types/calculator.types";
import { useState } from "react";
import React from "react";

export default function EnchantingItems() {
  const { state, setSelectedItem } = useCalculator();
  const { currentSkill, selectedItem } = state;
  const [sortBy, setSortBy] = useState<"level" | "exp" | "gold">("level");

  // Get the enchanting items
  const enchantingItems = (SKILL_ITEMS_MAP[currentSkill] as SkillItem[]) || [];

  // Sort items based on selected criterion
  const sortedItems = [...enchantingItems].sort((a, b) => {
    if (sortBy === "level") return a.level - b.level;
    if (sortBy === "exp") return b.expPerSecond - a.expPerSecond;
    return b.goldPerSecond - a.goldPerSecond;
  });

  const handleSelectItem = (itemName: string) => {
    setSelectedItem(itemName === selectedItem ? null : itemName);
  };

  // Find current level based on XP to determine which scrolls the player can enchant
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
    <div className="bg-black/70 p-6 rounded-2xl border-2 border-white/10 relative backdrop-blur-md shadow-xl hover:border-teal-500/50 hover:shadow-teal-900/20 transition-all duration-300 group mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-500"></span>
          Select Scrolls to Enchant
        </h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="sortBy" className="text-sm text-gray-400">
            Sort by:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as "level" | "exp" | "gold")
            }
            className="py-1.5 px-3 text-sm rounded-lg bg-black/60 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          >
            <option value="level">Level</option>
            <option value="exp">XP per Second</option>
            <option value="gold">Gold per Second</option>
          </select>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        <table className="min-w-full divide-y divide-white/5">
          <thead className="bg-black sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Scroll
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
                Magic Req
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                XP
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedItems.map((item: SkillItem) => {
              const canEnchant = currentLevel >= item.level;
              const isSelected = selectedItem === item.name;

              return (
                <tr
                  key={item.name}
                  className={`
                                    cursor-pointer transition-colors
                                    ${
                                      !canEnchant
                                        ? "opacity-40 grayscale"
                                        : "hover:bg-white/5"
                                    }
                                    ${
                                      isSelected
                                        ? "bg-emerald-500/10 border-l-2 border-emerald-500"
                                        : "border-l-2 border-transparent"
                                    }
                                `}
                  onClick={() => canEnchant && handleSelectItem(item.name)}
                >
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-300">
                    {item.name}
                  </td>
                  <td
                    className={`px-3 py-3 whitespace-nowrap text-sm font-mono ${
                      !canEnchant ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {item.level}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {item.category}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-300 font-mono">
                    {item.exp.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {enchantingItems.length === 0 && (
        <div className="text-center text-gray-400 py-8 italic bg-black/20 rounded-lg mt-2">
          No scrolls available for enchanting yet.
        </div>
      )}
    </div>
  );
}
