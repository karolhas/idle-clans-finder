"use client";

import Image from "next/image";

interface ClanUpgradesGridProps {
  serializedUpgrades: string | undefined;
}

export default function ClanUpgradesGrid({
  serializedUpgrades,
}: ClanUpgradesGridProps) {
  // Map of upgrade IDs to their names and image paths
  const upgradeMap: Record<string, { name: string; image: string }> = {
    "16": { name: "Get Up", image: "get_up" },
    "17": { name: "Strength In Numbers", image: "strength_in_numbers" },
    "18": { name: "Potioneering", image: "bigger_bottles" },
    "19": { name: "Group Effort", image: "group_effort" },
    "20": {
      name: "An Offer They Cant Refuse",
      image: "an_offer_they_cant_refuse",
    },
    "21": { name: "Yoink", image: "yoink" },
    "22": { name: "Bullseye", image: "bullseye" },
    "23": { name: "Gatherers", image: "gatherers" },
    "30": { name: "More Gathering", image: "gatherer_event_completions" },
    "31": { name: "No Time To Waste", image: "gatherer_event_cooldown" },
    "32": { name: "More Crafting", image: "crafting_event_completions" },
    "33": { name: "Gotta Get Crafting", image: "crafting_event_cooldown" },
    "35": { name: "Laid-back Events", image: "easy_events" },
    "37": { name: "Turkey Chasers", image: "turkey_chasers" },
    "38": { name: "Line The Turkeys Up", image: "line_the_turkeys_up" },
    "51": { name: "Keep em` Coming", image: "auto_clan_boss" },
    "52": { name: "Clan Boss Slayers", image: "clan_boss_boost" },
    "54": { name: "Ways Of The Genie", image: "ways_of_the_genie" },
  };

  const parseUpgrades = (serializedUpgrades: string | undefined) => {
    if (!serializedUpgrades) return {};

    try {
      const upgrades: Record<string, number> = {};
      Object.values(upgradeMap).forEach(({ name }) => {
        upgrades[name] = 0;
      });
      const upgradeIds = serializedUpgrades
        .replace(/[\[\]]/g, "")
        .split(",")
        .map((id) => id.trim());

      upgradeIds.forEach((id) => {
        const upgrade = upgradeMap[id];
        if (upgrade) {
          upgrades[upgrade.name] = 1;
        }
      });
      return upgrades;
    } catch (err) {
      console.error("Error parsing upgrades:", err);
      return {};
    }
  };

  if (!serializedUpgrades) return null;

  return (
    <div className="bg-white/5 p-6 md:p-8 rounded-2xl border-2 border-white/10 backdrop-blur-xl shadow-xl hover:border-teal-500/50 hover:shadow-teal-900/20 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors">
          Clan Upgrades
        </h3>
        <span className="text-xs font-mono text-gray-200 bg-emerald-900 px-2 py-1 rounded">
          {
            Object.values(parseUpgrades(serializedUpgrades)).filter(
              (v) => v === 1
            ).length
          }{" "}
          Unlocked
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(parseUpgrades(serializedUpgrades)).map(
          ([name, tier]) => {
            const upgradeInfo = Object.values(upgradeMap).find(
              (u) => u.name === name
            );
            const imageName =
              upgradeInfo?.image || name.toLowerCase().replace(/\s+/g, "_");
            const isUnlocked = tier === 1;

            return (
              <div
                key={name}
                className={`
                  relative p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300 group
                  ${
                    isUnlocked
                      ? "bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:border-emerald-500/50"
                      : "bg-white/5 border-white/5 opacity-60 grayscale hover:opacity-80 hover:grayscale-0"
                  }
                `}
              >
                {isUnlocked && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                )}

                <div className="relative w-12 h-12 mb-3 transform group-hover:scale-110 transition-transform">
                  <Image
                    src={`/gameimages/clan_upgrade_${imageName}.png`}
                    alt={name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <p
                  className={`font-semibold text-xs leading-tight ${
                    isUnlocked ? "text-gray-100" : "text-gray-500"
                  }`}
                >
                  {name}
                </p>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

