'use client';

import Image from 'next/image';
import { getLevel, getXpForLevel } from '@/utils/common/calculations/xpCalculations';

interface ClanSkillDisplayProps {
    skills: {
        [skillName: string]: number;
    };
}

const normalizeSkillName = (name: string) => {
    if (name.toLowerCase() === 'rigour') return 'attack';
    return name.toLowerCase().replace(/\s+/g, '');
};

export default function ClanSkillDisplay({ skills }: ClanSkillDisplayProps) {
    const entries = Object.entries(skills);

    return (
        <div className="mt-8 bg-[#002020] p-6 rounded-lg border border-[#004444]">
            <h3 className="text-xl font-bold text-emerald-400 mb-4">
                Clan Skill Totals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {entries.map(([skill, xp]) => {
                    const name = skill === 'Rigour' ? 'Attack' : skill;
                    const normalized = normalizeSkillName(name);
                    const level = getLevel(xp);
                    const nextLevel = level + 1;
                    const nextLevelXp = getXpForLevel(nextLevel);
                    const prevLevelXp = getXpForLevel(level);
                    const currentXp = xp - prevLevelXp;
                    const xpToNext = nextLevelXp - prevLevelXp;
                    const percent = Math.min((currentXp / xpToNext) * 100, 100);

                    return (
                        <div
                            key={name}
                            className="bg-[#003333] p-4 rounded-lg border border-[#004444] flex flex-col items-center"
                        >
                            <Image
                                src={`/gameimages/${normalized}.png`}
                                alt={name}
                                width={40}
                                height={40}
                                className="mb-2"
                            />
                            <p className="text-white font-semibold text-sm mb-1">{name}</p>
                            <p className="text-emerald-300 text-sm mb-1">Level {level}</p>
                            <p className="text-gray-300 text-xs mb-1">
                                {Math.floor(xp).toLocaleString()} XP
                            </p>
                            <div className="w-full bg-[#001f1f] h-2 rounded-full overflow-hidden mb-1">
                                <div
                                    className="bg-emerald-500 h-full transition-all duration-300"
                                    style={{ width: `${percent}%` }}
                                />
                            </div>
                            <p className="text-gray-400 text-[11px]">
                                {Math.ceil(xpToNext - currentXp).toLocaleString()} to level {nextLevel}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
