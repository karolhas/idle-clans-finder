import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes, FaSkull, FaTrophy, FaShieldAlt, FaHeart, FaCoins, FaStar, FaMapMarkerAlt, FaKey, FaClock, FaCrosshairs, FaExclamationTriangle, FaBolt, FaDumbbell, FaMagic, FaUsers, FaCrown, FaWaveSquare, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import Image from "next/image";
import { getRaidData } from "../../utils/bosses/bossData";

interface RaidWikiModalProps {
  isOpen: boolean;
  onClose: () => void;
  raidName: string;
}

interface RaidStats {
  hp?: string;
  xp?: string;
  location?: string;
  level?: string;
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

interface RaidDrop {
  item: string;
  quantity?: string;
  rarity?: string;
  dropRate?: string;
  conditions?: string;
  additionalInfo?: string[];
}

interface RaidData {
  name: string;
  displayName: string;
  type: 'defense' | 'combat' | 'survival';
  description: string;
  skills?: {
    required: Record<string, number>;
    recommended?: Record<string, number>;
  };
  mechanics?: {
    waves: number;
    resourceManagement: boolean;
    defenseUpgrades: boolean;
    citadelHealth: number;
    enemyTypes: string[];
  };
  combatPhases?: Array<{
    phase: number;
    boss: string;
    health: number;
    attackStyle: string;
    weakness: string;
  }>;
  resourceGathering?: {
    divineEnergy: boolean;
    gatheringTime: string;
    energyRequired: number;
  };
  survivalMechanics?: {
    waves: string;
    scalingDifficulty: boolean;
    bloodMoonEffects: string[];
    survivalTime: string;
    scoreBased: boolean;
  };
  waveStructure?: Array<{
    waveRange: string;
    enemyTypes: string[];
    difficulty: string;
  }>;
  requirements: {
    normal: Record<string, number>;
    ironman: Record<string, number>;
  };
  drops: Array<{
    item: string;
    quantity: string;
    chance: string;
    value: string;
  }>;
}

export function RaidWikiModal({ isOpen, onClose, raidName }: RaidWikiModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [raidStats, setRaidStats] = useState<RaidStats>({});
  const [raidDrops, setRaidDrops] = useState<RaidDrop[]>([]);
  const [raidRequirements, setRaidRequirements] = useState<{normal: Record<string, any>, ironman: Record<string, any>} | null>(null);
  const [raidData, setRaidData] = useState<RaidData | null>(null);

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
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Load raid data from local JSON
  useEffect(() => {
    if (isOpen && raidName) {
      const data = getRaidData(raidName);
      setRaidData(data);

      if (data) {
        // Process requirements data
        if (data.requirements) {
          setRaidRequirements(data.requirements);
        }

        // Process drops data
        const drops: RaidDrop[] = data.drops.map((dropItem: any) => ({
          item: dropItem.item,
          quantity: dropItem.quantity,
          rarity: dropItem.chance,
          dropRate: dropItem.chance,
        }));
        setRaidDrops(drops);
      } else {
        // Reset state if raid not found
        setRaidStats({});
        setRaidDrops([]);
        setRaidRequirements(null);
      }
    }
  }, [isOpen, raidName]);

  // Custom scrollbar styling for raid modal
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Custom scrollbar for raid modal */
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

  // Helper function to get boss display name
  function getBossDisplayName(bossKey: string): string {
    const bossNameMap: Record<string, string> = {
      'griffin': 'Griffin',
      'devil': 'Devil',
      'hades': 'Hades',
      'zeus': 'Zeus',
      'medusa': 'Medusa',
      'chimera': 'Chimera',
      'kronos': 'Kronos'
    };
    return bossNameMap[bossKey] || bossKey;
  }

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
      'sobeks_talisman': 'sobek_upgrade_item',
      'guardians_brewing_spoon': 'guardians_brewspoon',
      'citadels_woodworking_tips': 'citadel_woodworking_tips',
      'strawberry_seed': 'strawberry_seed',
      'yew_log': 'yew_log',
      'eagleclaw_battle-axe': 'eagleclaw_battle_axe',
      'mountain_key': 'griffin_key',
      'burning_key': 'devil_key',
      'underworld_key': 'hades_key',
      'godly_key': 'zeus_key',
      'stone_key': 'medusa_key',
      'mutated_key': 'chimera_key',
      'bloodmoon_gem': 'bloodmoon_helmet_upgrade',
      'lil_eclipse': 'pet_bloodmoon',
      'lunar_belt': 'belt_of_the_moon',
      'bloodmoon_bait_jar': 'bloodmoon_bait_fishing'
    };
    
