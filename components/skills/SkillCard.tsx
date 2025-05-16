import Image from 'next/image';
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { getXpForLevel } from '@/utils/common/calculations/xpCalculations';
import {
    getSkillColor,
    getTrueMasteryColor,
    tailwindToHex,
    getSkillHexColor,
    getTrueMasteryHexColor,
} from '@/utils/skills/calculations/skillColor';

// =======================================
// Constants
// =======================================
const MAX_LEVEL = 120;
const TRUE_MASTERY_XP = 500000000;
const STAR_COUNT = 15; // Reduced from 40 for better performance

// =======================================
// Device Detection
// =======================================
const isLowEndDevice = (() => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;
    
    // Check for device memory (not supported in all browsers)
    const hasLowMemory = 
        'deviceMemory' in navigator && 
        // @ts-ignore - deviceMemory is not in the standard navigator type
        navigator.deviceMemory < 4;
        
    // Check CPU cores
    const hasLowCPU = 
        'hardwareConcurrency' in navigator && 
        navigator.hardwareConcurrency <= 4;
        
    // Check for mobile devices which are more likely to be low-end
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
    
    return hasLowMemory || hasLowCPU || isMobile;
})();

// =======================================
// Types & Interfaces
// =======================================
interface SkillCardProps {
    skillName: string;
    xp: number;
    level: number;
    color: string;
    performanceMode?: boolean; // Optional prop to force performance mode
}

interface Star {
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    color?: string;
}

