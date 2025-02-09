//hooks
import Image from "next/image";
//lib
import { getLevel } from "@/lib/xpUtils";

interface SkillDisplayProps {
  skills: { [key: string]: number };
}

const formatSkillName = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};

export default function SkillDisplay({ skills }: SkillDisplayProps) {
  const skillOrder = [
    "attack",
    "strength",
    "defence",
    "archery",
    "magic",
    "health",
    "crafting",
    "woodcutting",
    "carpentry",
    "fishing",
    "cooking",
    "mining",
    "smithing",
    "foraging",
    "farming",
    "agility",
    "plundering",
    "enchanting",
    "brewing",
    "exterminating",
  ];

  const getSkillColor = (level: number): string => {
    if (level >= 120) return "text-red-500";
    if (level >= 110) return "text-purple-400";
    if (level >= 99) return "text-yellow-400";
    if (level >= 90) return "text-emerald-400";
    return "text-white";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {skillOrder.map((skillName) => {
        const xp = skills[skillName] || 0;
        const level = getLevel(xp);
        const color = getSkillColor(level);

        return (
          <div
            key={skillName}
            className="bg-[#002626] p-4 rounded-lg border border-[#004444] hover:bg-[#003333] transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="relative w-5 h-5">
                <Image
                  src={`/skills/${skillName}.png`}
                  alt={`${skillName} icon`}
                  fill
                  sizes="20px"
                  className="object-contain"
                  priority
                />
              </div>
              <p className="text-gray-300 text-sm">
                {formatSkillName(skillName)}
              </p>
            </div>
            <p className={`text-2xl font-bold ${color}`}>Level {level}</p>
            <p className="text-xs text-gray-400">
              {Math.floor(xp).toLocaleString()} XP
            </p>
          </div>
        );
      })}
    </div>
  );
}
