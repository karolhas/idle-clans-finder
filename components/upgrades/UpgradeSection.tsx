import { UpgradeCard } from "./UpgradeCard";

interface UpgradeSectionProps {
  title: string;
  upgrades: Record<string, number>;
  getMaxTiers: (name: string) => number;
  getImagePath: (name: string) => string;
  formatUpgradeName: (name: string) => string;
}

export function UpgradeSection({
  title,
  upgrades,
  getMaxTiers,
  getImagePath,
  formatUpgradeName,
}: UpgradeSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-emerald-400 mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(upgrades).map(([name, value]) => (
          <UpgradeCard
            key={name}
            name={name}
            value={value}
            maxTier={getMaxTiers(name)}
            getImagePath={getImagePath}
            formatUpgradeName={formatUpgradeName}
          />
        ))}
      </div>
    </div>
  );
}
