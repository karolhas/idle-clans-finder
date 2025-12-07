import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSkull, FaTrophy, FaShieldAlt, FaHeart, FaCoins, FaStar, FaMapMarkerAlt, FaKey, FaClock, FaCrosshairs, FaExclamationTriangle, FaBolt, FaDumbbell, FaMagic } from "react-icons/fa";
import Image from "next/image";
import { getClanBossData, getAttackStyleName, getWeaknessName, ProcessedBossData } from "../../utils/bosses/bossData";

interface WikiClanBossModalProps {
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

interface ClanRequirements {
  normal: Record<string, number>;
  ironman: Record<string, number>;
}

export function WikiClanBossModal({ isOpen, onClose, bossName }: WikiClanBossModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [bossStats, setBossStats] = useState<BossStats>({});
  const [bossDrops, setBossDrops] = useState<BossDrop[]>([]);
  const [clanRequirements, setClanRequirements] = useState<ClanRequirements | null>(null);
  const [bossData, setBossData] = useState<ProcessedBossData | null>(null);

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

  // Load clan boss data from local JSON
  useEffect(() => {
    if (isOpen && bossName) {
      const data = getClanBossData(bossName);
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

        // Process requirements data
        if (data.requirements) {
          setClanRequirements(data.requirements);
        }

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
        setClanRequirements(null);
      }
    }
  }, [isOpen, bossName]);

  // Helper function to get item name from ID
  function getItemName(itemId: number): string {
    // This is a simplified version - in a real implementation you'd have an item database
    // For now, just return the ID as a string
    return `Item ${itemId}`;
  }

  // Helper function to get item name from ID

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

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={modalRef}
        className="relative max-w-6xl w-full mx-4 max-h-[90vh] bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clan Boss-themed Header */}
        <div className="px-6 py-4 border-b-4 border-slate-700 flex justify-between items-center bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-teal-600/20 rounded-xl border border-teal-500/30">
              <FaSkull className="w-6 h-6 text-teal-400" />
            </div>
            {/* Boss Image */}
            {bossData && (
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
            )}
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-teal-400 tracking-tight flex items-center gap-2">
                <FaTrophy className="w-4 h-4 text-teal-400" />
                {bossData?.displayName || bossName} - Clan Boss
              </h2>
              <p className="text-sm text-slate-300 font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                Clan Boss Encyclopedia
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
            aria-label="Close clan boss modal"
          >
            <FaTimes className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="wiki-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - All Combat Information */}
            <div className="space-y-4">
              {/* Basic Stats */}
              <div className="combat-section">
                <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                  <FaShieldAlt className="w-4 h-4" />
                  Combat Stats
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
                  {bossStats.maxHit && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaBolt className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Max Hit</span>
                      </div>
                        <span className="text-teal-400 font-bold">{bossStats.maxHit}</span>
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
                  {bossStats.attackInterval && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaClock className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Attack Interval</span>
                      </div>
                        <span className="text-teal-400 font-bold">{bossStats.attackInterval}ms</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Combat Levels */}
              <div className="combat-section">
                <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                  <FaTrophy className="w-4 h-4" />
                  Combat Levels
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {bossStats.attackLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Attack</span>
                      <span className="text-lg font-bold text-teal-400">{bossStats.attackLevel}</span>
                    </div>
                  )}
                  {bossStats.strengthLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Strength</span>
                      <span className="text-lg font-bold text-teal-400">{bossStats.strengthLevel}</span>
                    </div>
                  )}
                  {bossStats.defenceLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Defence</span>
                      <span className="text-lg font-bold text-teal-400">{bossStats.defenceLevel}</span>
                    </div>
                  )}
                  {bossStats.magicLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Magic</span>
                      <span className="text-lg font-bold text-teal-400">{bossStats.magicLevel}</span>
                    </div>
                  )}
                  {bossStats.archeryLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Archery</span>
                      <span className="text-lg font-bold text-teal-400">{bossStats.archeryLevel}</span>
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
                      <FaDumbbell className="w-4 h-4" />
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
                      <FaCrosshairs className="w-4 h-4" />
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
                      <FaMagic className="w-4 h-4" />
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

              {/* Clan Requirements */}
              {clanRequirements && (
                <div className="requirements-section">
                  <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                    <FaExclamationTriangle className="w-4 h-4" />
                    Clan Requirements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="requirement-label mb-3 text-center font-semibold">Normal Mode</div>
                      <div className="space-y-2">
                        {Object.entries(clanRequirements.normal).map(([boss, count]) => (
                          <div key={boss} className="flex justify-between items-center py-1">
                            <span className="requirement-label text-sm">{boss.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="requirement-value text-sm font-bold">{count.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <div className="requirement-label mb-3 text-center font-semibold">Ironman Mode</div>
                      <div className="space-y-2">
                        {Object.entries(clanRequirements.ironman).map(([boss, count]) => (
                          <div key={boss} className="flex justify-between items-center py-1">
                            <span className="requirement-label text-sm">{boss.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="requirement-value text-sm font-bold">{count.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Drops */}
            <div className="space-y-6">
              {/* Boss Drops */}
              {bossDrops.length > 0 && (
                <div className="drops-section">
                  <h3 className="text-lg font-semibold text-teal-400 mb-4 flex items-center gap-2">
                    <FaCoins className="w-4 h-4" />
                    Drops ({bossDrops.length})
                  </h3>
                  <div className="space-y-2">
                    {bossDrops.map((drop, index) => (
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
                  </div>
                </div>
              )}
            </div>
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