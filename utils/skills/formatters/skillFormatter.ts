//utils
import { getLevel } from "@/utils/common/calculations/xpCalculations";
import { SKILL_ORDER } from "../constants/skillOrder";
import { getSkillColor } from "../calculations/skillColor";

export const formatSkills = (skills: Record<string, number>) => {
  return SKILL_ORDER.map((skillName) => {
    const xp = skills[skillName] || 0;
    const level = getLevel(xp);
    const color = getSkillColor(level);
    return { skillName, xp, level, color };
  });
};
