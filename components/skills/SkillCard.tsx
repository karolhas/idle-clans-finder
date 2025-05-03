import Image from 'next/image';
import { getXpForLevel } from '@/utils/common/calculations/xpCalculations';
import { useRef, useState, useEffect } from 'react';
import { 
  getSkillColor,
  getTrueMasteryColor,
  tailwindToHex,
  getSkillHexColor,
  getTrueMasteryHexColor
} from '@/utils/skills/calculations/skillColor';

// Constants
const MAX_LEVEL = 120;
const TRUE_MASTERY_XP = 500000000;
const STAR_COUNT = 40;

interface SkillCardProps {
  skillName: string;
  xp: number;
  level: number;
  color: string;
}

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  color?: string;
}

export function SkillCard({ skillName, xp, level, color }: SkillCardProps) {
  // Calculate XP details
  const nextLevelXp = getXpForLevel(level + 1);
  const xpToNextLevel = Math.max(0, nextLevelXp - xp);
  
  // Check skill status
  const isMaxLevel = level === MAX_LEVEL;
  const isTrueMastery = xp >= TRUE_MASTERY_XP;
  
  // For starry background effect
  const cardRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const animationRef = useRef<number | undefined>(undefined);

  // Visual style getters
  const getBorderStyle = () => {
    if (isTrueMastery) return { borderWidth: '3px', borderColor: getTrueMasteryHexColor(xp) };
    if (isMaxLevel) return { borderWidth: '3px', borderColor: getSkillHexColor(MAX_LEVEL) };
    return { borderWidth: '1px', borderColor: tailwindToHex(color) };
  };
  
  const getBackgroundGradient = () => {
    return isTrueMastery
      ? 'from-[#2a0505] via-[#3d0606] to-[#2a0505]'  // Red background for true mastery
      : 'from-[#261600] via-[#291b04] to-[#1a1006]';  // Orange background for level 120
  };
  
  const getShimmerColor = () => {
    return isTrueMastery ? 'to-red-500/10' : 'to-orange-500/10';
  };
  
  const getLevelTextColor = () => {
    if (isTrueMastery) return getTrueMasteryColor(xp);
    if (isMaxLevel) return getSkillColor(MAX_LEVEL);
    return color;  // Use the provided color which already includes "text-" prefix
  };

  // Generate stars for the background
  useEffect(() => {
    if (!isMaxLevel) return;
    
    const generatedStars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1.5,
      opacity: Math.random() * 0.25 + 0.35,
      speed: Math.random() * 0.05 + 0.01,
      // Special colored stars for true mastery
      color: isTrueMastery && Math.random() > 0.7
        ? `hsl(${Math.floor(Math.random() * 60)}, 100%, 75%)`  // Red hues for true mastery
        : undefined
    }));
    
    setStars(generatedStars);
  }, [isMaxLevel, isTrueMastery]);

  // Animate stars
  useEffect(() => {
    if (!isMaxLevel || stars.length === 0) return;
    
    let lastTime = 0;
    
    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      
      setStars(prevStars => 
        prevStars.map(star => ({
          ...star,
          x: (star.x + Math.sin(time * 0.0005 * star.speed) * 0.05 + 100) % 100,
          y: (star.y + Math.cos(time * 0.0005 * star.speed) * 0.05 + 100) % 100,
          opacity: star.opacity
        }))
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMaxLevel, stars.length]);

  return (
    <div 
      ref={cardRef}
      className="relative bg-[#002626] p-4 rounded-lg border hover:bg-[#003333] transition-colors overflow-hidden"
      style={{
        ...getBorderStyle(),
        ...(isTrueMastery ? { boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.5), 0 8px 10px -6px rgba(220, 38, 38, 0.3)' } : {})
      }}
    >
      {/* Starry background for maxed skills */}
      {isMaxLevel && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${getBackgroundGradient()} opacity-90`}></div>
          
          {/* Stars */}
          {stars.map((star, index) => (
            <div 
              key={index}
              className="absolute rounded-full"
              style={{
                left: `${star.x}%`,
                top: `${star.y}%`,
                width: `${star.size}px`,
                height: `${star.size}px`,
                backgroundColor: star.color || 'white',
                opacity: star.opacity,
                boxShadow: `0 0 ${star.size * 2}px ${star.size * 0.6}px ${
                  star.color 
                    ? star.color.replace(')', ', ' + (star.opacity * 0.6) + ')')
                    : 'rgba(255, 255, 220, ' + (star.opacity * 0.6) + ')'
                }`,
                zIndex: 5
              }}
            />
          ))}
          
          {/* Shimmer effect */}
          <div className={`absolute inset-0 bg-gradient-to-t from-transparent ${getShimmerColor()} z-4`}></div>
        </div>
      )}
      
      {/* Card content */}
      <div className="relative z-10">
        {/* Skill header */}
        <div className={`flex items-center ${isTrueMastery ? 'justify-center' : ''} gap-2 mb-1`}>
          <div className="relative w-5 h-5">
            <Image
              src={`/skills/${skillName}.png`}
              alt={`${skillName} icon`}
              fill
              sizes="20px"
              className="object-contain"
              style={isTrueMastery ? { 
                filter: 'drop-shadow(0 0 2px rgba(255,0,0,0.8))',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
              } : {}}
              loading="lazy"
            />
            {isTrueMastery && (
              <div 
                className="absolute -inset-1 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)',
                  animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              />
            )}
          </div>
          <p className="text-gray-300 text-sm">
            {skillName.charAt(0).toUpperCase() + skillName.slice(1)}
          </p>
        </div>
        
        {/* Level display with enhanced style for true mastery */}
        {isTrueMastery ? (
          <div className="relative text-center">
            <p 
              className="text-xl font-bold text-red-500 glow"
              style={{ textShadow: '0 0 5px #ff0000, 0 0 10px #ff0000' }}
            >
              True Master
            </p>
            <div 
              className="absolute left-0 bottom-0 w-full h-[1px]"
              style={{ 
                background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.7), transparent)',
                animation: 'shimmer 2s linear infinite'
              }}
            />
          </div>
        ) : (
          <p className={`text-xl font-bold ${getLevelTextColor()}`}>
            Level {level}
          </p>
        )}
        
        {/* XP display - only show for non-mastery skills */}
        {!isTrueMastery && (
          <p className="text-xs text-gray-400">
            {Math.floor(xp).toLocaleString()} XP
          </p>
        )}
        
        {/* Status messages */}
        {!isMaxLevel && !isTrueMastery && (
          <>
            <p className="text-xs text-gray-500">
              {Math.floor(xpToNextLevel).toLocaleString()} XP to level {level + 1}
            </p>
            
            {/* Progress bar to next level */}
            <div className="mt-1 relative h-1 w-full bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute h-full rounded-full"
                style={{ 
                  width: `${Math.min(100, ((xp - getXpForLevel(level)) / (nextLevelXp - getXpForLevel(level))) * 100)}%`,
                  backgroundColor: tailwindToHex(color)
                }}
              />
            </div>
          </>
        )}
        
        {isMaxLevel && !isTrueMastery && (
          <p className="text-xs text-orange-500 font-semibold">
            Maximum Level
          </p>
        )}
        
        {/* Enhanced True Mastery badge */}
        {isTrueMastery && (
          <div 
            className="mt-1 text-center" 
            style={{ 
              background: 'linear-gradient(to right, rgba(107,0,0,0.3), rgba(157,0,0,0.4), rgba(107,0,0,0.3))',
              borderRadius: '4px',
              padding: '3px 5px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated shine effect */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: '-150%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shine 2s linear infinite'
              }}
            />
            <style jsx>{`
              @keyframes shine {
                0% { left: -150%; }
                100% { left: 150%; }
              }
            `}</style>
            
            {/* Badge content */}
            <div className="flex items-center justify-center gap-1.5">
              <div 
                className="pulse h-2.5 w-2.5 rounded-full" 
                style={{ 
                  background: 'radial-gradient(circle, rgba(255,0,0,1) 0%, rgba(200,0,0,1) 90%)',
                  boxShadow: '0 0 5px 2px rgba(255,0,0,0.5)'
                }}
              />
              <p 
                className="text-xs font-bold tracking-wide"
                style={{
                  color: '#ff3333', 
                  textShadow: '0px 0px 3px rgba(255,0,0,0.5)',
                  letterSpacing: '0.5px'
                }}
              >
                500M XP MASTERY
              </p>
            </div>
          </div>
        )}
        
        {/* Progress to True Mastery */}
        {isMaxLevel && !isTrueMastery && (
          <div className="mt-1 relative h-1 w-full bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-red-500 rounded-full"
              style={{ width: `${Math.min(100, (xp / TRUE_MASTERY_XP) * 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
