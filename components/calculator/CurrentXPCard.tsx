'use client';

import { useCalculator } from './CalculatorContext';
import { LEVEL_TO_XP } from '@/utils/gamedata/calculator-constants';

export default function CurrentXPCard() {
    const { state, setTargetLevel } = useCalculator();
    const { currentExp, targetLevel } = state;

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
                    <div className="py-2 px-3 block w-full rounded-md bg-[#002020]  text-white">
                        {currentLevel}
                    </div>
                    <p className="mt-1 text-sm text-gray-400">
                        Current XP: {formatNumber(currentExp)}
                    </p>
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
