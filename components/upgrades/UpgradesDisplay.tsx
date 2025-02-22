//components
import { UpgradeSection } from "./UpgradeSection";
//types
import { Upgrades } from "@/types/upgrades.types";
//utils
import {
  categorizeUpgrades,
  getMaxTiers,
  getImagePath,
} from "@/utils/upgrades/upgradeUtils";
import { formatUpgradeName } from "@/utils/upgrades/formatters/upgradeNameFormatter";

interface UpgradesDisplayProps {
  upgrades: Upgrades;
}

export default function UpgradesDisplay({ upgrades }: UpgradesDisplayProps) {
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
