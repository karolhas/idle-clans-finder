'use client';

import { BsInfoCircleFill } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useCalculator } from './CalculatorContext';
import {
    BOOST_OPTIONS,
    OUTFIT_PIECES,
    TOOLS_BY_SKILL,
    T1_SCROLLS,
    T2_SCROLLS,
    T3_SCROLLS,
    MAX_OUTFIT_PIECES,
} from '@/utils/gamedata/calculator-constants';

export default function SkillBoosts() {
    const { state, setSkillBoost } = useCalculator();
    const { currentSkill, skillBoosts } = state;
    const currentBoosts = skillBoosts[currentSkill];
    const tools = TOOLS_BY_SKILL[currentSkill] || [];

    // Filter out Clan House, Personal House, and Scrolls as they need special handling
    const filteredBoostOptions = BOOST_OPTIONS.filter(
        (option) =>
            option.name !== 'clanHouse' &&
            option.name !== 'personalHouse' &&
            option.name !== 't1Scrolls' &&
            option.name !== 't2Scrolls' &&
            option.name !== 't3Scrolls'
    );

    // Handler for scroll selection with updated logic - max 4 scrolls total
    const handleScrollChange = (
        tier: 't1Scrolls' | 't2Scrolls' | 't3Scrolls',
        value: string
    ) => {
        // Calculate total scrolls currently selected
        const currentT1 = parseInt(currentBoosts.t1Scrolls) || 0;
        const currentT2 = parseInt(currentBoosts.t2Scrolls) || 0;
        const currentT3 = parseInt(currentBoosts.t3Scrolls) || 0;

        // Calculate how many scrolls will be in this tier after change
        const newTierValue = parseInt(value) || 0;

        // Calculate how many scrolls are currently in the changing tier
        let currentTierValue = 0;
        if (tier === 't1Scrolls') currentTierValue = currentT1;
        else if (tier === 't2Scrolls') currentTierValue = currentT2;
        else if (tier === 't3Scrolls') currentTierValue = currentT3;

        // Calculate the total that will exist after the change
        const totalAfterChange =
            currentT1 + currentT2 + currentT3 - currentTierValue + newTierValue;

        // Only allow the change if total will be <= 4
        if (totalAfterChange <= 4) {
            setSkillBoost(currentSkill, tier, value);
        }
    };

    // Calculate current total scrolls
    const currentT1Count = parseInt(currentBoosts.t1Scrolls) || 0;
    const currentT2Count = parseInt(currentBoosts.t2Scrolls) || 0;
    const currentT3Count = parseInt(currentBoosts.t3Scrolls) || 0;
    const totalScrolls = currentT1Count + currentT2Count + currentT3Count;

    // Check if we've reached max scrolls (4) and this tier has 0 selected
    const isT1Disabled = totalScrolls >= 4 && currentT1Count === 0;
    const isT2Disabled = totalScrolls >= 4 && currentT2Count === 0;
    const isT3Disabled = totalScrolls >= 4 && currentT3Count === 0;

    // Calculate how many scrolls are still available
    const scrollsAvailable = 4 - totalScrolls;

    // Funkcja sprawdzająca, czy opcja powinna być zablokowana
    const isOptionDisabled = (
        scrollValue: string,
        currentTierCount: number
    ) => {
        const value = parseInt(scrollValue) || 0;

        // Zawsze pozwalamy wybrać 0 (usunąć scrolle)
        if (value === 0) return false;

        // Jeśli to jest aktualnie wybrana wartość lub mniejsza, pozwalamy
        if (currentTierCount > 0 && value <= currentTierCount) return false;

        // Sprawdzamy, czy wartość mieści się w dostępnych slotach
        return value > scrollsAvailable;
    };

    return (
        <div className="bg-[#001010] rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                Skill Boosts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Tool */}
                <div>
                    <label
                        htmlFor="tool"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Tool
                    </label>
                    <select
                        id="tool"
                        value={currentBoosts.tool}
                        onChange={(e) =>
                            setSkillBoost(currentSkill, 'tool', e.target.value)
                        }
                        className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {tools.map((tool) => (
                            <option key={tool.value} value={tool.value}>
                                {tool.name}{' '}
                                {tool.boost > 0 ? `(+${tool.boost}%)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* T1 Scrolls */}
                <div>
                    <label
                        htmlFor="t1Scrolls"
                        className={`block text-sm font-medium mb-1 ${
                            !isT1Disabled ? 'text-gray-300' : 'text-gray-600'
                        }`}
                    >
                        T1 Scrolls {isT1Disabled && `(Max 4 scrolls reached)`}
                        {!isT1Disabled &&
                            totalScrolls > 0 &&
                            ` (${scrollsAvailable} slots left)`}
                    </label>
                    <select
                        id="t1Scrolls"
                        value={currentBoosts.t1Scrolls}
                        onChange={(e) =>
                            handleScrollChange('t1Scrolls', e.target.value)
                        }
                        disabled={isT1Disabled}
                        className={`py-2 px-3 block w-full rounded-md border-gray-700 focus:ring-emerald-500 focus:border-emerald-500 ${
                            !isT1Disabled
                                ? 'bg-[#002020] text-white'
                                : 'bg-[#001010] text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        {T1_SCROLLS.map((scroll) => (
                            <option
                                key={scroll.value}
                                value={scroll.value}
                                disabled={isOptionDisabled(
                                    scroll.value,
                                    currentT1Count
                                )}
                                className={
                                    isOptionDisabled(
                                        scroll.value,
                                        currentT1Count
                                    )
                                        ? 'text-gray-500 bg-gray-800'
                                        : ''
                                }
                            >
                                {scroll.name}{' '}
                                {scroll.boost > 0 ? `(+${scroll.boost}%)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* T2 Scrolls */}
                <div>
                    <label
                        htmlFor="t2Scrolls"
                        className={`block text-sm font-medium mb-1 ${
                            !isT2Disabled ? 'text-gray-300' : 'text-gray-600'
                        }`}
                    >
                        T2 Scrolls {isT2Disabled && `(Max 4 scrolls reached)`}
                        {!isT2Disabled &&
                            totalScrolls > 0 &&
                            ` (${scrollsAvailable} slots left)`}
                    </label>
                    <select
                        id="t2Scrolls"
                        value={currentBoosts.t2Scrolls}
                        onChange={(e) =>
                            handleScrollChange('t2Scrolls', e.target.value)
                        }
                        disabled={isT2Disabled}
                        className={`py-2 px-3 block w-full rounded-md border-gray-700 focus:ring-emerald-500 focus:border-emerald-500 ${
                            !isT2Disabled
                                ? 'bg-[#002020] text-white'
                                : 'bg-[#001010] text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        {T2_SCROLLS.map((scroll) => (
                            <option
                                key={scroll.value}
                                value={scroll.value}
                                disabled={isOptionDisabled(
                                    scroll.value,
                                    currentT2Count
                                )}
                                className={
                                    isOptionDisabled(
                                        scroll.value,
                                        currentT2Count
                                    )
                                        ? 'text-gray-500 bg-gray-800'
                                        : ''
                                }
                            >
                                {scroll.name}{' '}
                                {scroll.boost > 0 ? `(+${scroll.boost}%)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* T3 Scrolls */}
                <div>
                    <label
                        htmlFor="t3Scrolls"
                        className={`block text-sm font-medium mb-1 ${
                            !isT3Disabled ? 'text-gray-300' : 'text-gray-600'
                        }`}
                    >
                        T3 Scrolls {isT3Disabled && `(Max 4 scrolls reached)`}
                        {!isT3Disabled &&
                            totalScrolls > 0 &&
                            ` (${scrollsAvailable} slots left)`}
                    </label>
                    <select
                        id="t3Scrolls"
                        value={currentBoosts.t3Scrolls}
                        onChange={(e) =>
                            handleScrollChange('t3Scrolls', e.target.value)
                        }
                        disabled={isT3Disabled}
                        className={`py-2 px-3 block w-full rounded-md border-gray-700 focus:ring-emerald-500 focus:border-emerald-500 ${
                            !isT3Disabled
                                ? 'bg-[#002020] text-white'
                                : 'bg-[#001010] text-gray-600 cursor-not-allowed'
                        }`}
                    >
                        {T3_SCROLLS.map((scroll) => (
                            <option
                                key={scroll.value}
                                value={scroll.value}
                                disabled={isOptionDisabled(
                                    scroll.value,
                                    currentT3Count
                                )}
                                className={
                                    isOptionDisabled(
                                        scroll.value,
                                        currentT3Count
                                    )
                                        ? 'text-gray-500 bg-gray-800'
                                        : ''
                                }
                            >
                                {scroll.name}{' '}
                                {scroll.boost > 0 ? `(+${scroll.boost}%)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Outfit Pieces */}
                <div>
                    <label
                        htmlFor="outfitPieces"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Outfit Pieces
                    </label>
                    <select
                        id="outfitPieces"
                        value={currentBoosts.outfitPieces}
                        onChange={(e) =>
                            setSkillBoost(
                                currentSkill,
                                'outfitPieces',
                                parseInt(e.target.value, 10)
                            )
                        }
                        disabled={MAX_OUTFIT_PIECES[currentSkill] === 0}
                        className={`py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500 ${
                            MAX_OUTFIT_PIECES[currentSkill] === 0
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                        }`}
                    >
                        {OUTFIT_PIECES.filter(
                            (piece) =>
                                piece.value <= MAX_OUTFIT_PIECES[currentSkill]
                        ).map((piece) => (
                            <option key={piece.value} value={piece.value}>
                                {piece.value}{' '}
                                {piece.boost > 0 ? `(+${piece.boost}%)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Other standard boost options */}
                {filteredBoostOptions.map((option) => (
                    <div key={option.name}>
                        <label
                            htmlFor={option.name}
                            className="block text-sm font-medium text-gray-300 mb-1"
                        >
                            {option.label}
                        </label>
                        <select
                            id={option.name}
                            value={
                                currentBoosts[
                                    option.name as keyof typeof currentBoosts
                                ] as string
                            }
                            onChange={(e) =>
                                setSkillBoost(
                                    currentSkill,
                                    option.name as keyof typeof currentBoosts,
                                    e.target.value
                                )
                            }
                            className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                        >
                            {option.options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.name}{' '}
                                    {opt.boost > 0 ? `(+${opt.boost}%)` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {/* Checkboxes - full width section */}
            <div className="mt-4">
                <h3 className="text-md font-medium text-emerald-300 mb-2">
                    Additional Boosts
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {/* XP Boost */}
                    <div className="flex items-center">
                        <input
                            id="xpBoost"
                            type="checkbox"
                            checked={currentBoosts.xpBoost}
                            onChange={(e) =>
                                setSkillBoost(
                                    currentSkill,
                                    'xpBoost',
                                    e.target.checked
                                )
                            }
                            className="h-4 w-4 text-emerald-500 border-gray-700 rounded focus:ring-emerald-500 bg-[#002020]"
                        />
                        <label
                            htmlFor="xpBoost"
                            className="ml-2 block text-sm text-gray-300"
                        >
                            XP Boost (+30%)
                            <BsInfoCircleFill
                                className="inline-block ml-1 text-gray-400 cursor-help"
                                size={14}
                                data-tooltip-id="xp-boost-tooltip"
                            />
                        </label>
                        <Tooltip
                            id="xp-boost-tooltip"
                            place="top"
                            content="Will only account for 8 hours out of every 24 hours, +30% in your total time required."
                            style={{
                                backgroundColor: '#003030',
                                color: '#fff',
                                borderRadius: '6px',
                            }}
                        />
                    </div>

                    {/* Negotiation Potion */}
                    <div className="flex items-center">
                        <input
                            id="negotiationPotion"
                            type="checkbox"
                            checked={currentBoosts.negotiationPotion}
                            onChange={(e) =>
                                setSkillBoost(
                                    currentSkill,
                                    'negotiationPotion',
                                    e.target.checked
                                )
                            }
                            className="h-4 w-4 text-emerald-500 border-gray-700 rounded focus:ring-emerald-500 bg-[#002020]"
                        />
                        <label
                            htmlFor="negotiationPotion"
                            className="ml-2 block text-sm text-gray-300"
                        >
                            Negotiation Potion (+5% gold)
                        </label>
                    </div>

                    {/* Trickery Potion */}
                    <div className="flex items-center">
                        <input
                            id="trickeryPotion"
                            type="checkbox"
                            checked={currentBoosts.trickeryPotion}
                            onChange={(e) =>
                                setSkillBoost(
                                    currentSkill,
                                    'trickeryPotion',
                                    e.target.checked
                                )
                            }
                            className="h-4 w-4 text-emerald-500 border-gray-700 rounded focus:ring-emerald-500 bg-[#002020]"
                        />
                        <label
                            htmlFor="trickeryPotion"
                            className="ml-2 block text-sm text-gray-300"
                        >
                            Trickery Potion (+15% gold)
                        </label>
                    </div>

                    {/* Knowledge Potion */}
                    <div className="flex items-center">
                        <input
                            id="knowledgePotion"
                            type="checkbox"
                            checked={currentBoosts.knowledgePotion}
                            onChange={(e) =>
                                setSkillBoost(
                                    currentSkill,
                                    'knowledgePotion',
                                    e.target.checked
                                )
                            }
                            className="h-4 w-4 text-emerald-500 border-gray-700 rounded focus:ring-emerald-500 bg-[#002020]"
                        />
                        <label
                            htmlFor="knowledgePotion"
                            className="ml-2 block text-sm text-gray-300"
                        >
                            Knowledge Potion (+50% Scroll effect)
                        </label>
                    </div>

                    {/* Guardian's Trowel for Farming skill */}
                    {currentSkill === 'farming' && (
                        <div className="flex items-center">
                            <input
                                id="guardiansTrowel"
                                type="checkbox"
                                checked={currentBoosts.guardiansTrowel}
                                onChange={(e) =>
                                    setSkillBoost(
                                        currentSkill,
                                        'guardiansTrowel',
                                        e.target.checked
                                    )
                                }
                                className="h-4 w-4 text-emerald-500 border-gray-700 rounded focus:ring-emerald-500 bg-[#002020]"
                            />
                            <label
                                htmlFor="guardiansTrowel"
                                className="ml-2 block text-sm text-gray-300"
                            >
                                Guardian&apos;s Trowel (+5% skill boost)
                            </label>
                        </div>
                    )}

                    {/* Guardian&apos;s Chisel for Crafting skill */}
                    {currentSkill === 'crafting' && (
                        <div className="flex items-center">
                            <input
                                id="guardiansChisel"
                                type="checkbox"
                                checked={currentBoosts.guardiansChisel}
                                onChange={(e) =>
                                    setSkillBoost(
                                        currentSkill,
                                        'guardiansChisel',
                                        e.target.checked
                                    )
                                }
                                className="h-4 w-4 text-emerald-500 border-gray-700 rounded focus:ring-emerald-500 bg-[#002020]"
                            />
                            <label
                                htmlFor="guardiansChisel"
                                className="ml-2 block text-sm text-gray-300"
                            >
                                Guardian&apos;s Chisel (+10% XP to Refinement)
                            </label>
                        </div>
                    )}

                    {/* Forgery Potion for Smithing skill */}
                    {currentSkill === 'smithing' && (
                        <div className="flex items-center">
                            <input
                                id="forgeryPotion"
                                type="checkbox"
                                checked={currentBoosts.forgeryPotion}
                                onChange={(e) =>
                                    setSkillBoost(
                                        currentSkill,
                                        'forgeryPotion',
                                        e.target.checked
                                    )
                                }
                                className="h-4 w-4 text-emerald-500 border-gray-700 rounded focus:ring-emerald-500 bg-[#002020]"
                            />
                            <label
                                htmlFor="forgeryPotion"
                                className="ml-2 block text-sm text-gray-300"
                            >
                                Forgery Potion (+10% to save bars)
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
