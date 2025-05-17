'use client';

import { useCalculator } from './CalculatorContext';
import { LEVEL_TO_XP } from '@/utils/gamedata/calculator-constants';
import { useState, useEffect } from 'react';

export default function CurrentXPCard() {
    const { state, setTargetLevel, setCurrentExp } = useCalculator();
    const { currentExp, targetLevel, playerSkillExperiences } = state;
    const [apiCurrentLevel, setApiCurrentLevel] = useState<number>(1);
    const [showCustomXpInput, setShowCustomXpInput] = useState(false);
    const [customXp, setCustomXp] = useState('');

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
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    };

    // Handle current level change
    const handleCurrentLevelChange = (newLevel: number) => {
        const newExp = LEVEL_TO_XP[newLevel] || 0;
        setCurrentExp(newExp);
    };

    // Handle custom XP input
    const handleCustomXpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const xp = parseInt(customXp.replace(/\s/g, '')) || 0;
        setCurrentExp(xp);
        setShowCustomXpInput(false);
        setCustomXp('');
    };

    // Handle setting current level and XP from API
    const handleSetCurrentFromApi = () => {
        const currentSkill = state.currentSkill;
        const apiXp = playerSkillExperiences[currentSkill] || 0;
        setCurrentExp(apiXp);
        setApiCurrentLevel(getCurrentLevel(apiXp));
    };

    return (
        <div className="bg-[#001010] rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                Current XP & Target Level
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label
                        htmlFor="currentLevel"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Current Level
                    </label>
                    <select
                        id="currentLevel"
                        value={currentLevel}
                        onChange={(e) =>
                            handleCurrentLevelChange(Number(e.target.value))
                        }
                        className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        <option value={apiCurrentLevel}>
                            Current Level - {apiCurrentLevel}
                        </option>
                        {Array.from({ length: 120 }, (_, i) => i + 1).map(
                            (level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            )
                        )}
                    </select>
                    <p className="mt-1 text-sm text-gray-400">
                        Current XP: {formatNumber(currentExp)}
                    </p>
                    <div className="mt-2 flex gap-2">
                        <button
                            onClick={handleSetCurrentFromApi}
                            className="px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                        >
                            Set Current Level & XP
                        </button>
                        <button
                            onClick={() =>
                                setShowCustomXpInput(!showCustomXpInput)
                            }
                            className="px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                        >
                            Set Custom XP
                        </button>
                    </div>
                    {showCustomXpInput && (
                        <form onSubmit={handleCustomXpSubmit} className="mt-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={customXp}
                                    onChange={(e) =>
                                        setCustomXp(e.target.value)
                                    }
                                    placeholder="Enter XP (e.g., 1 000 000)"
                                    className="flex-1 py-1 px-2 rounded-md bg-[#002020] border border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-1 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors"
                                >
                                    Set
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="targetLevel"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Target Level
                    </label>
                    <select
                        id="targetLevel"
                        value={targetLevel}
                        onChange={(e) => setTargetLevel(Number(e.target.value))}
                        className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {Array.from({ length: 120 }, (_, i) => i + 1).map(
                            (level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            )
                        )}
                        <option value={121}>True Master - 500M</option>
                    </select>
                </div>

                <div className="bg-[#002020] p-3 rounded-md flex flex-col justify-center">
                    <div className="text-sm text-gray-300 mb-1">
                        XP Required:
                    </div>
                    <div className="text-emerald-300 font-semibold">
                        {formatNumber(xpRequired)}
                    </div>
                    <div className="text-sm text-gray-300 mt-2 mb-1">
                        Clan XP Gained:
                    </div>
                    <div className="text-emerald-300 font-semibold">
                        {formatNumber(clanXpGained)}
                    </div>
                </div>
            </div>
        </div>
    );
}
