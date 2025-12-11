const bossesData = require('./bosses.json');
const clanBossesData = require('./clan_bosses.json');
const raidsData = require('./raids.json');

export interface ProcessedBossData {
  name: string;
  displayName: string;
  health: number;
  keyRequired: string;
  attackInterval: number;
  attackStyle: string;
  weakness: string;
  combatLevels: {
    attack: number;
    strength: number;
    defence: number;
    magic: number;
    archery: number;
  };
  bonuses: {
    melee: {
      strength: number;
      accuracy: number;
      defence: number;
    };
    archery: {
      strength: number;
      accuracy: number;
      defence: number;
    };
    magic: {
      strength: number;
      accuracy: number;
      defence: number;
    };
  };
  maxHit: string;
  requirements?: {
    normal: Record<string, number>;
    ironman: Record<string, number>;
  };
  drops: Array<{
    item: string;
    quantity: string;
    chance: string;
    value: string;
  }>;
}

export function getBossData(bossName: string): ProcessedBossData | null {
  const boss = bossesData.bosses.find((b: any) => b.name.toLowerCase() === bossName.toLowerCase());
  if (!boss) return null;

  return {
    name: boss.name,
    displayName: boss.displayName,
    health: boss.health,
    keyRequired: boss.keyRequired,
    attackInterval: boss.attackInterval,
    attackStyle: boss.attackStyle,
    weakness: boss.weakness,
    combatLevels: boss.combatLevels,
    bonuses: {
      melee: {
        strength: boss.bonuses.meleeStrength,
        accuracy: boss.bonuses.meleeAccuracy,
        defence: boss.bonuses.meleeDefence,
      },
      archery: {
        strength: boss.bonuses.archeryStrength,
        accuracy: boss.bonuses.archeryAccuracy,
        defence: boss.bonuses.archeryDefence,
      },
      magic: {
        strength: boss.bonuses.magicStrength,
        accuracy: boss.bonuses.magicAccuracy,
        defence: boss.bonuses.magicDefence,
      },
    },
    maxHit: boss.maxHit.toString(),
    drops: boss.drops,
  };
}

export function getClanBossData(bossName: string): ProcessedBossData | null {
  // Convert formatted name back to snake_case for matching
  const normalizedName = bossName.toLowerCase().replace(/\s+/g, '_');
  const boss = clanBossesData.clanBosses.find((b: any) => b.name.toLowerCase() === normalizedName);
  if (!boss) return null;

  return {
    name: boss.name,
    displayName: boss.displayName,
    health: boss.health,
    keyRequired: '', // Clan bosses don't have key requirements
    attackInterval: boss.attackInterval,
    attackStyle: boss.attackStyle,
    weakness: boss.weakness,
    combatLevels: boss.combatLevels,
    bonuses: {
      melee: {
        strength: boss.bonuses.meleeStrength,
        accuracy: boss.bonuses.meleeAccuracy,
        defence: boss.bonuses.meleeDefence,
      },
      archery: {
        strength: boss.bonuses.archeryStrength,
        accuracy: boss.bonuses.archeryAccuracy,
        defence: boss.bonuses.archeryDefence,
      },
      magic: {
        strength: boss.bonuses.magicStrength,
        accuracy: boss.bonuses.magicAccuracy,
        defence: boss.bonuses.magicDefence,
      },
    },
    maxHit: boss.maxHit.toString(),
    requirements: boss.requirements,
    drops: boss.drops,
  };
}

export function getRaidData(raidName: string): any {
  // Convert formatted name back to snake_case for matching
  const normalizedName = raidName.toLowerCase().replace(/\s+/g, '_');
  const raid = raidsData.raids.find((r: any) => r.name.toLowerCase() === normalizedName);
  return raid || null;
}

export function getAttackStyleName(attackStyle: string): string {
  const attackStyleMap: Record<string, string> = {
    'melee': 'Melee',
    'magic': 'Magic',
    'archery': 'Archery',
    'ranged': 'Ranged',
    'stab': 'Stab',
    'slash': 'Slash',
    'crush': 'Crush'
  };
  return attackStyleMap[attackStyle.toLowerCase()] || attackStyle;
}

export function getWeaknessName(weakness: string): string {
  const weaknessMap: Record<string, string> = {
    'melee': 'Melee',
    'magic': 'Magic',
    'archery': 'Archery',
    'ranged': 'Ranged',
    'stab': 'Stab',
    'slash': 'Slash',
    'crush': 'Crush'
  };
  return weaknessMap[weakness.toLowerCase()] || weakness;
}