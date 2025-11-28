"use client";

import { useState, useEffect } from "react";
import { useCalculator } from "./CalculatorContext";
import {
  CLAN_HOUSE_TIERS,
  PERSONAL_HOUSE_TIERS,
} from "@/utils/gamedata/calculator-constants";
import { fetchClanByName } from "@/lib/api/apiService";

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
          const hasOfferUpgrade = clanData.serializedUpgrades.includes("20");

          if (hasOfferUpgrade && !generalBuffs.offerTheyCanRefuse) {
            setGeneralBuff("offerTheyCanRefuse", true);
          }
        }
      } catch (error) {
        console.error("Error fetching clan upgrades:", error);
      } finally {
        setLoading(false);
      }
    };

    checkClanUpgrades();
  }, [state.clanName, setGeneralBuff]);

  return (
    <div className="bg-black/60 p-6 rounded-2xl border-2 border-white/10 relative backdrop-blur-md shadow-xl hover:border-teal-500/50 hover:shadow-teal-900/20 transition-all duration-300 group">
      <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
        General Buffs
      </h2>

      <div className="space-y-4">
        {/* Clan House */}
        <div>
          <label
            htmlFor="clanHouse"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Clan House
          </label>
          <select
            id="clanHouse"
            value={generalBuffs.clanHouse}
            onChange={(e) => setGeneralBuff("clanHouse", e.target.value)}
            className="w-full px-4 py-2.5 bg-black/90 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
          >
            {CLAN_HOUSE_TIERS.map((tier) => (
              <option key={tier.value} value={tier.value}>
                {tier.name} {tier.boost > 0 ? `(+${tier.boost}%)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Personal House */}
        <div>
          <label
            htmlFor="personalHouse"
            className="block text-sm font-medium text-gray-400 mb-2"
          >
            Personal House
          </label>
          <select
            id="personalHouse"
            value={generalBuffs.personalHouse}
            onChange={(e) => setGeneralBuff("personalHouse", e.target.value)}
            className="w-full px-4 py-2.5 bg-black/90 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
          >
            {PERSONAL_HOUSE_TIERS.map((tier) => (
              <option key={tier.value} value={tier.value}>
                {tier.name} {tier.boost > 0 ? `(+${tier.boost}%)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Offer They Can't Refuse */}
        <div className="flex items-center p-3 bg-black/60 rounded-lg border border-white/5">
          <input
            id="offerTheyCanRefuse"
            type="checkbox"
            checked={generalBuffs.offerTheyCanRefuse}
            onChange={(e) =>
              setGeneralBuff("offerTheyCanRefuse", e.target.checked)
            }
            className="h-4 w-4 text-teal-500 border-white/10 rounded focus:ring-teal-500/50 bg-black/60"
          />
          <label
            htmlFor="offerTheyCanRefuse"
            className="ml-3 block text-sm text-gray-300"
          >
            Offer They Can&apos;t Refuse (+10% gold)
            {loading && (
              <span className="ml-2 italic text-xs text-teal-500/70 animate-pulse">
                Checking...
              </span>
            )}
          </label>
        </div>
      </div>
    </div>
  );
}
