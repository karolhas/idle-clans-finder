export const getBossColor = (kills: number): string => {
  if (kills >= 2500) return "text-red-500";     // Red - Elite mastery
  if (kills >= 500) return "text-orange-500";   // Orange - Max level equivalent
  if (kills >= 200) return "text-purple-400";   // Purple - Master level
  if (kills >= 100) return "text-blue-400";    // Blue - Expert territory
  if (kills >= 50) return "text-green-400";     // Green - Advanced progression
  if (kills >= 1) return "text-white";          // White - Basic levels (1-49)
  return "text-gray-400";                       // Gray - Inactive
};