// =======================================
// Component
// =======================================
export const SkillCard = React.memo(function SkillCard({
    skillName,
    xp,
    level,
    color,
    performanceMode,
}: SkillCardProps) {
    // =======================================
    // State & Refs
    // =======================================
    const cardRef = useRef<HTMLDivElement>(null);
    const [stars, setStars] = useState<Star[]>([]);
    const animationRef = useRef<number | undefined>(undefined);
      // Performance flags
    const usePerformanceMode = performanceMode || isLowEndDevice;

    // =======================================
    // Calculations
    // =======================================
    // XP details
    const nextLevelXp = getXpForLevel(level + 1);
    const xpToNextLevel = Math.max(0, nextLevelXp - xp);

    // Skill status
    const isMaxLevel = level === MAX_LEVEL;
    const isTrueMastery = xp >= TRUE_MASTERY_XP;    
    
    // =======================================
    // Memoized Styles
    // =======================================
    const borderStyle = useMemo(() => {
        if (isTrueMastery) {
            return {
                borderWidth: '3px',
                borderColor: getTrueMasteryHexColor(xp),
            };
        }
        
        if (isMaxLevel) {
            return {
                borderWidth: '3px',
                borderColor: getSkillHexColor(MAX_LEVEL),
            };
        }
        
        return { 
            borderWidth: '1px', 
            borderColor: tailwindToHex(color) 
        };
    }, [isTrueMastery, isMaxLevel, xp, color]);

    const backgroundGradient = useMemo(() => {
        return isTrueMastery
            ? 'from-[#2a0505] via-[#3d0606] to-[#2a0505]' // Red background for true mastery
            : 'from-[#261600] via-[#291b04] to-[#1a1006]'; // Orange background for level 120
    }, [isTrueMastery]);

    const shimmerColor = useMemo(() => {
        return isTrueMastery ? 'to-red-500/10' : 'to-orange-500/10';
    }, [isTrueMastery]);

    const levelTextColor = useMemo(() => {
        if (isTrueMastery) return getTrueMasteryColor(xp);
        if (isMaxLevel) return getSkillColor(MAX_LEVEL);
        return color; // Use the provided color which already includes "text-" prefix
    }, [isTrueMastery, isMaxLevel, xp, color]);    
    
    // =======================================
    // Star Generation Effect
    // =======================================
    useEffect(() => {
        if (!isMaxLevel) return;

        // Remove all stars for low-end devices
        if (usePerformanceMode) {
            setStars([]);
            return;
        }
        
        // Only generate stars for high-end devices
        const generatedStars = Array.from({ length: STAR_COUNT }, () => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 1.5,
            opacity: Math.random() * 0.15 + 0.2,
            speed: Math.random() * 0.25 + 0.1,
            color: isTrueMastery && Math.random() > 0.7
                ? `hsl(${Math.floor(Math.random() * 60)}, 100%, 75%)`
                : undefined,
        }));

        setStars(generatedStars);
    }, [isMaxLevel, isTrueMastery, usePerformanceMode]);
    
    // =======================================
    // Star Animation Effect
    // =======================================
    useEffect(() => {
        if (!isMaxLevel || stars.length === 0 || usePerformanceMode) return;
          
        let lastTime = 0;
        const FRAME_INTERVAL = 20; // Consistent low frame interval for smooth animation

        const animate = (time: number) => {
            if (lastTime === 0) lastTime = time;
            const elapsed = time - lastTime;

            // Only update if enough time has passed (reduces CPU usage)
            if (elapsed > FRAME_INTERVAL) {
                lastTime = time;
                
                const timeScale = 0.0015;
                const movementScale = 0.3;
                
                setStars((prevStars) =>
                    prevStars.map((star) => ({
                        ...star,
                        x: (star.x + Math.sin(time * timeScale * star.speed) * movementScale + 100) % 100,
                        y: (star.y + Math.cos(time * timeScale * star.speed) * movementScale + 100) % 100,
                        opacity: star.opacity,
                    }))
                );
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isMaxLevel, stars.length, usePerformanceMode]);
    
    
    // =======================================
    // Render Component
    // =======================================
    return (
        <div
            ref={cardRef}
            className="relative bg-[#002626] p-4 rounded-lg border hover:bg-[#003333] transition-colors overflow-hidden"            style={{
                ...borderStyle,
                ...(isTrueMastery && !usePerformanceMode
                    ? {
                          boxShadow: '0 10px 25px -5px rgba(220, 38, 38, 0.5), 0 8px 10px -6px rgba(220, 38, 38, 0.3)',
                      }
                    : {}),
            }}
        >            {/* Background styles based on device capability */}
            {isMaxLevel && (
                <>
                    {/* High-end devices get the fancy starry background */}
                    {!usePerformanceMode && (
                        <div className="absolute inset-0 overflow-hidden">                            {/* Background gradient */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`}
                            />

                            {/* Stars */}
                            {stars.length > 0 && stars.map((star, index) => (
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
                                        boxShadow: `0 0 ${star.size}px ${star.color || 'white'}`,
                                        zIndex: 5,
                                    }}
                                />
                            ))}

                            {/* Shimmer effect */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-t from-transparent ${shimmerColor} z-4`}
                            />
                        </div>
                    )}
                      {/* Low-end devices get a simplified gradient background */}
                    {usePerformanceMode && (
                        <div className="absolute inset-0 overflow-hidden">
                            <div 
                                className={`absolute inset-0 bg-gradient-to-br ${backgroundGradient}`}
                            />
                        </div>
                    )}
                </>
            )}

            {/* Card content */}
            <div className="relative z-10">
                {/* Skill header */}
                <div
                    className={`flex items-center ${
                        isTrueMastery ? 'justify-center' : ''
                    } gap-2 mb-1`}
                >
                    <div className="relative w-5 h-5">
                        <Image
                            src={`/skills/${skillName}.png`}
                            alt={`${skillName} icon`}
                            fill
                            sizes="20px"
                            className="object-contain"
                            style={
                                isTrueMastery
                                    ? {
                                          filter: 'drop-shadow(0 0 2px rgba(255,0,0,0.8))',
                                          animation:
                                              'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                      }
                                    : {}
                            }
                            loading="lazy"
                        />
                        {isTrueMastery && (
                            <div
                                className="absolute -inset-1 rounded-full"
                                style={{
                                    background:
                                        'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)',
                                    animation:
                                        'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                }}
                            />
                        )}
                    </div>
                    <p className="text-gray-300 text-sm">
                        {skillName.charAt(0).toUpperCase() + skillName.slice(1)}
                    </p>
                </div>                {/* Level display with enhanced style for true mastery */}
                {isTrueMastery ? (
                    <div className="relative text-center">                        <p
                            className="text-xl font-bold text-red-500"
                            style={!usePerformanceMode ? { 
                                textShadow: '0 0 5px #ff0000, 0 0 10px #ff0000' 
                            } : {}}
                        >
                            True Master
                        </p>
                        {!usePerformanceMode && (
                            <div
                                className="absolute left-0 bottom-0 w-full h-[1px]"
                                style={{
                                    background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.7), transparent)',
                                    animation: 'shimmer 2s linear infinite',
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <p className={`text-xl font-bold ${levelTextColor}`}>
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
                            {Math.floor(xpToNextLevel).toLocaleString()} XP to
                            level {level + 1}
                        </p>

                        {/* Progress bar to next level */}
                        <div className="mt-1 relative h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="absolute h-full rounded-full"
                                style={{
                                    width: `${Math.min(
                                        100,
                                        ((xp - getXpForLevel(level)) /
                                            (nextLevelXp -
                                                getXpForLevel(level))) *
                                            100
                                    )}%`,
                                    backgroundColor: tailwindToHex(color),
                                }}
                            />
                        </div>
                    </>
                )}

                {isMaxLevel && !isTrueMastery && (
                    <p className="text-xs text-orange-500 font-semibold">
                        Maximum Level
                    </p>
                )}                {/* Enhanced True Mastery badge */}
                {isTrueMastery && (
                    <div
                        className="mt-1 text-center bg-red-900/30 rounded p-1"
                        style={{ padding: '3px 5px' }}
                    >
                        {/* Badge content - simplified for performance */}
                        <div className="flex items-center justify-center gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-600" />
                            <p className="text-xs font-bold tracking-wide text-red-500">
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
                            style={{
                                width: `${Math.min(100, (xp / TRUE_MASTERY_XP) * 100)}%`,
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
});
