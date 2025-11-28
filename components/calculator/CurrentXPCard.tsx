"use client";

import { useCalculator } from "./CalculatorContext";
import { LEVEL_TO_XP } from "@/utils/gamedata/calculator-constants";
import { useState, useEffect } from "react";

export default function CurrentXPCard() {
  const { state, setTargetLevel, setCurrentExp } = useCalculator();
  const { currentExp, targetLevel, playerSkillExperiences } = state;
  const [apiCurrentLevel, setApiCurrentLevel] = useState<number>(1);
  const [showCustomXpInput, setShowCustomXpInput] = useState(false);
  const [customXp, setCustomXp] = useState("");

  // Find current level based on XP
  const getCurrentLevel = (exp: number): number => {
    for (let level = 150; level >= 1; level--) {
      if (exp >= LEVEL_TO_XP[level]) {
        return level;
      }
    }
    return 1;
  };

  const currentLevel = getCurrentLevel(currentExp);

  // Store initial API values when component mounts
  useEffect(() => {
    setApiCurrentLevel(getCurrentLevel(currentExp));
  }, [currentExp]);

  // Calculate XP required
  const targetXp = LEVEL_TO_XP[targetLevel] || 0;
  const xpRequired = Math.max(0, targetXp - currentExp);

  // Calculate clan XP gained (this is a simplistic calculation - adjust as needed)
  const clanXpGained = xpRequired * 0.05; // 5% of XP goes to clan

  // Format number with spaces between thousands
  const formatNumber = (num: number): string => {
    return Math.floor(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Handle current level change
  const handleCurrentLevelChange = (newLevel: number) => {
    const newExp = LEVEL_TO_XP[newLevel] || 0;
    setCurrentExp(newExp);
  };

  // Handle custom XP input
  const handleCustomXpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const xp = parseInt(customXp.replace(/\s/g, "")) || 0;
    setCurrentExp(xp);
    setShowCustomXpInput(false);
    setCustomXp("");
  };

  // Handle setting current level and XP from API
  const handleSetCurrentFromApi = () => {
    const currentSkill = state.currentSkill;
    const apiXp = playerSkillExperiences[currentSkill] || 0;
    setCurrentExp(apiXp);
    setApiCurrentLevel(getCurrentLevel(apiXp));
  };

  return (
    <div className="bg-black/60 p-6 rounded-2xl border-2 border-white/10 relative backdrop-blur-md shadow-xl hover:border-teal-500/50 hover:shadow-teal-900/20 transition-all duration-300 group mb-6">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        Current XP & Target Level
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label
            htmlFor="currentLevel"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Current Level
          </label>
          <div className="space-y-3">
            <select
              id="currentLevel"
              value={currentLevel}
              onChange={(e) => handleCurrentLevelChange(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-black/90 border custom-scrollbar border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
            >
              <option value={apiCurrentLevel}>
                Current Level - {apiCurrentLevel}
              </option>
              {Array.from({ length: 120 }, (_, i) => i + 1).map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <p className="text-sm font-mono text-gray-500 flex justify-between">
              <span>Current XP:</span>
              <span className="text-gray-300">{formatNumber(currentExp)}</span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleSetCurrentFromApi}
                className="flex-1 px-3 py-2 text-xs font-medium bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 rounded-lg transition-colors"
              >
                Reset from Profile
              </button>
              <button
                onClick={() => setShowCustomXpInput(!showCustomXpInput)}
                className="flex-1 px-3 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-lg transition-colors"
              >
                Custom XP
              </button>
            </div>
            {showCustomXpInput && (
              <form onSubmit={handleCustomXpSubmit} className="animate-fade-in">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customXp}
                    onChange={(e) => setCustomXp(e.target.value)}
                    placeholder="1 000 000"
                    className="flex-1 px-3 py-2 text-sm bg-black/60 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-teal-500/50"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-sm bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors"
                  >
                    Set
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="targetLevel"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Target Level
          </label>
          <select
            id="targetLevel"
            value={targetLevel}
            onChange={(e) => setTargetLevel(Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-black/90 border custom-scrollbar border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
          >
            {Array.from({ length: 120 }, (_, i) => i + 1).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
            <option value={121}>True Master - 500M</option>
          </select>
        </div>

        <div className="bg-black/60 border border-white/5 p-4 rounded-xl flex flex-col justify-center gap-3">
          <div>
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
              XP Required
            </div>
            <div className="text-2xl font-bold text-teal-400 font-mono tracking-tight">
              {formatNumber(xpRequired)}
            </div>
          </div>
          <div className="h-px bg-white/5 w-full"></div>
          <div>
            <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">
              Clan XP Contribution
            </div>
            <div className="text-lg font-bold text-teal-500 font-mono tracking-tight">
              {formatNumber(clanXpGained)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
