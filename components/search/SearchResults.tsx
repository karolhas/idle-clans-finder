'use client';
// hooks
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// api
import { fetchClanMembers } from '@/lib/api/apiService';
// components
import PvmStatsDisplay from '@/components/pvmstats/PvmStatsDisplay';
import SkillDisplay from '@/components/skills/SkillDisplay';
import UpgradesDisplay from '@/components/upgrades/UpgradesDisplay';
import ClanInfoModal from '@/components/modals/ClanInfoModal';
import AdvancedPlayerInfoModal from '@/components/modals/AdvancedPlayerInfoModal';

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


const router = useRouter();

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
        <div className="mt-8 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-6">
                    <div className="bg-white/5 p-6 rounded-2xl border-2 border-white/10 relative backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                        {tag && (
                            <span
                                className={`absolute top-0 right-0 px-4 py-2 ${tag.color} ${tag.border} text-white text-sm font-bold shadow-md flex items-center rounded-bl-xl rounded-tr-xl`}
                                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
                            >
                                <span className={`mr-1 ${player.username === 'Temsei' ? 'text-amber-300' : ''}`}>{tag.icon}</span>
                                {tag.label}
                            </span>
                        )}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                                Player Info
                            </h2>
                        </div>

                       {/* Player Information */}
						<p className="flex items-center mb-3 font-light text-gray-300">
						  <FaUser className="mr-2 text-emerald-500" /> Nickname:
						  <span className="text-white ml-2 font-semibold tracking-wide">
							{player.username}
						  </span>

						  {player.username && (
							<button
							  type="button"
							  onClick={(e) => {
								e.stopPropagation();
								router.push(`/logs?mode=player&q=${encodeURIComponent(player.username)}`);
							  }}
							  className="ml-3 text-xs px-2.5 py-1 rounded-md bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all duration-300"
							  title={`View ${player.username}'s clan logs`}
							  aria-label={`View ${player.username}'s clan logs`}
							>
							  Logs
							</button>
						  )}
						</p>

                        <p className="flex items-center mb-3 font-light text-gray-300">
                            <FaGamepad className="mr-2 text-emerald-500" /> Game Mode:
                            <span className="text-white ml-2 font-semibold tracking-wide">
                                {player.gameMode === 'default'
                                    ? 'Normal'
                                    : player.gameMode}
                            </span>
                        </p>
                        <p className="flex items-center mb-3 font-light text-gray-300">
                            <GiSwordsEmblem className="mr-2 text-emerald-500" /> Total Level:
                            <span className="text-white ml-2 font-semibold tracking-wide">
                                {Object.values(player.skillExperiences).reduce(
                                    (sum, exp) => sum + getLevel(exp),
                                    0
                                )}
                                /2400
                            </span>
                        </p>
                        <p className="flex items-center mb-3 font-light text-gray-300">
                            <GiAlarmClock className="mr-2 text-emerald-500" /> Time Offline:
                            <span className="text-white ml-2 font-semibold tracking-wide">
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
                        <p className="flex items-center font-light text-gray-300">
                            <GiWoodAxe className="mr-2 text-emerald-500" /> Last Known Task:
                            <span
                                style={{ textTransform: 'capitalize' }}
                                className="text-white ml-2 font-semibold tracking-wide"
                            >
                                {player.taskNameOnLogout
                                    ? player.taskNameOnLogout.replace(/_/g, ' ')
                                    : 'Unknown'}
                            </span>
                        </p>
                        <button
                            className="w-full mt-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-emerald-400 font-medium hover:bg-emerald-600 hover:text-white hover:border-emerald-500 transition-all duration-300 shadow-lg shadow-black/20"
                            onClick={() => setIsAdvancedModalOpen(true)}
                        >
                            View Advanced Info
                        </button>
                    </div>

                    <div
                        className="bg-white/5 p-6 rounded-2xl border-2 border-white/10 backdrop-blur-md shadow-xl cursor-pointer hover:bg-white/10 hover:border-emerald-500/50 hover:shadow-emerald-900/20 transition-all duration-300 group"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:text-emerald-300 transition-colors">
                                Clan Info
                            </h2>
                            <FaInfoCircle className="text-xl text-emerald-400 group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="flex items-center mb-3 font-light text-gray-300">
                            <FaShieldAlt className="mr-2 text-emerald-500" /> Clan:
                            <span className="text-white ml-2 font-semibold tracking-wide group-hover:text-emerald-300 transition-colors">
                                {player.guildName || 'No Clan'}
                            </span>
                        </p>
                        <p className="flex items-center font-light text-gray-300">
                            <FaUsers className="mr-2 text-emerald-500" /> Members:
                            <span className="text-white ml-2 font-semibold tracking-wide group-hover:text-emerald-300 transition-colors">
                                {memberCount}/20
                            </span>
                        </p>
                    </div>
                </div>

                <div className="col-span-1 md:col-span-2 xl:col-span-2">
                    <div className="bg-white/5 p-6 rounded-2xl border-2 border-white/10 h-full backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                        <h2 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                            PvM Stats
                        </h2>
                        <PvmStatsDisplay stats={player.pvmStats} />
                    </div>
                </div>
            </div>

            <div className="space-y-6 mt-6">
                <div className="bg-white/5 p-6 rounded-2xl border-2 border-white/10 backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                        Skills
                    </h2>
                    <p className="text-gray-300 mb-6">
                        Total XP:{' '}
                        <span className="font-bold text-emerald-400 text-lg">
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

                <div className="bg-white/5 p-6 rounded-2xl border-2 border-white/10 backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all duration-300">
                    <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
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
