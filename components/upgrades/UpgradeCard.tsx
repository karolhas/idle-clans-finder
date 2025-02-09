import Image from "next/image";

interface UpgradeCardProps {
  name: string;
  value: number;
  maxTier: number;
  getImagePath: (name: string) => string;
  formatUpgradeName: (name: string) => string;
}

export function UpgradeCard({
  name,
  value,
  maxTier,
  getImagePath,
  formatUpgradeName,
}: UpgradeCardProps) {
  const getUpgradeColor = (value: number, maxTier: number): string => {
    const percentage = (value / maxTier) * 100;
    if (percentage === 100) return "text-red-500";
    if (percentage >= 75) return "text-purple-400";
    if (percentage >= 50) return "text-yellow-400";
    if (percentage >= 25) return "text-emerald-400";
    return "text-white";
  };

  const color = getUpgradeColor(value, maxTier);

  return (
    <div className="bg-[#002626] p-4 rounded-lg border border-[#004444] hover:bg-[#003333] transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <div className="relative w-5 h-5">
          <Image
            src={getImagePath(name)}
            alt={`${name} icon`}
            fill
            sizes="20px"
            className="object-contain"
            priority
          />
        </div>
        <p className="text-gray-300 text-sm">{formatUpgradeName(name)}</p>
      </div>
      <p className={`text-xl font-bold ${color}`}>
        {value >= maxTier ? "Max" : `Tier ${value}`}
      </p>
      <p className="text-xs text-gray-400">{`${value}/${maxTier} tiers`}</p>
    </div>
  );
}
