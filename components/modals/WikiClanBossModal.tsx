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
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

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

  // Enhanced styles for boss wiki content matching website theme
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .clan-boss-wiki-content {
        max-width: 100%;
        margin: 0;
        padding: 0.5rem;
        color: #e2e8f0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 0.875rem;
        line-height: 1.4;
        background: linear-gradient(135deg, #0a1616 0%, #1a2626 100%);
      }

      .clan-boss-wiki-content h1,
      .clan-boss-wiki-content h2,
      .clan-boss-wiki-content h3,
      .clan-boss-wiki-content h4 {
        color: #fbbf24;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }

      .clan-boss-wiki-content h1 {
        font-size: 1.5rem;
        text-align: center;
        margin-bottom: 1rem;
      }

      .clan-boss-wiki-content h2 {
        font-size: 1.25rem;
      }

      .clan-boss-wiki-content h3 {
        font-size: 1.125rem;
      }

      .clan-boss-wiki-content p {
        margin-bottom: 0.5rem;
      }

      .clan-boss-wiki-content .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .clan-boss-wiki-content .stat-item {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.375rem;
        padding: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .clan-boss-wiki-content .stat-label {
        font-weight: 500;
        color: #94a3b8;
      }

      .clan-boss-wiki-content .stat-value {
        font-weight: 600;
        color: #fbbf24;
      }

      .clan-boss-wiki-content .requirements-section {
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .clan-boss-wiki-content .requirements-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .clan-boss-wiki-content .requirement-item {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 0.375rem;
        padding: 0.5rem;
      }

      .clan-boss-wiki-content .requirement-label {
        font-weight: 500;
        color: #94a3b8;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
      }

      .clan-boss-wiki-content .requirement-value {
        font-weight: 600;
        color: #fbbf24;
      }

      .clan-boss-wiki-content .combat-section {
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .clan-boss-wiki-content .combat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 0.15rem;
      }

      .clan-boss-wiki-content .combat-item {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 0.25rem;
        padding: 0.1rem;
        text-align: center;
        min-height: auto;
      }

      .clan-boss-wiki-content .combat-label {
        font-size: 0.6rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.1rem;
      }

      .clan-boss-wiki-content .combat-value {
        font-weight: 600;
        color: #fbbf24;
        font-size: 0.7rem;
      }

      .clan-boss-wiki-content .bonuses-section {
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 1rem;
      }

      .clan-boss-wiki-content .bonuses-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 0.5rem;
      }

      .clan-boss-wiki-content .bonus-category {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 0.375rem;
        padding: 0.75rem;
      }

      .clan-boss-wiki-content .bonus-title {
        font-weight: 600;
        color: #fbbf24;
        margin-bottom: 0.5rem;
        text-align: center;
      }

      .clan-boss-wiki-content .bonus-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.25rem;
      }

      .clan-boss-wiki-content .bonus-label {
        font-size: 0.75rem;
        color: #94a3b8;
      }

      .clan-boss-wiki-content .bonus-value {
        font-weight: 600;
        color: #fbbf24;
      }

      .clan-boss-wiki-content .drops-section {
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 0.5rem;
        padding: 1rem;
      }

      .clan-boss-wiki-content .drop-item {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 0.375rem;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .clan-boss-wiki-content .drop-name {
        font-weight: 500;
        color: #e2e8f0;
      }

      .clan-boss-wiki-content .drop-quantity {
        font-size: 0.75rem;
        color: #94a3b8;
      }

      .clan-boss-wiki-content .drop-rarity {
        font-weight: 600;
        color: #fbbf24;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-lg shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-slate-900/95 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FaSkull className="w-6 h-6 text-amber-400" />
            {/* Boss Image */}
            {bossData && (
              <div className="flex-shrink-0">
                <Image
                  src={`/gameimages/${bossData.name}.png`}
                  alt={bossData.displayName}
                  width={40}
                  height={40}
                  className="rounded-lg border-2 border-amber-500/50 shadow-lg"
                  onError={(e) => {
                    // Hide image if it fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
            <h1 className="text-xl font-bold text-white">
              {bossData?.displayName || bossName} - Clan Boss
            </h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <FaTimes className="w-5 h-5 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 clan-boss-wiki-content">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - All Combat Information */}
            <div className="space-y-4">
              {/* Basic Stats */}
              <div className="combat-section">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
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
                      <span className="text-amber-100 font-bold">{bossStats.hp}</span>
                    </div>
                  )}
                  {bossStats.maxHit && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaBolt className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Max Hit</span>
                      </div>
                      <span className="text-amber-100 font-bold">{bossStats.maxHit}</span>
                    </div>
                  )}
                  {bossStats.attackStyle && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaCrosshairs className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-slate-300">Attack Style</span>
                      </div>
                      <span className="text-amber-100 font-bold text-sm">{bossStats.attackStyle}</span>
                    </div>
                  )}
                  {bossStats.weakness && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaExclamationTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-slate-300">Weakness</span>
                      </div>
                      <span className="text-amber-100 font-bold text-sm">{bossStats.weakness}</span>
                    </div>
                  )}
                  {bossStats.attackInterval && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaClock className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">Attack Interval</span>
                      </div>
                      <span className="text-amber-100 font-bold">{bossStats.attackInterval}ms</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Combat Levels */}
              <div className="combat-section">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <FaTrophy className="w-4 h-4" />
                  Combat Levels
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {bossStats.attackLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Attack</span>
                      <span className="text-lg font-bold text-amber-100">{bossStats.attackLevel}</span>
                    </div>
                  )}
                  {bossStats.strengthLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Strength</span>
                      <span className="text-lg font-bold text-amber-100">{bossStats.strengthLevel}</span>
                    </div>
                  )}
                  {bossStats.defenceLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Defence</span>
                      <span className="text-lg font-bold text-amber-100">{bossStats.defenceLevel}</span>
                    </div>
                  )}
                  {bossStats.magicLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Magic</span>
                      <span className="text-lg font-bold text-amber-100">{bossStats.magicLevel}</span>
                    </div>
                  )}
                  {bossStats.archeryLevel && (
                    <div className="text-center p-3 bg-slate-700/40 rounded-lg border border-slate-600/30">
                      <span className="text-xs text-slate-400 uppercase tracking-wide block">Archery</span>
                      <span className="text-lg font-bold text-amber-100">{bossStats.archeryLevel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Combat Bonuses */}
              <div className="bonuses-section">
                <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
                  <FaBolt className="w-4 h-4" />
                  Combat Bonuses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Melee Bonuses */}
                  <div className="bonus-category">
                    <div className="bonus-title">Melee</div>
                    <div className="space-y-2">
                      <div className="bonus-item">
                        <span className="bonus-label">Strength</span>
                        <span className="bonus-value">{bossStats.meleeStrength}</span>
                      </div>
                      <div className="bonus-item">
                        <span className="bonus-label">Accuracy</span>
                        <span className="bonus-value">{bossStats.meleeAccuracy}</span>
                      </div>
                      <div className="bonus-item">
                        <span className="bonus-label">Defence</span>
                        <span className="bonus-value">{bossStats.meleeDefence}</span>
                      </div>
                    </div>
                  </div>

                  {/* Archery Bonuses */}
                  <div className="bonus-category">
                    <div className="bonus-title">Archery</div>
                    <div className="space-y-2">
                      <div className="bonus-item">
                        <span className="bonus-label">Strength</span>
                        <span className="bonus-value">{bossStats.archeryStrength}</span>
                      </div>
                      <div className="bonus-item">
                        <span className="bonus-label">Accuracy</span>
                        <span className="bonus-value">{bossStats.archeryAccuracy}</span>
                      </div>
                      <div className="bonus-item">
                        <span className="bonus-label">Defence</span>
                        <span className="bonus-value">{bossStats.archeryDefence}</span>
                      </div>
                    </div>
                  </div>

                  {/* Magic Bonuses */}
                  <div className="bonus-category">
                    <div className="bonus-title">Magic</div>
                    <div className="space-y-2">
                      <div className="bonus-item">
                        <span className="bonus-label">Strength</span>
                        <span className="bonus-value">{bossStats.magicStrength}</span>
                      </div>
                      <div className="bonus-item">
                        <span className="bonus-label">Accuracy</span>
                        <span className="bonus-value">{bossStats.magicAccuracy}</span>
                      </div>
                      <div className="bonus-item">
                        <span className="bonus-label">Defence</span>
                        <span className="bonus-value">{bossStats.magicDefence}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clan Requirements */}
              {clanRequirements && (
                <div className="requirements-section">
                  <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
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
                  <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
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
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <FaCoins className="w-4 h-4 text-amber-400 hidden" />
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

        {/* Footer */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 w-full">
              <div className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent flex-1"></div>
              <span className="text-amber-400 text-sm font-medium px-4">Data Source</span>
              <div className="h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent flex-1"></div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FaSkull className="w-5 h-5 text-amber-400" />
              <span className="text-slate-300 text-sm">Data from</span>
              <a
                href="https://wiki.idleclans.com/index.php/Main_Page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 text-sm underline transition-colors"
              >
                Idle Clans Wiki
              </a>
              <FaShieldAlt className="w-5 h-5 text-amber-400" />
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}