"use client";

import { useEffect, useState } from "react";
import { CalculatorProvider, useCalculator } from "./CalculatorContext";
import GeneralBuffs from "./GeneralBuffs";
import GatheringBuffs from "./GatheringBuffs";
import SkillBoosts from "./SkillBoosts";
import SkillItems from "./SkillItems";
import CalculationResults from "./CalculationResults";
import CurrentXPCard from "./CurrentXPCard";
import { Player } from "@/types/player.types";
import Image from "next/image";
import { SkillType } from "@/types/calculator.types";
import React from "react";

// Non-combat skills for skill cards
const NON_COMBAT_SKILLS: SkillType[] = [
  "crafting",
  "mining",
  "smithing",
  "carpentry",
  "farming",
  "foraging",
  "cooking",
  "enchanting",
  "woodcutting",
  "agility",
  "fishing",
  "plundering",
  "brewing",
];

function SkillCards({
  onSelectSkill,
  selectedSkill,
}: {
  onSelectSkill: (skill: SkillType) => void;
  selectedSkill?: SkillType | null;
}): React.ReactElement {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-13 gap-3 mb-8">
      {NON_COMBAT_SKILLS.map((skill) => (
        <div
          key={skill}
          className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all duration-300 group relative overflow-hidden
                        ${
                          selectedSkill === skill
                            ? "bg-emerald-900/40 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                            : "bg-black/30 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg"
                        }
                    `}
          onClick={() => onSelectSkill(skill)}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative w-10 h-10 mb-2 transform group-hover:scale-110 transition-transform duration-300">
            <Image
              src={`/skills/${skill}.png`}
              alt={skill}
              fill
              sizes="40px"
              className="object-contain drop-shadow-md"
            />
          </div>
          <span
            className={`text-xs font-medium capitalize tracking-wide transition-colors ${
              selectedSkill === skill
                ? "text-emerald-300"
                : "text-gray-400 group-hover:text-white"
            }`}
          >
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
        selectedSkill={showCalculator ? state.currentSkill : null}
        onSelectSkill={(skill) => {
          setCurrentSkill(skill);
          setShowCalculator(true);
        }}
      />

      {/* Hide everything else until a skill is selected */}
      {showCalculator && (
        <div className="animate-fade-in">
          {/* Current XP & Target Level card */}
          <CurrentXPCard />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <div className="space-y-6">
              <GeneralBuffs />
              <GatheringBuffs />
              <SkillBoosts />
            </div>
            <div className="space-y-6">
              <SkillItems />
              <CalculationResults />
            </div>
          </div>
        </div>
      )}

      {/* Show a message if no skill is selected */}
      {!showCalculator && (
        <div className="bg-black/30 border border-emerald-500/20 rounded-2xl p-12 text-center backdrop-blur-sm mt-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-6">
            <div className="w-12 h-12 relative opacity-50">
              {/* Placeholder icon using existing skills or generic icon */}
              <Image
                src="/skills/woodcutting.png"
                alt="Select Skill"
                width={48}
                height={48}
                className="object-contain grayscale"
              />
            </div>
          </div>
          <h3 className="text-xl font-bold text-emerald-400 mb-3">
            Select a Skill
          </h3>
          <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
            Choose a skill from the list above to start calculating XP
            requirements, resource costs, and efficiency stats.
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
