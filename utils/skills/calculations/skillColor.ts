export const getSkillColor = (level: number): string => {
  if (level >= 120) return "text-red-500";
  if (level >= 110) return "text-purple-400";
  if (level >= 99) return "text-yellow-400";
  if (level >= 90) return "text-emerald-400";
  return "text-white";
};
