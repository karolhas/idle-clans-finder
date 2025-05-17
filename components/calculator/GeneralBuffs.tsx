'use client';

import { useState, useEffect } from 'react';
import { useCalculator } from './CalculatorContext';
import {
    CLAN_HOUSE_TIERS,
    PERSONAL_HOUSE_TIERS,
} from '@/utils/gamedata/calculator-constants';
import { fetchClanByName } from '@/lib/api/apiService';

export default function GeneralBuffs() {
    const { state, setGeneralBuff } = useCalculator();
    const { generalBuffs } = state;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkClanUpgrades = async () => {
            // Don't make the API call if user is not in a clan
            if (!state.clanName) {
                return;
            }

            try {
                setLoading(true);
                const clanData = await fetchClanByName(state.clanName);

                // Check if the clan has serializedUpgrades property
                if (clanData && clanData.serializedUpgrades) {
                    // Check if the clan has the "Offer They Can't Refuse" upgrade (ID 20)
                    const hasOfferUpgrade =
                        clanData.serializedUpgrades.includes('20');

                    if (hasOfferUpgrade && !generalBuffs.offerTheyCanRefuse) {
                        setGeneralBuff('offerTheyCanRefuse', true);
                    }
                }
            } catch (error) {
                console.error('Error fetching clan upgrades:', error);
            } finally {
                setLoading(false);
            }
        };

        checkClanUpgrades();
    }, [state.clanName, setGeneralBuff]);

    return (
        <div className="bg-[#001010] rounded-lg p-4 mb-4">
            <h2 className="text-lg font-semibold text-emerald-300 mb-3">
                General Buffs
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Clan House */}
                <div>
                    <label
                        htmlFor="clanHouse"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Clan House
                    </label>
                    <select
                        id="clanHouse"
                        value={generalBuffs.clanHouse}
                        onChange={(e) =>
                            setGeneralBuff('clanHouse', e.target.value)
                        }
                        className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {CLAN_HOUSE_TIERS.map((tier) => (
                            <option key={tier.value} value={tier.value}>
                                {tier.name}{' '}
                                {tier.boost > 0 ? `(+${tier.boost}%)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Personal House */}
                <div>
                    <label
                        htmlFor="personalHouse"
                        className="block text-sm font-medium text-gray-300 mb-1"
                    >
                        Personal House
                    </label>
                    <select
                        id="personalHouse"
                        value={generalBuffs.personalHouse}
                        onChange={(e) =>
                            setGeneralBuff('personalHouse', e.target.value)
                        }
                        className="py-2 px-3 block w-full rounded-md bg-[#002020] border-gray-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {PERSONAL_HOUSE_TIERS.map((tier) => (
                            <option key={tier.value} value={tier.value}>
                                {tier.name}{' '}
                                {tier.boost > 0 ? `(+${tier.boost}%)` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Offer They Can't Refuse */}
                <div className="flex items-center">
                    <input
                        id="offerTheyCanRefuse"
                        type="checkbox"
                        checked={generalBuffs.offerTheyCanRefuse}
                        onChange={(e) =>
                            setGeneralBuff(
                                'offerTheyCanRefuse',
                                e.target.checked
                            )
                        }
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-600 rounded bg-[#002020]"
                    />
                    <label
                        htmlFor="offerTheyCanRefuse"
                        className="ml-2 block text-sm text-gray-300"
                    >
                        Offer They Can&apos;t Refuse (+10% gold)
                        {loading && (
                            <span className="ml-2 italic text-xs text-gray-400">
                                Checking...
                            </span>
                        )}
                    </label>
                </div>
            </div>
        </div>
    );
}
