'use client';

import { useCalculator } from './CalculatorContext';
import { BUFF_TIERS_MAP } from '@/utils/gamedata/gathering-buff-tiers';
import { BsInfoCircleFill } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// Wiki links for each buff
const BUFF_WIKI_LINKS = {
    theFisherman: 'https://wiki.idleclans.com/index.php/The_fisherman',
    powerForager: 'https://wiki.idleclans.com/index.php/Power_forager',
    theLumberjack: 'https://wiki.idleclans.com/index.php/The_lumberjack',
    efficientFisherman:
        'https://wiki.idleclans.com/index.php/Most_efficient_fisherman',
    farmingTrickery: 'https://wiki.idleclans.com/index.php/Farming_trickery',
    smeltingMagic: 'https://wiki.idleclans.com/index.php/Smelting_magic',
    plankBargain: 'https://wiki.idleclans.com/index.php/Plank_bargain',
    gatherers: 'https://wiki.idleclans.com/index.php/Gatherers',
};

export default function GatheringBuffs() {
    const { state } = useCalculator();
    const { gatheringBuffs, upgradeBuffs, currentSkill } = state;

    // Check if current skill is eligible for gatherers bonus
    const isGatherersSkill = [
        'woodcutting',
        'fishing',
        'mining',
        'foraging',
    ].includes(currentSkill);

    // Helper function to get display text for a specific buff
    const getBuffDisplayText = (buffKey: string, tier: number): string => {
        if (tier <= 0) return 'None';

        // Special cases for buffs with custom descriptions
        if (buffKey === 'theLumberjack') {
            const tierPercent = tier * 20; // T1=20%, T2=40%, etc.
            return `T${tier} (+${tierPercent}% chance for bonus logs, no extra XP)`;
        }

        const tierInfo = BUFF_TIERS_MAP[buffKey].find(
            (t) => t.value === tier.toString()
        );
        if (!tierInfo) return 'None';

        return `T${tier} ${tierInfo.effect ? `(${tierInfo.effect})` : ''}`;
    };

    // Helper function to render info icon with tooltip
    const renderInfoIcon = (buffKey: string) => (
        <>
            <a
                href={BUFF_WIKI_LINKS[buffKey as keyof typeof BUFF_WIKI_LINKS]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block ml-1"
            >
                <BsInfoCircleFill
                    className="inline-block text-gray-400 hover:text-emerald-400 transition-colors"
                    size={14}
                    data-tooltip-id={`${buffKey}-tooltip`}
                />
            </a>
            <Tooltip
                id={`${buffKey}-tooltip`}
                place="top"
                content="Click to view detailed information about this upgrade on the wiki"
                style={{
                    backgroundColor: '#003030',
                    color: '#fff',
                    borderRadius: '6px',
                }}
            />
        </>
    );

    return (
        <div className="bg-[#001010] rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                Buffs
            </h2>

            {/* Dividing into two sections as requested */}
            <div className="mb-4">
                <h3 className="text-md font-medium text-emerald-200 mb-2">
                    Gathering Buffs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* The Fisherman */}
                    <div>
                        <label
                            htmlFor="theFisherman"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            The Fisherman
                            {renderInfoIcon('theFisherman')}
                        </label>
                        <input
                            id="theFisherman"
                            type="text"
                            value={getBuffDisplayText(
                                'theFisherman',
                                gatheringBuffs.theFisherman
                            )}
                            readOnly
                            className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white opacity-90 cursor-not-allowed"
                        />
                    </div>

                    {/* Power Forager */}
                    <div>
                        <label
                            htmlFor="powerForager"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Power Forager
                            {renderInfoIcon('powerForager')}
                        </label>
                        <input
                            id="powerForager"
                            type="text"
                            value={getBuffDisplayText(
                                'powerForager',
                                gatheringBuffs.powerForager
                            )}
                            readOnly
                            className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white opacity-90 cursor-not-allowed"
                        />
                    </div>

                    {/* The Lumberjack */}
                    <div>
                        <label
                            htmlFor="theLumberjack"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            The Lumberjack
                            {renderInfoIcon('theLumberjack')}
                        </label>
                        <input
                            id="theLumberjack"
                            type="text"
                            value={getBuffDisplayText(
                                'theLumberjack',
                                gatheringBuffs.theLumberjack
                            )}
                            readOnly
                            className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white opacity-90 cursor-not-allowed"
                        />
                    </div>

                    {/* Gatherers clan upgrade - only shown for eligible skills */}
                    {isGatherersSkill && (
                        <div>
                            <label
                                htmlFor="gatherers"
                                className="block text-sm font-medium text-gray-300 mb-1"
                            >
                                Gatherers
                                {renderInfoIcon('gatherers')}
                            </label>
                            <input
                                id="gatherers"
                                type="text"
                                value={
                                    upgradeBuffs.gatherers
                                        ? 'Yes (+5% skill speed for all gathering skills)'
                                        : 'No'
                                }
                                readOnly
                                className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white opacity-90 cursor-not-allowed"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Time and Money Buffs Section */}
            <div>
                <h3 className="text-md font-medium text-emerald-200 mb-2">
                    Time and Money Buffs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Efficient Fisherman */}
                    <div>
                        <label
                            htmlFor="efficientFisherman"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Efficient Fisherman
                            {renderInfoIcon('efficientFisherman')}
                        </label>
                        <input
                            id="efficientFisherman"
                            type="text"
                            value={getBuffDisplayText(
                                'efficientFisherman',
                                gatheringBuffs.efficientFisherman
                            )}
                            readOnly
                            className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white opacity-90 cursor-not-allowed"
                        />
                    </div>

                    {/* Farming Trickery */}
                    <div>
                        <label
                            htmlFor="farmingTrickery"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Farming Trickery
                            {renderInfoIcon('farmingTrickery')}
                        </label>
                        <input
                            id="farmingTrickery"
                            type="text"
                            value={getBuffDisplayText(
                                'farmingTrickery',
                                gatheringBuffs.farmingTrickery
                            )}
                            readOnly
                            className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white opacity-90 cursor-not-allowed"
                        />
                    </div>

                    {/* Smelting Magic */}
                    <div>
                        <label
                            htmlFor="smeltingMagic"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Smelting Magic
                            {renderInfoIcon('smeltingMagic')}
                        </label>
                        <input
                            id="smeltingMagic"
                            type="text"
                            value={getBuffDisplayText(
                                'smeltingMagic',
                                gatheringBuffs.smeltingMagic
                            )}
                            readOnly
                            className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white opacity-90 cursor-not-allowed"
                        />
                    </div>

                    {/* Plank Bargain */}
                    <div>
                        <label
                            htmlFor="plankBargain"
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            Plank Bargain
                            {renderInfoIcon('plankBargain')}
                        </label>
                        <input
                            id="plankBargain"
                            type="text"
                            value={getBuffDisplayText(
                                'plankBargain',
                                gatheringBuffs.plankBargain
                            )}
                            readOnly
                            className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white opacity-90 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
