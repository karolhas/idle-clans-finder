// hooks
import { useEffect, useState } from 'react';
// api
import { fetchClanMembers } from '@/lib/api/apiService';
// components
import PvmStatsDisplay from '@/components/pvmstats/PvmStatsDisplay';
import SkillDisplay from '@/components/skills/SkillDisplay';
import UpgradesDisplay from '@/components/upgrades/UpgradesDisplay';
import ClanInfoModal from '@/components/ClanInfoModal';
import AdvancedPlayerInfoModal from '@/components/AdvancedPlayerInfoModal';

// types
import { Player } from '@/types/player.types';
import { ClanData } from '@/types/clan.types';

// icons
import {
    FaGamepad,
    FaShieldAlt,
    FaUser,
    FaUsers,
    FaInfoCircle,
} from 'react-icons/fa';
import { GiSwordsEmblem, GiAlarmClock, GiWoodAxe } from 'react-icons/gi';
import { getLevel } from '@/utils/common/calculations/xpCalculations';

interface SearchResultsProps {
    player: Player;
    error?: string;
    onSearchMember?: (memberName: string) => void;
    onSearchClan?: (clanName: string) => void;
}

export default function SearchResults({
    player,
    error,
    onSearchMember,
    onSearchClan,
}: SearchResultsProps) {
    const [memberCount, setMemberCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);
    const [clanData, setClanData] = useState<ClanData | null>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            if (player.guildName) {
                try {
                    const data = await fetchClanMembers(player.guildName);
                    setMemberCount(data.memberlist?.length || 0);
                    setClanData(data);
                } catch (error) {
                    console.error('Failed to fetch clan members:', error);
                }
            }
        };

        fetchMembers();
    }, [player.guildName]);

    if (error) {
        return (
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg flex flex-col items-center space-y-4">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }    // Custom tag for special members
    const getPlayerTag = (name: string) => {
        switch (name) {            
            case 'Temsei':
                return { 
                    label: 'Game Dev',
                    color: 'bg-gradient-to-r from-slate-800 to-amber-900',
                    icon: '👑',
                    border: 'border-2 border-amber-400'
                };
            case 'HSK':
                return { 
                    label: 'Site Creator',
                    color: 'bg-gradient-to-r from-purple-600 to-fuchsia-500',
                    icon: '⚡',
                    border: 'border-2 border-purple-300'
                };
            case 'ZoEzi':
                return { 
                    label: 'Artist',
                    color: 'bg-gradient-to-r from-red-600 to-rose-500',
                    icon: '🎨',
                    border: 'border-2 border-red-300'
                };            
            case 'Shakkuru':
            case 'Dubz9':
                return { 
                    label: 'Site Helper',
                    color: 'bg-gradient-to-r from-blue-600 to-sky-500',
                    icon: '🔧',
                    border: 'border-2 border-blue-300'
                };
            case 'DonatorCasesHereKappaPride':
                return {

                    label: 'Donator',
                    color: 'bg-gradient-to-r from-emerald-600 to-green-500',
                    icon: '🪙',
                    border: 'border-2 border-green-300'
                };
            default:
                return null;
        }
    };

    const tag = getPlayerTag(player.username);

    return (
        <div className="mt-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">                    <div className="bg-[#002626] p-6 rounded-lg border border-[#004444] relative">                        {tag && (
                            <span
                                className={`absolute top-0 right-0 px-4 py-2 ${tag.color} ${tag.border} text-white text-sm font-bold shadow-md flex items-center`}
                                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
                            >                                <span className={`mr-1 ${player.username === 'Temsei' ? 'text-amber-300' : ''}`}>{tag.icon}</span>
                                {tag.label}
                            </span>
                        )}
                        <div className="mb-4">
                            <h2 className="text-2xl font-bold text-emerald-400">
                                Player Info
                            </h2>
                        </div>

                        {/* Player Information */}
                        <p className="flex items-center mb-2 font-light">
                            <FaUser className="mr-1" /> Nickname:
                            <span className="text-white ml-1 font-semibold">
                                {player.username}
                            </span>
                        </p>

                        <p className="flex items-center mb-2 font-light">
                            <FaGamepad className="mr-1" /> Game Mode:
                            <span className="text-white ml-1 font-semibold">
                                {player.gameMode === 'default'
                                    ? 'Normal'
                                    : player.gameMode}
                            </span>
                        </p>
                        <p className="flex items-center mb-2 font-light">
                            <GiSwordsEmblem className="mr-1" /> Total Level:
                            <span className="text-white ml-1 font-semibold">
                                {Object.values(player.skillExperiences).reduce(
                                    (sum, exp) => sum + getLevel(exp),
                                    0
                                )}
                                /2400
                            </span>
                        </p>
                        <p className="flex items-center mb-2 font-light">
                            <GiAlarmClock className="mr-1" /> Time Offline:
                            <span className="text-white ml-1 font-semibold">
                                {player.hoursOffline !== undefined ? (
                                    <>
                                        {Math.floor(player.hoursOffline)}h{' '}
                                        {Math.round(
                                            (player.hoursOffline % 1) * 60
                                        )}
                                        m
                                    </>
                                ) : (
                                    'Unknown'
                                )}
                            </span>
                        </p>
                        <p className="flex items-center font-light">
                            <GiWoodAxe className="mr-1" /> Last Known Task:
                            <span
                                style={{ textTransform: 'capitalize' }}
                                className="text-white ml-1 font-semibold"
                            >
                                {player.taskNameOnLogout
                                    ? player.taskNameOnLogout.replace(/_/g, ' ')
                                    : 'Unknown'}
                            </span>
                        </p>
                        <button
                            className="bg-emerald-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-emerald-600 transition"
                            onClick={() => setIsAdvancedModalOpen(true)}
                        >
                            View Advanced Info
                        </button>
                    </div>

                    <div
                        className="bg-[#002626] p-6 rounded-lg border border-[#004444] cursor-pointer hover:bg-[#003333] transition-colors"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-emerald-400">
                                Clan Info
                            </h2>
                            <FaInfoCircle className="text-xl text-emerald-400" />
                        </div>
                        <p className="flex items-center mb-2 font-light">
                            <FaShieldAlt className="mr-1" /> Clan:
                            <span className="text-white ml-1 font-semibold">
                                {player.guildName || 'No Clan'}
                            </span>
                        </p>
                        <p className="flex items-center font-light">
                            <FaUsers className="mr-1" /> Members:
                            <span className="text-white ml-1 font-semibold">
                                {memberCount}/20
                            </span>
                        </p>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 xl:col-span-2">
                    <div className="bg-[#002626] p-4 md:p-6 rounded-lg border border-[#004444] h-full">
                        <h2 className="text-2xl font-bold mb-4 text-emerald-400">
                            PvM Stats
                        </h2>
                        <PvmStatsDisplay stats={player.pvmStats} />
                    </div>
                </div>
            </div>

            <div className="space-y-8 mt-8">
                <div className="bg-[#002626] p-6 rounded-lg border border-[#004444]">
                    <h2 className="text-2xl font-bold mb-4 text-emerald-400">
                        Skills
                    </h2>
                    <p className="text-white mb-4">
                        Total XP:{' '}
                        <span className="font-semibold text-emerald-300">
                            {Math.floor(
                                Object.values(player.skillExperiences).reduce(
                                    (sum, xp) => sum + xp,
                                    0
                                )
                            ).toLocaleString()}
                        </span>
                    </p>
                    <SkillDisplay skills={player.skillExperiences} />
                </div>

                <div className="bg-[#002626] p-6 rounded-lg border border-[#004444]">
                    <h2 className="text-2xl font-bold mb-4 text-emerald-400">
                        Local Market Upgrades
                    </h2>
                    <UpgradesDisplay upgrades={player.upgrades} />
                </div>
            </div>

            <ClanInfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                clanName={player.guildName || 'No Clan'}
                memberCount={memberCount}
                clanData={
                    clanData || {
                        guildName: player.guildName || 'No Clan',
                        memberlist: [],
                        minimumTotalLevelRequired: 0,
                        isRecruiting: false,
                        recruitmentMessage: '',
                        language: 'English',
                    }
                }
                onSearchMember={onSearchMember}
                onSearchClan={onSearchClan}
            />

            <AdvancedPlayerInfoModal
                isOpen={isAdvancedModalOpen}
                onClose={() => setIsAdvancedModalOpen(false)}
                playerData={{
                    equipment: player.equipment || {},
                    enchantmentBoosts: player.enchantmentBoosts || {},
                }}
            />
        </div>
    );
}
