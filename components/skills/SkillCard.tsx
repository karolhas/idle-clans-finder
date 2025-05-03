import Image from 'next/image';
import { getXpForLevel } from '@/utils/common/calculations/xpCalculations';

interface SkillCardProps {
    skillName: string;
    xp: number;
    level: number;
    color: string;
}

const animatedGradientStyle = {
    background: 'linear-gradient(-45deg, #2a2a2a, #6d28d9, #4338ca, rgb(2, 5, 48), #2a2a2a)',
    backgroundSize: '300% 300%',
    animation: 'gradient 8s linear infinite',
};

const keyframes = `
@keyframes gradient {
    0% {
        background-position: 0% 0%;
    }
    100% {
        background-position: 100% 100%;
    }
}`;

export function SkillCard({ skillName, xp, level, color }: SkillCardProps) {
    const nextLevelXp = getXpForLevel(level + 1);
    const xpToNextLevel = Math.max(0, nextLevelXp - xp);
    const isMaxLevel = level >= 120;
    const isMaxXp = xp >= 500000000;

    if (isMaxLevel || isMaxXp) {
        return (
            <>
                <style>{keyframes}</style>
                <div className="p-4 rounded-lg border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)] relative" style={animatedGradientStyle}>
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="relative w-8 h-8">
                            <Image
                                src={`/skills/${skillName}.png`}
                                alt={`${skillName} icon`}
                                fill
                                sizes="32px"
                                className="object-contain drop-shadow-lg"
                                loading="lazy"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-white font-bold text-lg drop-shadow-lg">
                                {isMaxXp ? 'Max XP' : 'Max Level'}
                            </p>
                            {isMaxLevel && !isMaxXp && (
                                <p className="text-white/90 text-xs mt-1">
                                    {Math.floor(500000000 - xp).toLocaleString()} XP to Max
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="bg-[#002626] p-4 rounded-lg border border-[#004444] hover:bg-[#003333] transition-colors relative">
            <div className="flex items-center gap-2 mb-1">
                <div className="relative w-5 h-5">
                    <Image
                        src={`/skills/${skillName}.png`}
                        alt={`${skillName} icon`}
                        fill
                        sizes="20px"
                        className="object-contain"
                        loading="lazy"
                    />
                </div>
                <p className="text-gray-300 text-sm">
                    {skillName.charAt(0).toUpperCase() + skillName.slice(1)}
                </p>
            </div>
            <p className={`text-xl font-bold ${color}`}>Level {level}</p>
            <p className="text-xs text-gray-400">
                {Math.floor(xp).toLocaleString()} XP
            </p>
            <p className="text-xs text-gray-500">
                {Math.floor(xpToNextLevel).toLocaleString()} XP to level{' '}
                {level + 1}
            </p>
        </div>
    );
}
