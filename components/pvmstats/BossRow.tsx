//hooks
import Image from 'next/image';

interface BossRowProps {
    name: string;
    kills: number;
    getBossColor: (kills: number) => string;
    formatBossName: (name: string) => string;
    isRaid?: boolean;
}

export function BossRow({
    name,
    kills,
    getBossColor,
    formatBossName,
    isRaid = false,
}: BossRowProps) {
    let label = 'kills';
    if (isRaid) {
        if (name === 'BloodmoonMassacre') {
            label = 'wave';
        } else {
            label = kills === 1 ? 'kill' : 'kills';
        }
    }
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
            {formatBossName(name)}:{' '}
            <span className={`${getBossColor(kills)} font-semibold`}>
                {kills} {label}
            </span>
        </p>
    );
}