    return `/gameimages/${otherMappings[cleanName] || fruitSeedMappings[cleanName] || pageMappings[cleanName] || cleanName}.png`;
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-gradient-to-br from-teal-950 via-teal-900 to-teal-950 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-teal-600"
      >
        {/* Raid-themed Header */}
        <div className="px-6 py-4 border-b-4 border-teal-600 flex justify-between items-center bg-gradient-to-r from-teal-900/80 to-teal-800/80 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-teal-600/20 rounded-xl border border-teal-500/30">
              <FaSkull className="w-6 h-6 text-teal-400" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-bold text-teal-100 tracking-tight flex items-center gap-2">
                <FaCrown className="w-4 h-4 text-yellow-400" />
                {raidData?.displayName || raidName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              <p className="text-teal-300 text-sm flex items-center gap-2">
                <FaUsers className="w-4 h-4" />
                Raid
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-teal-300 hover:text-teal-100 transition-all duration-200 p-2 rounded-xl hover:bg-teal-600/20 group border border-teal-500/20"
            aria-label="Close raid modal"
          >
            <FaTimes className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Raid Content */}
        <div className="overflow-y-auto boss-modal-scroll max-h-[calc(90vh-120px)]">
          {/* Raid Description */}
          {raidData?.description && (
            <div className="p-6 pb-4">
              <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20">
                <p className="text-teal-200 leading-relaxed">{raidData.description}</p>
              </div>
            </div>
          )}

