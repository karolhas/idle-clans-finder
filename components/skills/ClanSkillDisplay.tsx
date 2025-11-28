"use client";

import Image from "next/image";
import {
  getLevel,
  getXpForLevel,
} from "@/utils/common/calculations/xpCalculations";

interface ClanSkillDisplayProps {
  skills: {
    [skillName: string]: number;
  };
}

const normalizeSkillName = (name: string) => {
  if (name.toLowerCase() === "rigour") return "attack";
  return name.toLowerCase().replace(/\s+/g, "");
};

export default function ClanSkillDisplay({ skills }: ClanSkillDisplayProps) {
  const entries = Object.entries(skills);
  const totalXp = entries.reduce((acc, [, xp]) => acc + xp, 0);

  return (
    <div className="mt-8 bg-white/5 p-6 md:p-8 rounded-2xl border-2 border-white/10 backdrop-blur-xl shadow-xl hover:border-teal-500/50 hover:shadow-teal-900/20 transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors">
          Clan Skill Totals
        </h3>
        <span className="text-xs font-mono text-gray-200 bg-emerald-900 px-2 py-1 rounded ml-auto md:ml-0">
          Total XP: {totalXp.toLocaleString()}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {entries.map(([skill, xp]) => {
          const name = skill === "Rigour" ? "Attack" : skill;
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
              className="bg-black/50 p-4 rounded-xl border border-white/5 flex flex-col items-center hover:bg-black/10 hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-900/10 transition-all duration-300 group/card"
            >
              <div className="relative w-10 h-10 mb-2 transform group-hover/card:scale-110 transition-transform duration-300">
                <Image
                  src={`/skills/${normalized}.png`}
                  alt={name}
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>
              <p className="text-white font-bold text-sm mb-1 group-hover/card:text-emerald-300 transition-colors">
                {name}
              </p>
              <p className="text-emerald-400 text-sm font-mono mb-1">
                Lvl {level}
              </p>
              <p className="text-gray-400 text-xs mb-2">
                {Math.floor(xp).toLocaleString()} XP
              </p>

              <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mb-1.5 border border-white/5">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-teal-400 h-full transition-all duration-500 relative"
                  style={{ width: `${percent}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>

              <p className="text-gray-500 text-[10px] font-medium">
                {Math.ceil(xpToNext - currentXp).toLocaleString()} to next
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
