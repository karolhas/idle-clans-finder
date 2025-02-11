//lib
import { getLevel } from "@/lib/xpUtils";

export const skillsUtils = (skills: Record<string, number>) => {
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

  const formattedSkills = skillOrder.map((skillName) => {
    const xp = skills[skillName] || 0;
    const level = getLevel(xp);
    const color = getSkillColor(level);
    return { skillName, xp, level, color };
  });

  return { formattedSkills };
};
