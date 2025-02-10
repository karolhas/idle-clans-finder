import Image from "next/image";
import { PvMStats } from "@/types/pvmStats";

interface PvMStatsDisplayProps {
  stats: PvMStats;
}

export default function PvMStatsDisplay({ stats }: PvMStatsDisplayProps) {
  const formatBossName = (name: string): string => {
    return name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const getBossColor = (kills: number): string => {
    if (kills >= 100) return "text-red-500";
    if (kills >= 50) return "text-purple-400";
    if (kills >= 25) return "text-yellow-400";
    if (kills >= 10) return "text-emerald-400";
    return "text-white";
  };

  // Categorize bosses
  const categorizedBosses = Object.entries(stats).reduce(
    (acc, [name, kills]) => {
      if (name === "ReckoningOfTheGods" || name === "GuardiansOfTheCitadel") {
        acc.raids[name] = kills;
      } else if (
        ["MalignantSpider", "SkeletonWarrior", "OtherworldlyGolem"].includes(
          name
        )
      ) {
        acc.clanBosses[name] = kills;
      } else {
        acc.bosses[name] = kills;
      }
      return acc;
    },
    { raids: {}, bosses: {}, clanBosses: {} } as {
      raids: Record<string, number>;
      bosses: Record<string, number>;
      clanBosses: Record<string, number>;
    }
  );

  // Calculate summaries
  const raidTotal = Object.values(categorizedBosses.raids).reduce(
    (a, b) => a + b,
    0
  );
  const bossTotal = Object.values(categorizedBosses.bosses).reduce(
    (a, b) => a + b,
    0
  );
  const clanBossTotal = Object.values(categorizedBosses.clanBosses).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-3 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-emerald-400 mb-2">
            Raids <span className="text-base">(total: {raidTotal})</span>
          </h3>
          <div className="space-y-1">
            {Object.entries(categorizedBosses.raids).map(([name, kills]) => (
              <p key={name} className="ml-4 flex items-center gap-2">
                <Image
                  src={`/pvmstats/${name}.png`}
                  alt={formatBossName(name)}
                  width={20}
                  height={20}
                  className="inline-block"
                />
                {formatBossName(name)}:{" "}
                <span className={`${getBossColor(kills)} font-bold`}>
                  {kills} {kills === 1 ? "clear" : "clears"}
                </span>
              </p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-emerald-400 mb-2">
            Clan bosses{" "}
            <span className="text-base">(total: {clanBossTotal})</span>
          </h3>
          <div className="space-y-1">
            {Object.entries(categorizedBosses.clanBosses).map(
              ([name, kills]) => (
                <p key={name} className="ml-4 flex items-center gap-2">
                  <Image
                    src={`/pvmstats/${name}.png`}
                    alt={formatBossName(name)}
                    width={24}
                    height={24}
                    className="inline-block"
                  />
                  {formatBossName(name)}:{" "}
                  <span className={`${getBossColor(kills)} font-bold`}>
                    {kills} kills
                  </span>
                </p>
              )
            )}
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <div>
          <h3 className="text-xl font-bold text-emerald-400 mb-2">
            Boss kills <span className="text-base">(total: {bossTotal})</span>
          </h3>
          <div className="space-y-1">
            {Object.entries(categorizedBosses.bosses).map(([name, kills]) => (
              <p key={name} className="ml-4 flex items-center gap-2">
                <Image
                  src={`/pvmstats/${name}.png`}
                  alt={formatBossName(name)}
                  width={24}
                  height={24}
                  className="inline-block"
                />
                {formatBossName(name)}:{" "}
                <span className={`${getBossColor(kills)} font-bold`}>
                  {kills} kills
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
