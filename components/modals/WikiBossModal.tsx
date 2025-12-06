import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSkull, FaTrophy, FaShieldAlt, FaHeart, FaCoins, FaStar, FaMapMarkerAlt, FaKey, FaClock, FaCrosshairs, FaExclamationTriangle, FaBolt, FaDumbbell, FaMagic } from "react-icons/fa";
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

  // Enhanced styles for boss wiki content matching website theme
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .boss-wiki-content {
        max-width: 100%;
        margin: 0;
        padding: 0.5rem;
        color: #e2e8f0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 0.875rem;
        line-height: 1.4;
        background: linear-gradient(135deg, #0a1616 0%, #1a2626 100%);
      }

      .boss-wiki-content h1,
      .boss-wiki-content h2,
      .boss-wiki-content h3,
      .boss-wiki-content h4,
      .boss-wiki-content h5,
      .boss-wiki-content h6 {
        margin: 0.5rem 0 0.25rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #a7f3d0;
      }

      .boss-wiki-content p {
        margin: 0.25rem 0;
      }

      .boss-wiki-content ul,
      .boss-wiki-content ol {
        margin: 0.25rem 0;
        padding-left: 1rem;
      }

      .boss-wiki-content li {
        margin: 0.125rem 0;
      }

      /* Boss-themed table styles */
      .boss-wiki-content table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 0.5rem 0;
        background: linear-gradient(135deg, #0f2626 0%, #1f3636 100%);
        border-radius: 0.5rem;
        overflow: hidden;
        border: 1px solid #14b8a6;
        box-shadow: 0 4px 16px rgba(20, 184, 166, 0.15);
        font-size: 0.8rem;
      }

      /* Boss stats table specific styling */
      .boss-wiki-content table:first-of-type {
        max-width: 100%;
        margin: 0 auto 1rem auto;
        background: linear-gradient(135deg, #0d4a4a 0%, #0f766e 100%);
        border: 2px solid #14b8a6;
        box-shadow: 0 6px 20px rgba(20, 184, 166, 0.2);
      }

      .boss-wiki-content table:first-of-type th,
      .boss-wiki-content table:first-of-type td {
        text-align: center;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid #14b8a6;
      }

      .boss-wiki-content table:first-of-type th {
        background: linear-gradient(135deg, #042f2e 0%, #0d4a4a 100%);
        font-weight: 600;
        color: #a7f3d0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.75rem;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
      }

      /* Icon images in stats table */
      .boss-wiki-content table:first-of-type td img {
        max-width: 16px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 3px;
      }

      /* Fix for large images in other tables (like upgrade costs) */
      .boss-wiki-content table:not(:first-of-type) img {
        max-width: 16px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 auto;
      }

      /* Regular table cells */
      .boss-wiki-content th,
      .boss-wiki-content td {
        padding: 0.375rem 0.5rem;
        border-bottom: 1px solid #0d4a4a;
        color: #a7f3d0;
        font-size: 0.8rem;
      }

      .boss-wiki-content th {
        background: linear-gradient(135deg, rgba(13, 74, 74, 0.8) 0%, rgba(15, 118, 110, 0.8) 100%);
        font-weight: 600;
        color: #a7f3d0;
        text-align: left;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.75rem;
      }

      .boss-wiki-content tr:last-child th,
      .boss-wiki-content tr:last-child td {
        border-bottom: none;
      }

      .boss-wiki-content tr:nth-child(even):not(:first-of-type tr) {
        background: rgba(13, 74, 74, 0.2);
      }

      /* Boss-themed typography */
      .boss-wiki-content h1, .boss-wiki-content h2, .boss-wiki-content h3 {
        color: #a7f3d0;
        margin: 0.75rem 0 0.25rem 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .boss-wiki-content p {
        margin: 0.25rem 0;
        line-height: 1.4;
      }

      .boss-wiki-content li {
        margin: 0.125rem 0;
        line-height: 1.3;
        position: relative;
      }

      .boss-wiki-content li::marker {
        color: #14b8a6;
      }

      /* Boss-themed links */
      .boss-wiki-content a {
        color: #34d399;
        text-decoration: none;
        font-weight: 500;
        transition: all 0.15s ease;
        border-bottom: 1px solid transparent;
      }

      .boss-wiki-content a:hover {
        color: #a7f3d0;
        border-bottom-color: #14b8a6;
        text-shadow: 0 0 4px rgba(20, 184, 166, 0.4);
      }

      /* Special boss sections */
      .boss-wiki-content .strategy-section {
        background: linear-gradient(135deg, rgba(13, 74, 74, 0.15) 0%, rgba(15, 118, 110, 0.15) 100%);
        border: 1px solid #0d4a4a;
        border-radius: 0.5rem;
        padding: 0.75rem;
        margin: 0.5rem 0;
        box-shadow: inset 0 1px 4px rgba(0,0,0,0.2);
      }

      .boss-wiki-content .loot-section {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.08) 100%);
        border: 1px solid #16a34a;
        border-radius: 0.5rem;
        padding: 0.75rem;
        margin: 0.5rem 0;
      }

      .boss-wiki-content .warning-section {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.08) 100%);
        border: 1px solid #d97706;
        border-radius: 0.5rem;
        padding: 0.75rem;
        margin: 0.5rem 0;
      }

      /* Inline images styling */
      .boss-wiki-content p:not(.boss-wiki-content table:first-of-type th p) img {
        max-width: 16px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 2px;
      }

      /* General boss portrait and large images */
      .boss-wiki-content img {
        max-width: 120px;
        height: auto;
        display: block;
        margin: 0.5rem auto;
        border-radius: 6px;
        border: 1px solid #0d4a4a;
      }

      /* Icon images in stats table */
      .boss-wiki-content table:first-of-type td img {
        max-width: 24px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 6px;
      }

      /* Fix for large images in other tables (like upgrade costs) */
      .boss-wiki-content table:not(:first-of-type) img {
        max-width: 24px;
        height: auto;
        vertical-align: middle;
        display: inline-block;
        margin: 0 auto;
      }

      /* Regular table cells */
      .boss-wiki-content th,
      .boss-wiki-content td {
        padding: 1rem 1.25rem;
        border-bottom: 1px solid #0d4a4a;
        color: #a7f3d0;
        font-size: 0.95rem;
      }

      .boss-wiki-content th {
        background: linear-gradient(135deg, #042f2e 0%, #0d4a4a 100%);
        font-weight: 600;
        color: #a7f3d0;
        text-align: left;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.85rem;
      }

      .boss-wiki-content tr:last-child th,
      .boss-wiki-content tr:last-child td {
        border-bottom: none;
      }

      .boss-wiki-content tr:nth-child(even):not(:first-of-type tr) {
        background: rgba(13, 74, 74, 0.3);
      }

      /* Boss-themed typography */
      .boss-wiki-content h1, .boss-wiki-content h2, .boss-wiki-content h3 {
        color: #a7f3d0;
        margin: 2.5rem 0 1.5rem 0;
        font-weight: 800;
        letter-spacing: -0.025em;
        text-shadow: 0 2px 8px rgba(20, 184, 166, 0.4);
      }

      .boss-wiki-content h1 {
        font-size: 2rem;
        text-align: center;
        background: linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 50%, #a7f3d0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 1rem;
      }

      .boss-wiki-content h2 {
        font-size: 1.5rem;
        border-bottom: 3px solid #14b8a6;
        padding-bottom: 0.75rem;
        margin-top: 2.5rem;
      }

      .boss-wiki-content h3 {
        font-size: 1.25rem;
        color: #34d399;
        margin-top: 2rem;
      }

      .boss-wiki-content p {
        color: #e4e4e7;
        line-height: 1.8;
        margin: 1.25rem 0;
        font-size: 1.05rem;
        text-shadow: 0 1px 2px rgba(0,0,0,0.3);
      }

      .boss-wiki-content strong {
        color: #a7f3d0;
        font-weight: 700;
      }

      /* Boss-themed lists */
      .boss-wiki-content ul, .boss-wiki-content ol {
        color: #e4e4e7;
        margin: 1.5rem 0;
        padding-left: 2.5rem;
      }

      .boss-wiki-content li {
        margin: 0.75rem 0;
        line-height: 1.7;
        position: relative;
      }

      .boss-wiki-content li::marker {
        color: #14b8a6;
      }

      /* Boss-themed links */
      .boss-wiki-content a {
        color: #34d399;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.2s ease;
        border-bottom: 1px solid transparent;
      }

      .boss-wiki-content a:hover {
        color: #a7f3d0;
        border-bottom-color: #14b8a6;
        text-shadow: 0 0 8px rgba(20, 184, 166, 0.6);
      }

      /* Special boss sections */
      .boss-wiki-content .strategy-section {
        background: linear-gradient(135deg, rgba(13, 74, 74, 0.2) 0%, rgba(15, 118, 110, 0.2) 100%);
        border: 2px solid #0d4a4a;
        border-radius: 1rem;
        padding: 1.5rem;
        margin: 1.5rem 0;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
      }

      .boss-wiki-content .loot-section {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%);
        border: 2px solid #16a34a;
        border-radius: 1rem;
        padding: 1.5rem;
        margin: 1.5rem 0;
      }

      .boss-wiki-content .warning-section {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
        border: 2px solid #d97706;
        border-radius: 1rem;
        padding: 1.5rem;
        margin: 1.5rem 0;
      }

      /* Custom scrollbar for boss modal */
      .boss-modal-scroll::-webkit-scrollbar {
        width: 8px;
      }

      .boss-modal-scroll::-webkit-scrollbar-track {
        background: #0f2626;
        border-radius: 4px;
      }

      .boss-modal-scroll::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #0d4a4a 0%, #14b8a6 100%);
        border-radius: 4px;
        border: 1px solid #042f2e;
      }

      .boss-modal-scroll::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%);
      }
    `;

    if (isOpen) {
      document.head.appendChild(style);
    }

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [isOpen]);

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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          ref={modalRef}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-teal-500/20"
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
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-teal-600"
      >
        {/* Boss-themed Header */}
        <div className="px-6 py-4 border-b-4 border-teal-600 flex justify-between items-center bg-gradient-to-r from-teal-900/80 to-teal-800/80 backdrop-blur sticky top-0 z-10">
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
              <h2 className="text-xl font-bold text-teal-100 tracking-tight flex items-center gap-2">
                <FaTrophy className="w-4 h-4 text-yellow-400" />
                {bossData.displayName}
              </h2>
              <p className="text-sm text-teal-300 font-medium flex items-center gap-2">
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
            className="text-teal-300 hover:text-teal-100 transition-all duration-200 p-2 rounded-xl hover:bg-teal-600/20 group border border-teal-500/20"
            aria-label="Close boss modal"
          >
            <FaTimes className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Boss Content */}
        <div className="overflow-y-auto boss-modal-scroll">
          {/* Responsive Layout: stats left, drops right on desktop */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Boss Statistics - Left on desktop, top on mobile */}
            <div className="lg:w-1/2 order-1 lg:order-1">
              {/* Boss Stats Summary */}
              {Object.keys(bossStats).length > 0 && (
                <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20 flex-shrink-0 mb-6">
                  <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    Boss Statistics
                  </h3>
                  <div className="space-y-3">
                    {bossStats.hp && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaHeart className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-teal-300">HP</span>
                        </div>
                        <span className="text-teal-100 font-bold">{bossStats.hp}</span>
                      </div>
                    )}
                    {bossStats.xp && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaTrophy className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm text-teal-300">XP</span>
                        </div>
                        <span className="text-teal-100 font-bold">{bossStats.xp}</span>
                      </div>
                    )}
                    {bossStats.location && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaMapMarkerAlt className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-teal-300">Location</span>
                        </div>
                        <span className="text-teal-100 font-bold text-sm">{bossStats.location}</span>
                      </div>
                    )}
                    {bossStats.keyRequired && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaKey className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-teal-300">Key Required</span>
                        </div>
                        <span className="text-teal-100 font-bold text-sm">{bossStats.keyRequired}</span>
                      </div>
                    )}
                    {bossStats.attackInterval && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaClock className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-teal-300">Attack Interval</span>
                        </div>
                        <span className="text-teal-100 font-bold">{bossStats.attackInterval}</span>
                      </div>
                    )}
                    {bossStats.attackStyle && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaCrosshairs className="w-4 h-4 text-orange-400" />
                          <span className="text-sm text-teal-300">Attack Style</span>
                        </div>
                        <span className="text-teal-100 font-bold text-sm">{bossStats.attackStyle}</span>
                      </div>
                    )}
                    {bossStats.weakness && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaExclamationTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-sm text-teal-300">Weakness</span>
                        </div>
                        <span className="text-teal-100 font-bold text-sm">{bossStats.weakness}</span>
                      </div>
                    )}
                    {bossStats.maxHit && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaBolt className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-teal-300">Max Hit</span>
                        </div>
                        <span className="text-teal-100 font-bold">{bossStats.maxHit}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Combat Levels */}
              <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20 mb-6">
                <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                  <FaShieldAlt className="w-4 h-4 text-blue-400" />
                  Combat Levels
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {bossStats.attackLevel && (
                    <div className="text-center p-3 bg-teal-800/30 rounded-lg border border-teal-600/30">
                      <span className="text-xs text-teal-300 uppercase tracking-wide block">Attack</span>
                      <span className="text-lg font-bold text-teal-100">{bossStats.attackLevel}</span>
                    </div>
                  )}
                  {bossStats.strengthLevel && (
                    <div className="text-center p-3 bg-teal-800/30 rounded-lg border border-teal-600/30">
                      <span className="text-xs text-teal-300 uppercase tracking-wide block">Strength</span>
                      <span className="text-lg font-bold text-teal-100">{bossStats.strengthLevel}</span>
                    </div>
                  )}
                  {bossStats.defenceLevel && (
                    <div className="text-center p-3 bg-teal-800/30 rounded-lg border border-teal-600/30">
                      <span className="text-xs text-teal-300 uppercase tracking-wide block">Defence</span>
                      <span className="text-lg font-bold text-teal-100">{bossStats.defenceLevel}</span>
                    </div>
                  )}
                  {bossStats.magicLevel && (
                    <div className="text-center p-3 bg-teal-800/30 rounded-lg border border-teal-600/30">
                      <span className="text-xs text-teal-300 uppercase tracking-wide block">Magic</span>
                      <span className="text-lg font-bold text-teal-100">{bossStats.magicLevel}</span>
                    </div>
                  )}
                  {bossStats.archeryLevel && (
                    <div className="text-center p-3 bg-teal-800/30 rounded-lg border border-teal-600/30">
                      <span className="text-xs text-teal-300 uppercase tracking-wide block">Archery</span>
                      <span className="text-lg font-bold text-teal-100">{bossStats.archeryLevel}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Combat Bonuses */}
              <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20 mb-6">
                <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                  <FaMagic className="w-4 h-4 text-purple-400" />
                  Combat Bonuses
                </h3>
                <div className="space-y-4">
                  {/* Melee Bonuses */}
                  <div>
                    <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                      <FaDumbbell className="w-4 h-4" />
                      Melee
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {bossStats.meleeStrength && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Strength</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.meleeStrength}</span>
                        </div>
                      )}
                      {bossStats.meleeAccuracy && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Accuracy</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.meleeAccuracy}</span>
                        </div>
                      )}
                      {bossStats.meleeDefence && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Defence</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.meleeDefence}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Archery Bonuses */}
                  <div>
                    <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                      <FaCrosshairs className="w-4 h-4" />
                      Archery
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {bossStats.archeryStrength && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Strength</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.archeryStrength}</span>
                        </div>
                      )}
                      {bossStats.archeryAccuracy && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Accuracy</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.archeryAccuracy}</span>
                        </div>
                      )}
                      {bossStats.archeryDefence && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Defence</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.archeryDefence}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Magic Bonuses */}
                  <div>
                    <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                      <FaMagic className="w-4 h-4" />
                      Magic
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {bossStats.magicStrength && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Strength</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.magicStrength}</span>
                        </div>
                      )}
                      {bossStats.magicAccuracy && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Accuracy</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.magicAccuracy}</span>
                        </div>
                      )}
                      {bossStats.magicDefence && (
                        <div className="text-center p-2 bg-teal-800/30 rounded border border-teal-600/30">
                          <span className="text-xs text-teal-300 block">Defence</span>
                          <span className="text-sm font-bold text-teal-100">{bossStats.magicDefence}</span>
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
                <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20">
                  <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                    <FaCoins className="w-4 h-4 text-yellow-400" />
                    Drops ({bossDrops.length})
                  </h3>
                  <div className="space-y-3 overflow-y-auto">
                    {bossDrops.map((drop, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-teal-800/30 rounded-lg border border-teal-600/30">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-teal-600/20 rounded border border-teal-500/30 flex items-center justify-center flex-shrink-0">
                            <Image
                              src={getItemImagePath(drop.item)}
                              alt={drop.item}
                              width={32}
                              height={32}
                              className="rounded"
                              onError={(e) => {
                                // Hide image if it fails to load and show fallback icon
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <FaCoins className="w-4 h-4 text-teal-400 hidden" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-sm font-medium text-teal-100 block truncate" title={drop.item}>
                              {drop.item}
                            </span>
                            {drop.quantity && (
                              <div className="text-xs text-teal-300">Qty: {drop.quantity}</div>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-green-300 font-medium flex-shrink-0">{drop.rarity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 mb-6 text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent flex-1"></div>
              <span className="text-teal-400 text-sm font-medium px-4">Data Source</span>
              <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent flex-1"></div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FaSkull className="w-5 h-5 text-teal-400" />
              <span className="text-teal-300 text-sm">Data from</span>
              <a
                href="https://wiki.idleclans.com/index.php/Main_Page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-300 hover:text-teal-100 text-sm underline transition-colors"
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
