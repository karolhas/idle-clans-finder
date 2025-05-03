// Tailwind class name getters
export const getSkillColor = (level: number): string => {
  if (level >= 120) return "text-orange-500";  // Level 120 - Orange
  if (level >= 110) return "text-purple-400";  // Level 110-119 - Purple
  if (level >= 100) return "text-blue-400";    // Level 100-109 - Blue
  if (level >= 90) return "text-green-400";    // Level 90-99 - Green
  return "text-white";                         // Level 1-89 - White
};

export const getTrueMasteryColor = (xp: number): string => {
  return xp >= 500000000 ? "text-red-500" : "";
};

// Color mapping between Tailwind class names and hex values
const COLOR_MAP: Record<string, string> = {
  'text-orange-500': '#f97316', // Level 120
  'text-purple-400': '#c084fc', // Level 110-119
  'text-blue-400': '#60a5fa',   // Level 100-109
  'text-green-400': '#4ade80',  // Level 90-99
  'text-white': '#ffffff',      // Level 1-89
  'text-red-500': '#ef4444',    // True mastery
};

// Convert Tailwind class names to hex color values
export const tailwindToHex = (tailwindClass: string): string => {
  return COLOR_MAP[tailwindClass] || '#004444'; // Default color if not found
};

// Hex color value getters (convenience functions)
export const getSkillHexColor = (level: number): string => {
  return tailwindToHex(getSkillColor(level));
};

export const getTrueMasteryHexColor = (xp: number): string => {
  return xp >= 500000000 ? '#ef4444' : '#004444';
};
