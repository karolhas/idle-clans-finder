import { UpgradeSection } from "./UpgradeSection";
import {
  categorizeUpgrades,
  formatUpgradeName,
  getMaxTiers,
  getImagePath,
} from "@/lib/upgradeUtils";
import { Upgrades } from "@/types/upgrades";

interface UpgradesDisplayProps {
  upgrades: Upgrades;
}

export function UpgradesDisplay({ upgrades }: UpgradesDisplayProps) {
  const categorizedUpgrades = categorizeUpgrades(upgrades);

  return (
    <div className="space-y-8">
      <UpgradeSection
        title="General"
        upgrades={categorizedUpgrades.general}
        getMaxTiers={getMaxTiers}
        getImagePath={getImagePath}
        formatUpgradeName={formatUpgradeName}
      />
      <UpgradeSection
        title="Skilling"
        upgrades={categorizedUpgrades.skilling}
        getMaxTiers={getMaxTiers}
        getImagePath={getImagePath}
        formatUpgradeName={formatUpgradeName}
      />
      <UpgradeSection
        title="Combat"
        upgrades={categorizedUpgrades.combat}
        getMaxTiers={getMaxTiers}
        getImagePath={getImagePath}
        formatUpgradeName={formatUpgradeName}
      />
      <UpgradeSection
        title="Unlocked with Items"
        upgrades={categorizedUpgrades.unlockedWithItems}
        getMaxTiers={getMaxTiers}
        getImagePath={getImagePath}
        formatUpgradeName={formatUpgradeName}
      />
    </div>
  );
}
