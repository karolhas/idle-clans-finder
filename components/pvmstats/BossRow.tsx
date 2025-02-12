//hooks
import Image from "next/image";

interface BossRowProps {
  name: string;
  kills: number;
  getBossColor: (kills: number) => string;
  formatBossName: (name: string) => string;
}

export function BossRow({
  name,
  kills,
  getBossColor,
  formatBossName,
}: BossRowProps) {
  return (
    <p className="ml-2 flex items-center gap-2">
      <Image
        src={`/pvmstats/${name.toLowerCase()}.png`}
        alt={formatBossName(name)}
        width={24}
        height={24}
        className="inline-block"
        priority
      />
      {formatBossName(name)}:{" "}
      <span className={`${getBossColor(kills)} font-semibold`}>
        {kills} {kills === 1 ? "kill" : "kills"}
      </span>
    </p>
  );
}