          {/* Responsive Layout: stats left, requirements and drops right on desktop */}
          <div className="flex flex-col lg:flex-row gap-6 p-6">
            {/* Raid Statistics - Left on desktop, top on mobile */}
            <div className="lg:w-1/2 order-1 lg:order-1 space-y-6">
              {/* Raid Requirements - Show in left column for Reckoning of the Gods */}
              {raidData?.name === 'reckoning_of_the_gods' && raidRequirements && (Object.keys(raidRequirements.normal).length > 0 || Object.keys(raidRequirements.ironman).length > 0) && (
                <div className="bg-purple-600/5 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                    <FaUsers className="w-4 h-4 text-purple-400" />
                    Access Requirements
                  </h3>
                  <div className="space-y-4">
                    {/* Normal Mode */}
                    {Object.keys(raidRequirements.normal).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                          <FaTrophy className="w-3 h-3 text-yellow-400" />
                          Normal Mode
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(raidRequirements.normal).map(([requirementKey, value]) => (
                            <div key={requirementKey} className="flex items-center justify-between bg-teal-900/20 rounded px-3 py-2">
                              <span className="text-xs text-teal-300">
                                {requirementKey === 'totalBossKills' ? 'Total Boss Kills' :
                                 requirementKey === 'valleyOfGodsKills' ? 'Valley of Gods Kills' :
                                 getBossDisplayName(requirementKey)}
                              </span>
                              <span className="text-sm font-bold text-teal-100">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ironman Mode */}
                    {Object.keys(raidRequirements.ironman).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                          <FaShieldAlt className="w-3 h-3 text-teal-400" />
                          Ironman Mode
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(raidRequirements.ironman).map(([requirementKey, value]) => (
                            <div key={requirementKey} className="flex items-center justify-between bg-teal-900/20 rounded px-3 py-2">
                              <span className="text-xs text-teal-300">
                                {requirementKey === 'totalBossKills' ? 'Total Boss Kills' :
                                 requirementKey === 'valleyOfGodsKills' ? 'Valley of Gods Kills' :
                                 getBossDisplayName(requirementKey)}
                              </span>
                              <span className="text-sm font-bold text-teal-100">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No requirements message */}
                    {Object.keys(raidRequirements.normal).length === 0 && Object.keys(raidRequirements.ironman).length === 0 && (
                      <div className="text-center py-4">
                        <span className="text-sm text-teal-300">No special requirements</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Raid Type Specific Information */}
              {raidData?.type === 'defense' && raidData.mechanics && (
                <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20">
                  <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                    <FaShieldAlt className="w-4 h-4 text-teal-400" />
                    Defense Mechanics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaSkull className="w-4 h-4 text-teal-400" />
                        <span className="text-sm text-teal-300">Waves</span>
                      </div>
                      <span className="text-teal-100 font-bold">{raidData.mechanics.waves}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaHeart className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-teal-300">Citadel Health</span>
                      </div>
                      <span className="text-teal-100 font-bold">{raidData.mechanics.citadelHealth?.toLocaleString()}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-teal-500/20">
                      <h4 className="text-sm font-semibold text-teal-200 mb-2">Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {raidData.mechanics.resourceManagement && (
                          <span className="px-2 py-1 bg-teal-900/20 rounded text-xs text-teal-300">Resource Management</span>
                        )}
                        {raidData.mechanics.defenseUpgrades && (
                          <span className="px-2 py-1 bg-teal-900/20 rounded text-xs text-teal-300">Defense Upgrades</span>
                        )}
                      </div>
                    </div>
                    {raidData.mechanics.enemyTypes && (
                      <div className="mt-3 pt-3 border-t border-blue-500/20">
                        <h4 className="text-sm font-semibold text-blue-200 mb-2">Enemy Types</h4>
                        <div className="flex flex-wrap gap-2">
                          {raidData.mechanics.enemyTypes.map((enemy, index) => (
                            <span key={index} className="px-2 py-1 bg-red-900/20 rounded text-xs text-red-300">{enemy}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {raidData?.type === 'combat' && raidData.combatPhases && (
                <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20">
                  <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                    <FaCrosshairs className="w-4 h-4 text-teal-400" />
                    Combat Phases
                  </h3>
                  <div className="space-y-4">
                    {raidData.combatPhases.map((phase, index) => (
                      <div key={index} className="bg-teal-900/20 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-teal-200">Phase {phase.phase}: {phase.boss}</h4>
                          <span className="text-xs text-teal-300">{phase.health?.toLocaleString()} HP</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-teal-300">Attack Style:</span>
                            <span className="text-teal-100">{phase.attackStyle}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-teal-300">Weakness:</span>
                            <span className="text-teal-100">{phase.weakness}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {raidData.resourceGathering && (
                    <div className="mt-4 pt-4 border-t border-teal-500/20">
                      <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                        <FaCoins className="w-3 h-3 text-yellow-400" />
                        Resource Gathering Phase
                      </h4>
                      <div className="text-xs text-teal-300 space-y-1">
                        <div>Duration: {raidData.resourceGathering.gatheringTime}</div>
                        <div>Energy Required: {raidData.resourceGathering.energyRequired}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {raidData?.type === 'survival' && raidData.survivalMechanics && (
                <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20">
                  <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                    <FaClock className="w-4 h-4 text-teal-400" />
                    Survival Mechanics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaSkull className="w-4 h-4 text-teal-400" />
                        <span className="text-sm text-teal-300">Waves</span>
                      </div>
                      <span className="text-teal-100 font-bold">{raidData.survivalMechanics.waves}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FaClock className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-teal-300">Survival Time</span>
                      </div>
                      <span className="text-teal-100 font-bold">{raidData.survivalMechanics.survivalTime}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-teal-500/20">
                      <h4 className="text-sm font-semibold text-teal-200 mb-2">Blood Moon Effects</h4>
                      <div className="flex flex-wrap gap-2">
                        {raidData.survivalMechanics.bloodMoonEffects?.map((effect, index) => (
                          <span key={index} className="px-2 py-1 bg-red-900/20 rounded text-xs text-red-300">{effect}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {raidData?.type === 'survival' && raidData.waveStructure && (
                <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20">
                  <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                    <FaWaveSquare className="w-4 h-4 text-teal-400" />
                    Wave Structure
                  </h3>
                  <div className="space-y-3">
                    {raidData.waveStructure.map((wave, index) => (
                      <div key={index} className="bg-teal-900/20 rounded p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-teal-200">Waves {wave.waveRange}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            wave.difficulty === 'Low' ? 'bg-green-900/20 text-green-300' :
                            wave.difficulty === 'Medium' ? 'bg-yellow-900/20 text-yellow-300' :
                            wave.difficulty === 'High' ? 'bg-orange-900/20 text-orange-300' :
                            'bg-red-900/20 text-red-300'
                          }`}>
                            {wave.difficulty}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {wave.enemyTypes.map((enemy, enemyIndex) => (
                            <span key={enemyIndex} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">{enemy}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Requirements */}
              {raidData?.skills && (
                <div className="bg-green-600/5 rounded-lg p-4 border border-green-500/20">
                  <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    Skill Requirements
                  </h3>
                  <div className="space-y-4">
                    {/* Required Skills */}
                    <div>
                      <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                        <FaCheckCircle className="w-3 h-3 text-teal-400" />
                        Required
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(raidData.skills.required).map(([skill, level]) => (
                          <div key={skill} className="flex items-center justify-between bg-teal-900/20 rounded px-3 py-2">
                            <span className="text-xs text-teal-300 capitalize">{skill}</span>
                            <span className="text-sm font-bold text-teal-100">{level}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Skills */}
                    {raidData.skills.recommended && Object.keys(raidData.skills.recommended).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                          <FaInfoCircle className="w-3 h-3 text-teal-400" />
                          Recommended
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(raidData.skills.recommended).map(([skill, level]) => (
                            <div key={skill} className="flex items-center justify-between bg-teal-900/20 rounded px-3 py-2">
                              <span className="text-xs text-teal-300 capitalize">{skill}</span>
                              <span className="text-sm font-bold text-teal-100">{level}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Requirements and Drops - Right on desktop, bottom on mobile */}
            <div className="lg:w-1/2 order-2 lg:order-2 space-y-6">
              {/* Raid Requirements - Hide for Reckoning of the Gods (moved to left) */}
              {raidData?.name !== 'reckoning_of_the_gods' && raidRequirements && (Object.keys(raidRequirements.normal).length > 0 || Object.keys(raidRequirements.ironman).length > 0) && (
                <div className="bg-purple-600/5 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-purple-100 mb-4 flex items-center gap-2">
                    <FaUsers className="w-4 h-4 text-purple-400" />
                    Access Requirements
                  </h3>
                  <div className="space-y-4">
                    {/* Normal Mode */}
                    {Object.keys(raidRequirements.normal).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                          <FaTrophy className="w-3 h-3 text-yellow-400" />
                          Normal Mode
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(raidRequirements.normal).map(([requirementKey, value]) => (
                            <div key={requirementKey} className="flex items-center justify-between bg-teal-900/20 rounded px-3 py-2">
                              <span className="text-xs text-teal-300">
                                {requirementKey === 'totalBossKills' ? 'Total Boss Kills' : getBossDisplayName(requirementKey)}
                              </span>
                              <span className="text-sm font-bold text-teal-100">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ironman Mode */}
                    {Object.keys(raidRequirements.ironman).length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-teal-200 mb-2 flex items-center gap-2">
                          <FaShieldAlt className="w-3 h-3 text-teal-400" />
                          Ironman Mode
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(raidRequirements.ironman).map(([requirementKey, value]) => (
                            <div key={requirementKey} className="flex items-center justify-between bg-teal-900/20 rounded px-3 py-2">
                              <span className="text-xs text-teal-300">
                                {requirementKey === 'totalBossKills' ? 'Total Boss Kills' : getBossDisplayName(requirementKey)}
                              </span>
                              <span className="text-sm font-bold text-teal-100">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No requirements message */}
                    {Object.keys(raidRequirements.normal).length === 0 && Object.keys(raidRequirements.ironman).length === 0 && (
                      <div className="text-center py-4">
                        <span className="text-sm text-teal-300">No special requirements</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Raid Drops */}
              {raidDrops.length > 0 && (
                <div className="bg-teal-600/5 rounded-lg p-4 border border-teal-500/20">
                  <h3 className="text-lg font-semibold text-teal-100 mb-4 flex items-center gap-2">
                    <FaCoins className="w-4 h-4 text-yellow-400" />
                    Raid Drops
                  </h3>
                  <div className="space-y-2">
                    {raidDrops.map((drop, index) => (
                      <div key={index} className="flex items-center justify-between bg-teal-900/20 rounded px-3 py-2">
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
                            <FaCoins className="w-4 h-4 text-amber-400 hidden" />
                          </div>
                          <div>
                            <span className="text-sm text-teal-100 font-medium">{drop.item}</span>
                            {drop.quantity && (
                              <span className="text-xs text-teal-300 block">({drop.quantity})</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-teal-300 font-medium">{drop.rarity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Raid Not Found Message */}
          {!raidData && (
            <div className="p-6">
              <div className="bg-teal-900/20 rounded-lg p-4 border border-teal-500/20 text-center">
                <FaExclamationTriangle className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-teal-100 mb-2">Raid Not Found</h3>
                <p className="text-teal-300">Unable to find data for raid: {raidName}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}