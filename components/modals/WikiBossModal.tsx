import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSkull, FaTrophy, FaShieldAlt, FaHeart, FaCoins, FaStar, FaMapMarkerAlt, FaKey, FaClock, FaCrosshairs, FaExclamationTriangle, FaBolt, FaDumbbell, FaMagic, FaChevronDown } from "react-icons/fa";
import Image from "next/image";
import { getBossData, getAttackStyleName, getWeaknessName, ProcessedBossData } from "../../utils/bosses/bossData";

interface WikiBossModalProps {
  isOpen: boolean;
  onClose: () => void;
  bossName: string;
}

interface BossStats {
  hp?: string;
  xp?: string;
  location?: string;
  level?: string;
  keyRequired?: string;
  attackInterval?: string;
  attackStyle?: string;
  weakness?: string;
  maxHit?: string;
  attackLevel?: string;
  strengthLevel?: string;
  defenceLevel?: string;
  magicLevel?: string;
  archeryLevel?: string;
  meleeStrength?: string;
  meleeAccuracy?: string;
  meleeDefence?: string;
  archeryStrength?: string;
  archeryAccuracy?: string;
  archeryDefence?: string;
  magicStrength?: string;
  magicAccuracy?: string;
  magicDefence?: string;
}

interface BossDrop {
  item: string;
  quantity?: string;
  rarity?: string;
  dropRate?: string;
  conditions?: string;
  additionalInfo?: string[];
}

