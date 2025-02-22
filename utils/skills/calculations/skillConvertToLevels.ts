import { getLevel } from "@/utils/common/calculations/xpCalculations";

export function convertSkillsToLevels(skillExperiences: {
  [key: string]: number;
}) {
  const levels: { [key: string]: number } = {};
  for (const [skill, xp] of Object.entries(skillExperiences)) {
    levels[skill] = getLevel(xp);
  }
  return levels;
}
