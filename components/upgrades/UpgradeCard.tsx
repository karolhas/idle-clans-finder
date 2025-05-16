import Image from "next/image";
import React, { useMemo } from 'react';

// Additional color mapping for upgrades
const UPGRADE_COLOR_MAP: Record<string, string> = {
  'text-red-500': '#ef4444',
  'text-purple-400': '#c084fc',
  'text-yellow-400': '#facc15', // Added yellow color
  'text-emerald-400': '#34d399', // Added emerald color
  'text-white': '#ffffff',
};

// Background gradients matching SkillCard
const RED_BACKGROUND_GRADIENT = 'from-[#2a0505] via-[#3d0606] to-[#2a0505]';    // Red gradient for max tier
const ORANGE_BACKGROUND_GRADIENT = 'from-[#261600] via-[#291b04] to-[#1a1006]'; // Orange gradient for high tier
const PURPLE_BACKGROUND_GRADIENT = 'from-[#1a0526] via-[#25073d] to-[#1a0526]'; // Purple gradient for tier 4
const YELLOW_BACKGROUND_GRADIENT = 'from-[#26230a] via-[#312b0d] to-[#26230a]'; // Yellow gradient for tier 3
const GREEN_BACKGROUND_GRADIENT = 'from-[#0a2613] via-[#0d3118] to-[#0a2613]';  // Green gradient for tier 2
const WHITE_BACKGROUND_GRADIENT = 'from-[#101a1a] via-[#152020] to-[#101a1a]';  // Subtle gradient for tier 1 and 0

// Convert Tailwind class names to hex color values for upgrades
const upgradeColorToHex = (tailwindClass: string): string => {
  return UPGRADE_COLOR_MAP[tailwindClass] || '#004444'; // Default color if not found
};

interface UpgradeCardProps {
  name: string;
  value: number;
  maxTier: number;
  getImagePath: (name: string) => string;
  formatUpgradeName: (name: string) => string;
}

export function UpgradeCard({
  name,
  value,
  maxTier,
  getImagePath,
  formatUpgradeName,
}: UpgradeCardProps) {  // Check upgrade status
  const isMaxTier = maxTier > 0 && value >= maxTier;
  const isHighTier = maxTier > 0 && value / maxTier >= 0.75; // 75% or higher is high tier
    
  // Color helpers
  const getUpgradeColor = (value: number, maxTier: number): string => {
    // Handle special cases where maxTier is 0
    if (maxTier === 0) return "text-white";
    
    const percentage = (value / maxTier) * 100;
    if (percentage === 100) return "text-red-500";
    if (percentage >= 75) return "text-purple-400";
    if (percentage >= 50) return "text-yellow-400";
    if (percentage >= 25) return "text-emerald-400";
    return "text-white";
  };

  const color = getUpgradeColor(value, maxTier);  // Background gradient only for max tier
  const backgroundGradient = useMemo(() => {
    if (isMaxTier) return RED_BACKGROUND_GRADIENT;
    
    // No background for non-max tier upgrades
    return '';
  }, [isMaxTier]);
  
  // Visual style getters
  const getBorderStyle = () => {
    if (isMaxTier)
      return {
        borderWidth: '3px',
        borderColor: '#ef4444', // Red for max tier
      };
    return { borderWidth: '1px', borderColor: upgradeColorToHex(color) };
  };
  return (
    <div
      className="relative bg-[#002626] p-4 rounded-lg border hover:bg-[#003333] transition-colors overflow-hidden"
      style={{
        ...getBorderStyle(),
        ...(isMaxTier
          ? {
              boxShadow:
                '0 10px 25px -5px rgba(220, 38, 38, 0.3), 0 8px 10px -6px rgba(220, 38, 38, 0.2)',
            }
          : {}),
      }}    >      {/* Background gradient only for max tier upgrades */}
      {backgroundGradient && (
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`}
          />
        </div>
      )}
      
      {/* Card content */}
      <div className="relative z-10">
        {/* Upgrade header */}
        <div className="flex items-center gap-2 mb-1">
          <div className="relative w-5 h-5">
            <Image
              src={getImagePath(name)}
              alt={`${name} icon`}
              fill
              sizes="20px"
              className="object-contain"
              style={
                isMaxTier
                  ? {
                      filter: 'drop-shadow(0 0 2px rgba(255,0,0,0.8))',
                    }
                  : {}
              }
              loading="lazy"
            />
            {isMaxTier && (
              <div
                className="absolute -inset-1 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0) 70%)',
                }}
              />
            )}
          </div>
          <p className="text-gray-300 text-sm">{formatUpgradeName(name)}</p>
        </div>

        {/* Tier display */}
        {isMaxTier ? (
          <p className="text-xl font-bold text-red-500">Max Tier</p>
        ) : (
          <p className={`text-xl font-bold ${color}`}>
            Tier {value}
          </p>
        )}        {/* Tier counter */}
        <p className="text-xs text-gray-400">{maxTier > 0 ? `${value}/${maxTier} tiers` : `Tier ${value}`}</p>{/* Progress bar for all tiers */}        <div className="mt-1 relative h-1 w-full bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute h-full rounded-full"
            style={{
              width: `${maxTier > 0 ? Math.min(100, (value / maxTier) * 100) : 0}%`,
              backgroundColor: isMaxTier ? '#ef4444' : upgradeColorToHex(color),
            }}
          />
        </div>
      </div>
    </div>
  );
}
