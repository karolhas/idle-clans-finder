import { XP_TABLE } from "../constants/xpTable";


export function getLevel(experience: number): number {
  if (experience >= 500000000) return 120;

  let level = 120;
  while (level > 1 && experience < XP_TABLE[level]) {
    level--;
  }
  return level;
}


export function getXpForLevel(level: number): number {
  return XP_TABLE[level] ?? Infinity;
}