export function WikiBossModal({ isOpen, onClose, bossName }: WikiBossModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [bossStats, setBossStats] = useState<BossStats>({});
  const [bossDrops, setBossDrops] = useState<BossDrop[]>([]);
  const [bossData, setBossData] = useState<ProcessedBossData | null>(null);
  const [expandedDrops, setExpandedDrops] = useState<Set<number>>(new Set());

  // Helper function to parse rarity percentage
  const parseRarityPercentage = (rarity: string | undefined): number => {
    if (!rarity) return 0;
    const match = rarity.match(/(\d+(?:\.\d+)?)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // Helper function to check if drop should be collapsed by default
  const shouldCollapseDrop = (drop: BossDrop, index: number): boolean => {
    // Special handling for Mesines - show specific important drops
    if (bossName === 'Mesines') {
      const importantItems = ['Otherworldly ore', 'papaya seed', 'dragon fruit seed', 'papaya', 'dragon fruit'];
      return !importantItems.some(item => drop.item.toLowerCase().includes(item.toLowerCase()));
    }
    
    // Always show top 4 drops and page drops
    if (index < 4 || drop.item.toLowerCase().includes('page')) return false;
    // Hide all other drops by default
    return true;
  };

  // Toggle drop expansion
  const toggleDropExpansion = (index: number) => {
    const newExpanded = new Set(expandedDrops);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedDrops(newExpanded);
  };

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Load boss data from local JSON
  useEffect(() => {
    if (isOpen && bossName) {
      const data = getBossData(bossName);
      setBossData(data);

      if (data) {
        // Convert boss data to the expected BossStats format
        const stats: BossStats = {
          hp: data.health.toString(),
          attackInterval: data.attackInterval.toString(),
          attackStyle: getAttackStyleName(data.attackStyle),
          weakness: getWeaknessName(data.weakness),
          maxHit: data.maxHit.toString(),
          attackLevel: data.combatLevels.attack.toString(),
          strengthLevel: data.combatLevels.strength.toString(),
          defenceLevel: data.combatLevels.defence.toString(),
          magicLevel: data.combatLevels.magic.toString(),
          archeryLevel: data.combatLevels.archery.toString(),
          meleeStrength: data.bonuses.melee.strength.toString(),
          meleeAccuracy: data.bonuses.melee.accuracy.toString(),
          meleeDefence: data.bonuses.melee.defence.toString(),
          archeryStrength: data.bonuses.archery.strength.toString(),
          archeryAccuracy: data.bonuses.archery.accuracy.toString(),
          archeryDefence: data.bonuses.archery.defence.toString(),
          magicStrength: data.bonuses.magic.strength.toString(),
          magicAccuracy: data.bonuses.magic.accuracy.toString(),
          magicDefence: data.bonuses.magic.defence.toString(),
        };
        setBossStats(stats);

        // Process drops data
        const drops: BossDrop[] = data.drops.map((dropItem: any) => ({
          item: dropItem.item,
          quantity: dropItem.quantity,
          rarity: dropItem.chance,
          dropRate: dropItem.chance,
        }));
        setBossDrops(drops);
      } else {
        // Fallback to wiki parsing if boss not found in local data
        setBossStats({});
        setBossDrops([]);
      }
    }
  }, [isOpen, bossName]);

  // Helper function to get item name from ID
  function getItemName(itemId: number): string {
    // This is a simplified version - in a real implementation you'd have an item database
    // For now, just return the ID as a string
    return `Item ${itemId}`;
  }

  // Helper function to get item image path

  // Helper function to get item image path
  function getItemImagePath(itemName: string): string {
    const cleanName = itemName.toLowerCase().replace(/'/g, '').replace(/\s+/g, '_');
    
    // Special mappings for page pieces
    const pageMappings: Record<string, string> = {
      'godly_page': 'boss_page_piece_godly',
      'stone_page': 'boss_page_piece_stone',
      'mountain_page': 'boss_page_piece_mountain',
      'underworld_page': 'boss_page_piece_underworld',
      'mutated_page': 'boss_page_piece_mutated',
      'burning_page': 'boss_page_piece_burning',
      'fisherman\'s_lost_page': 'fishermans_lost_page',
      'lumberjack\'s_lost_page': 'lumberjacks_lost_page'
    };

    // Special mappings for fruits and seeds
    const fruitSeedMappings: Record<string, string> = {
      'dragon_fruit_seed': 'dragonfruit_seed',
      'dragon_fruit': 'dragonfruit'
    };

    // Special mappings for other items
    const otherMappings: Record<string, string> = {
      'rare_treasure_chest': 'rare_chest',
      'textile_manufacturing_techniques': 'textile_manufacturing_techniques',
      'sobeks_talisman': 'sobek_upgrade_item'
    };
    
    return `/gameimages/${otherMappings[cleanName] || fruitSeedMappings[cleanName] || pageMappings[cleanName] || cleanName}.png`;
  }

  if (!mounted) return null;

  if (!bossData) {
    return createPortal(
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div
          ref={modalRef}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-teal-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <FaSkull className="w-16 h-16 text-teal-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-teal-100 mb-2">Boss Not Found</h3>
          <p className="text-teal-300 text-sm mb-6">Unable to find data for boss: {bossName}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-100 rounded-lg font-medium transition-colors duration-200 border border-teal-500/30"
          >
            Close
          </button>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Boss-themed Header */}
        <div className="px-6 py-4 border-b-4 border-slate-700 flex justify-between items-center bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-teal-600/20 rounded-xl border border-teal-500/30">
              <FaSkull className="w-6 h-6 text-teal-400" />
            </div>
            {/* Boss Image */}
            <div className="flex-shrink-0">
              <Image
                src={`/gameimages/${bossData.name}.png`}
                alt={bossData.displayName}
                width={48}
                height={48}
                className="rounded-lg border-2 border-teal-500/50 shadow-lg"
                onError={(e) => {
                  // Hide image if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-teal-400 tracking-tight flex items-center gap-2">
                <FaTrophy className="w-4 h-4 text-teal-400" />
                {bossData.displayName}
              </h2>
              <p className="text-sm text-slate-300 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                Boss Encyclopedia
                <span className="text-teal-400">•</span>
                <span className="flex items-center gap-1">
                  <FaShieldAlt className="w-3 h-3" />
                  Combat Guide
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-teal-100 transition-all duration-200 p-2 rounded-xl hover:bg-teal-600/20 group border border-teal-500/20"
            aria-label="Close boss modal"
          >
            <FaTimes className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Boss Content */}
        <div className="wiki-content overflow-y-auto custom-scrollbar">
          {/* Responsive Layout: stats left, drops right on desktop */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Boss Statistics - Left on desktop, top on mobile */}
            <div className="lg:w-1/2 order-1 lg:order-1">
              {/* Boss Stats Summary */}
              {Object.keys(bossStats).length > 0 && (
                <div className="combat-section">
                  <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                    <FaStar className="w-4 h-4" />
                    Boss Statistics
                  </h3>
                  <div className="space-y-3">
                    {bossStats.hp && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaHeart className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-slate-300">Health</span>
                        </div>
                        <span className="text-teal-400 font-bold">{bossStats.hp}</span>
                      </div>
                    )}
                    {bossStats.xp && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaCoins className="w-4 h-4 text-teal-400" />
                          <span className="text-sm text-slate-300">XP</span>
                        </div>
                        <span className="text-teal-400 font-bold">{bossStats.xp}</span>
                      </div>
                    )}
                    {bossStats.location && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-slate-300">Location</span>
                        </div>
                        <span className="text-teal-400 font-bold">{bossStats.location}</span>
                      </div>
                    )}
                    {bossStats.keyRequired && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaKey className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-slate-300">Key Required</span>
                        </div>
                        <span className="text-teal-400 font-bold">{bossStats.keyRequired}</span>
                      </div>
                    )}
                    {bossStats.attackInterval && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaClock className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-slate-300">Attack Interval</span>
                        </div>
                        <span className="text-teal-400 font-bold">{bossStats.attackInterval}ms</span>
                      </div>
                    )}
                    {bossStats.attackStyle && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaCrosshairs className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-slate-300">Attack Style</span>
                        </div>
                        <span className="text-teal-400 font-bold text-sm">{bossStats.attackStyle}</span>
                      </div>
                    )}
                    {bossStats.weakness && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaExclamationTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-slate-300">Weakness</span>
                        </div>
                        <span className="text-teal-400 font-bold text-sm">{bossStats.weakness}</span>
                      </div>
                    )}
                    {bossStats.maxHit && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaBolt className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-slate-300">Max Hit</span>
                        </div>
                        <span className="text-teal-400 font-bold">{bossStats.maxHit}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Combat Levels */}
              <div className="combat-section">
                <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                  <FaTrophy className="w-4 h-4" />
                  Combat Levels
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {bossStats.attackLevel && (
                    <div className="flex items-center gap-2 p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <Image src="/skills/attack.png" alt="Attack" width={24} height={24} className="w-6 h-6 flex-shrink-0" />
                      <div className="text-center flex-1">
                        <span className="text-xs text-slate-400 uppercase tracking-wide block">Attack</span>
                        <span className="text-sm font-bold text-teal-400">{bossStats.attackLevel}</span>
                      </div>
                    </div>
                  )}
                  {bossStats.strengthLevel && (
                    <div className="flex items-center gap-2 p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <Image src="/skills/strength.png" alt="Strength" width={24} height={24} className="w-6 h-6 flex-shrink-0" />
                      <div className="text-center flex-1">
                        <span className="text-xs text-slate-400 uppercase tracking-wide block">Strength</span>
                        <span className="text-sm font-bold text-teal-400">{bossStats.strengthLevel}</span>
                      </div>
                    </div>
                  )}
                  {bossStats.defenceLevel && (
                    <div className="flex items-center gap-2 p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <Image src="/skills/defence.png" alt="Defence" width={24} height={24} className="w-6 h-6 flex-shrink-0" />
                      <div className="text-center flex-1">
                        <span className="text-xs text-slate-400 uppercase tracking-wide block">Defence</span>
                        <span className="text-sm font-bold text-teal-400">{bossStats.defenceLevel}</span>
                      </div>
                    </div>
                  )}
                  {bossStats.magicLevel && (
                    <div className="flex items-center gap-2 p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <Image src="/skills/magic.png" alt="Magic" width={24} height={24} className="w-6 h-6 flex-shrink-0" />
                      <div className="text-center flex-1">
                        <span className="text-xs text-slate-400 uppercase tracking-wide block">Magic</span>
                        <span className="text-sm font-bold text-teal-400">{bossStats.magicLevel}</span>
                      </div>
                    </div>
                  )}
                  {bossStats.archeryLevel && (
                    <div className="flex items-center gap-2 p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <Image src="/skills/archery.png" alt="Archery" width={24} height={24} className="w-6 h-6 flex-shrink-0" />
                      <div className="text-center flex-1">
                        <span className="text-xs text-slate-400 uppercase tracking-wide block">Archery</span>
                        <span className="text-sm font-bold text-teal-400">{bossStats.archeryLevel}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Combat Bonuses */}
              <div className="bonuses-section">
                <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                  <FaBolt className="w-4 h-4" />
                  Combat Bonuses
                </h3>
                <div className="space-y-4">
                  {/* Melee Bonuses */}
                  <div>
                    <h4 className="text-sm font-semibold text-teal-400 mb-2 flex items-center gap-2">
                      <Image src="/skills/attack.png" alt="Melee" width={16} height={16} className="w-4 h-4" />
                      Melee
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {bossStats.meleeStrength && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Strength</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.meleeStrength}</span>
                        </div>
                      )}
                      {bossStats.meleeAccuracy && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Accuracy</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.meleeAccuracy}</span>
                        </div>
                      )}
                      {bossStats.meleeDefence && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Defence</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.meleeDefence}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Archery Bonuses */}
                  <div>
                    <h4 className="text-sm font-semibold text-teal-400 mb-2 flex items-center gap-2">
                      <Image src="/skills/archery.png" alt="Archery" width={16} height={16} className="w-4 h-4" />
                      Archery
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {bossStats.archeryStrength && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Strength</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.archeryStrength}</span>
                        </div>
                      )}
                      {bossStats.archeryAccuracy && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Accuracy</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.archeryAccuracy}</span>
                        </div>
                      )}
                      {bossStats.archeryDefence && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Defence</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.archeryDefence}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Magic Bonuses */}
                  <div>
                    <h4 className="text-sm font-semibold text-teal-400 mb-2 flex items-center gap-2">
                      <Image src="/skills/magic.png" alt="Magic" width={16} height={16} className="w-4 h-4" />
                      Magic
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {bossStats.magicStrength && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Strength</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.magicStrength}</span>
                        </div>
                      )}
                      {bossStats.magicAccuracy && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Accuracy</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.magicAccuracy}</span>
                        </div>
                      )}
                      {bossStats.magicDefence && (
                        <div className="text-center p-2 bg-slate-700/40 rounded-lg border border-slate-600/30">
                          <span className="text-xs text-slate-400 uppercase tracking-wide block">Defence</span>
                          <span className="text-sm font-bold text-teal-400">{bossStats.magicDefence}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Boss Drops - Right on desktop, bottom on mobile */}
            <div className="lg:w-1/2 order-2 lg:order-2">
              {bossDrops.length > 0 && (
                <div className="drops-section">
                  <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                    <FaCoins className="w-4 h-4" />
                    Drops ({bossDrops.length})
                  </h3>
                  <div className="space-y-2">
                    {/* Special handling for Kronos and Sobek - show all drops */}
                    {bossName === 'Kronos' || bossName === 'Sobek' ? (
                      bossDrops.map((drop, index) => (
                        <div key={index} className="drop-item">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-600/20 rounded border border-slate-500/30 flex items-center justify-center flex-shrink-0">
                              <Image
                                src={getItemImagePath(drop.item)}
                                alt={drop.item}
                                width={32}
                                height={32}
                                className="rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <FaCoins className="w-4 h-4 text-teal-400 hidden" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="drop-name block truncate text-sm" title={drop.item}>
                                {drop.item}
                              </span>
                              {drop.quantity && (
                                <div className="drop-quantity text-xs">Qty: {drop.quantity}</div>
                              )}
                            </div>
                          </div>
                          <span className="drop-rarity flex-shrink-0 text-sm font-bold">{drop.rarity}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        {/* Top drops and page drops - always shown */}
                        {bossDrops
                          .map((drop, index) => ({ drop, index }))
                          .filter(({ drop, index }) => !shouldCollapseDrop(drop, index))
                          .map(({ drop, index }) => (
                        <div key={index} className="drop-item">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-600/20 rounded border border-slate-500/30 flex items-center justify-center flex-shrink-0">
                              <Image
                                src={getItemImagePath(drop.item)}
                                alt={drop.item}
                                width={32}
                                height={32}
                                className="rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).classList.add('image-error');
                                  (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                }}
                              />
                              <FaCoins className="w-4 h-4 text-teal-400 hidden" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <span className="drop-name block truncate text-sm" title={drop.item}>
                                {drop.item}
                              </span>
                              {drop.quantity && (
                                <div className="drop-quantity text-xs">Qty: {drop.quantity}</div>
                              )}
                            </div>
                          </div>
                          <span className="drop-rarity flex-shrink-0 text-sm font-bold">{drop.rarity}</span>
                        </div>
                      ))}

                    {/* Other drops toggle */}
                    {bossDrops.some((drop, index) => shouldCollapseDrop(drop, index)) && (
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            const otherIndices = bossDrops
                              .map((drop, index) => ({ drop, index }))
                              .filter(({ drop, index }) => shouldCollapseDrop(drop, index))
                              .map(({ index }) => index);
                            
                            if (otherIndices.every(index => expandedDrops.has(index))) {
                              // All expanded, collapse all
                              setExpandedDrops(new Set());
                            } else {
                              // Some collapsed, expand all
                              setExpandedDrops(new Set(otherIndices));
                            }
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-700/40 hover:bg-slate-700/60 rounded-lg border border-slate-600/30 transition-colors group"
                        >
                          <FaChevronDown 
                            className={`w-4 h-4 text-teal-400 transition-transform ${
                              bossDrops
                                .map((drop, index) => ({ drop, index }))
                                .filter(({ drop, index }) => shouldCollapseDrop(drop, index))
                                .every(({ index }) => expandedDrops.has(index)) 
                                ? 'rotate-180' : ''
                            }`} 
                          />
                          <span className="text-sm text-teal-400 font-medium">
                            {bossDrops
                              .map((drop, index) => ({ drop, index }))
                              .filter(({ drop, index }) => shouldCollapseDrop(drop, index))
                              .every(({ index }) => expandedDrops.has(index)) 
                              ? 'Hide Other Drops' : 'Show Other Drops'}
                            {' '}
                            ({bossDrops.filter((drop, index) => shouldCollapseDrop(drop, index)).length})
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Rare drops (≥3% rarity) - always shown */}
                    {/* Other drops - expandable */}
                    {bossDrops
                      .map((drop, index) => ({ drop, index }))
                      .filter(({ drop, index }) => shouldCollapseDrop(drop, index) && expandedDrops.has(index))
                      .length > 0 && (
                      <div className="mt-2 max-h-96 overflow-y-auto custom-scrollbar space-y-2">
                        {bossDrops
                          .map((drop, index) => ({ drop, index }))
                          .filter(({ drop, index }) => shouldCollapseDrop(drop, index) && expandedDrops.has(index))
                          .map(({ drop, index }) => (
                            <div key={index} className="drop-item">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-slate-600/20 rounded border border-slate-500/30 flex items-center justify-center flex-shrink-0">
                                  <Image
                                    src={getItemImagePath(drop.item)}
                                    alt={drop.item}
                                    width={32}
                                    height={32}
                                    className="rounded"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                      (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <FaCoins className="w-4 h-4 text-teal-400 hidden" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="drop-name block truncate text-sm" title={drop.item}>
                                    {drop.item}
                                  </span>
                                  {drop.quantity && (
                                    <div className="drop-quantity text-xs">Qty: {drop.quantity}</div>
                                  )}
                                </div>
                              </div>
                              <span className="drop-rarity flex-shrink-0 text-sm font-bold">{drop.rarity}</span>
                            </div>
                          ))}
                      </div>
                    )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 p-2 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent flex-1"></div>
              <span className="text-teal-400 text-sm font-medium px-4">Data Source</span>
              <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent flex-1"></div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FaSkull className="w-5 h-5 text-teal-400" />
              <span className="text-slate-300 text-sm">Data from</span>
              <a
                href="https://wiki.idleclans.com/index.php/Main_Page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 text-sm underline transition-colors"
              >
                Idle Clans Wiki
              </a>
              <FaShieldAlt className="w-5 h-5 text-teal-400" />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
