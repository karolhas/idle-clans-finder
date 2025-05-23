'use client';

import { useEffect, useState } from 'react';
import { CalculatorProvider, useCalculator } from './CalculatorContext';
import GeneralBuffs from './GeneralBuffs';
import GatheringBuffs from './GatheringBuffs';
import SkillBoosts from './SkillBoosts';
import SkillItems from './SkillItems';
import CalculationResults from './CalculationResults';
import CurrentXPCard from './CurrentXPCard';
import { Player } from '@/types/player.types';
import Image from 'next/image';
import { SkillType } from '@/types/calculator.types';
import React from 'react';

// Non-combat skills for skill cards
const NON_COMBAT_SKILLS: SkillType[] = [
    'crafting',
    'mining',
    'smithing',
    'carpentry',
    'farming',
    'foraging',
    'cooking',
    'enchanting',
    'woodcutting',
    'agility',
    'fishing',
    'plundering',
    'brewing',
];

function SkillCards({
    onSelectSkill,
}: {
    onSelectSkill: (skill: SkillType) => void;
}): React.ReactElement {
    return (
        <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-13 gap-2 mb-4">
            {NON_COMBAT_SKILLS.map((skill) => (
                <div
                    key={skill}
                    className="flex flex-col items-center p-2 bg-[#001010] rounded-md cursor-pointer hover:bg-[#004040] transition-colors"
                    onClick={() => onSelectSkill(skill)}
                >
                    <div className="relative w-8 h-8">
                        <Image
                            src={`/skills/${skill}.png`}
                            alt={skill}
                            fill
                            sizes="32px"
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xs text-gray-300 mt-1 capitalize">
                        {skill}
                    </span>
                </div>
            ))}
        </div>
    );
}

function CalculatorContent({
    playerData,
}: {
    playerData: Player;
}): React.ReactElement {
    const { state, loadPlayerData, setTargetLevel, setCurrentSkill } =
        useCalculator();

    // State to control visible section
    const [showCalculator, setShowCalculator] = useState(false);

    // Reset calculator visibility and load player data when player changes
    useEffect(() => {
        loadPlayerData(playerData);
        setShowCalculator(false); // Hide calculator when new player is loaded
    }, [playerData]);

    // Ensure target level is set to 120 by default when component mounts
    useEffect(() => {
        // Only set it once when the component mounts
        if (state.targetLevel !== 120) {
            setTargetLevel(120);
        }
    }, []); // Empty dependency array to run only on mount

    return (
        <div>
            {/* Skill Cards Section - Always visible */}
            <SkillCards
                onSelectSkill={(skill) => {
                    setCurrentSkill(skill);
                    setShowCalculator(true);
                }}
            />

            {/* Hide everything else until a skill is selected */}
            {showCalculator && (
                <>
                    {/* Current XP & Target Level card */}
                    <CurrentXPCard />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <GeneralBuffs />
                            <GatheringBuffs />
                            <SkillBoosts />
                        </div>
                        <div>
                            <SkillItems />
                            <CalculationResults />
                        </div>
                    </div>
                </>
            )}

            {/* Show a message if no skill is selected */}
            {!showCalculator && (
                <div className="bg-[#001010] rounded-lg p-8 text-center mb-4">
                    <p className="text-gray-300 text-lg">
                        Select a skill above to begin calculating
                    </p>
                </div>
            )}
        </div>
    );
}

export default function Calculator({
    playerData,
}: {
    playerData: Player;
}): React.ReactElement {
    return (
        <CalculatorProvider>
            <CalculatorContent playerData={playerData} />
        </CalculatorProvider>
    );
}
