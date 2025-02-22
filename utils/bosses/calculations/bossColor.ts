export const getBossColor = (kills: number): string => {
  if (kills >= 1000) return "text-red-500";
  if (kills >= 500) return "text-purple-400";
  if (kills >= 100) return "text-yellow-400";
  return "text-white";
};
