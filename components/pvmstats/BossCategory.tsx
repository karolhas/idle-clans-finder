//components
import { BossRow } from '@/components/pvmstats/BossRow';

interface BossCategoryProps {
    title: string;
    bosses: Record<string, number>;
    total: number;
    getBossColor: (kills: number) => string;
    formatBossName: (name: string) => string;
}

export function BossCategory({
    title,
    bosses,
    total,
    getBossColor,
    formatBossName,
}: BossCategoryProps) {
    const isRaid = title.toLowerCase().includes('raid');
    const isClanBoss = title.toLowerCase().includes('clan');

    // Sort bosses by kill count (highest first) for better visual hierarchy
    const sortedBosses = Object.entries(bosses).sort(([, a], [, b]) => b - a);

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    {title}
                </h3>
            </div>
            <div className="grid gap-1.5">
                {sortedBosses.map(([name, kills]) => (
                    <BossRow
                        key={name}
                        name={name}
                        kills={kills}
                        getBossColor={getBossColor}
                        formatBossName={formatBossName}
                        isRaid={isRaid}
                        isClanBoss={isClanBoss}
                    />
                ))}
            </div>
        </div>
    );
}
