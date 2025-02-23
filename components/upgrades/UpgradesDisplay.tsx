//components
import { UpgradeSection } from "./UpgradeSection";
//types
import { Upgrades } from "@/types/upgrades.types";
//utils
import { categorizeUpgrades } from "@/utils/upgrades/calculations/upgradeCategorizer";
import { getImagePath } from "@/utils/upgrades/formatters/upgradeImageFormatter";
import { formatUpgradeName } from "@/utils/upgrades/formatters/upgradeNameFormatter";
import { MAX_TIERS } from "@/utils/upgrades/constants/upgradeTiers";

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
        getMaxTiers={MAX_TIERS}
        getImagePath={getImagePath}
        formatUpgradeName={formatUpgradeName}
      />
      <UpgradeSection
        title="Skilling"
        upgrades={categorizedUpgrades.skilling}
        getMaxTiers={MAX_TIERS}
        getImagePath={getImagePath}
        formatUpgradeName={formatUpgradeName}
      />
      <UpgradeSection
        title="Combat"
        upgrades={categorizedUpgrades.combat}
        getMaxTiers={MAX_TIERS}
        getImagePath={getImagePath}
        formatUpgradeName={formatUpgradeName}
      />
      <UpgradeSection
        title="Unlocked with Items"
        upgrades={categorizedUpgrades.unlockedWithItems}
        getMaxTiers={MAX_TIERS}
        getImagePath={getImagePath}
        formatUpgradeName={formatUpgradeName}
      />
    </div>
  );
}
