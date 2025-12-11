//hooks
import Image from 'next/image';
import React, { useState } from 'react';
import { WikiBossModal } from '../modals/WikiBossModal';
import { WikiClanBossModal } from '../modals/WikiClanBossModal';
import { WikiRaidModal } from '../modals/WikiRaidModal';

interface BossRowProps {
    name: string;
    kills: number;
    getBossColor: (kills: number) => string;
    formatBossName: (name: string) => string;
    isRaid?: boolean;
    isClanBoss?: boolean;
}

export function BossRow({
    name,
    kills,
    getBossColor,
    formatBossName,
    isRaid = false,
    isClanBoss = false,
}: BossRowProps) {
    const [selectedBoss, setSelectedBoss] = useState<string | null>(null);

    let label = 'kills';
    if (isRaid) {
        if (name === 'BloodmoonMassacre') {
            label = kills === 1 ? 'wave' : 'waves';
        } else {
            label = kills === 1 ? 'kill' : 'kills';
        }
    }

    const handleBossClick = () => {
        setSelectedBoss(formatBossName(name));
    };

    const handleCloseWiki = () => {
        setSelectedBoss(null);
    };
    return (
        <>
            <div 
                className="bg-white/5 rounded-lg p-2 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                onClick={handleBossClick}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Image
                                src={`/pvmstats/${name.toLowerCase().replace(/_/g, '')}.png`}
                                alt={formatBossName(name)}
                                width={28}
                                height={28}
                                className="rounded-md border border-white/20 group-hover:scale-110 transition-transform duration-200"
                                priority
                            />
                        </div>
                        <div>
                            <span className="text-white font-medium text-xs group-hover:text-emerald-300 transition-colors">
                                {formatBossName(name)}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className={`text-sm font-bold ${getBossColor(kills)}`}>
                            {kills.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400">
                            {label}
                        </span>
                    </div>
                </div>
            </div>

            {selectedBoss && !isClanBoss && (
                <WikiBossModal
                    isOpen={!!selectedBoss}
                    onClose={handleCloseWiki}
                    bossName={selectedBoss}
                />
            )}

            {selectedBoss && isClanBoss && (
                <WikiClanBossModal
                    isOpen={!!selectedBoss}
                    onClose={handleCloseWiki}
                    bossName={selectedBoss}
                />
            )}

            {selectedBoss && isRaid && (
                <WikiRaidModal
                    isOpen={!!selectedBoss}
                    onClose={handleCloseWiki}
                    raidName={selectedBoss}
                />
            )}
        </>
    );
}
