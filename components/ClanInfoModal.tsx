'use client';

import {
    FaShieldAlt,
    FaTimes,
    FaUsers,
    FaCrown,
    FaUser,
    FaUserTie,
    FaHome,
} from 'react-icons/fa';
import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ClanData } from '@/types/clan.types';
import { CLAN_HOUSE_TIERS } from '@/utils/gamedata/calculator-constants';
import Image from 'next/image';

interface ClanInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    clanName: string;
    memberCount: number;
    clanData: ClanData;
    standalone?: boolean;
    onSearchMember?: (memberName: string) => void;
    onSearchClan?: (clanName: string) => void;
}

export default function ClanInfoModal({
    isOpen,
    onClose,
    clanName,
    memberCount,
    clanData,
    standalone = false,
    onSearchMember,
    onSearchClan,
}: ClanInfoModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Handle outside click to close modal (only in popup mode)
    useEffect(() => {
        if (!isOpen || standalone) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (
                modalRef.current &&
                !modalRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, standalone]);

    const handleMemberClick = useCallback(
        (memberName: string) => {
            if (onSearchMember) {
                onSearchMember(memberName);
                if (!standalone) onClose();
            } else {
                router.push(`/player/${encodeURIComponent(memberName)}`);
                if (!standalone) onClose();
            }
        },
        [onSearchMember, standalone, router, onClose]
    );

    const getRankTitle = (rank: number) => {
        switch (rank) {
            case 2:
                return 'Leader';
            case 1:
                return 'Deputy';
            default:
                return 'Member';
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 2:
                return <FaCrown className="w-4 h-4 mr-2 text-yellow-400" />;
            case 1:
                return <FaUserTie className="w-4 h-4 mr-2 text-blue-400" />;
            default:
                return <FaUser className="w-4 h-4 mr-2 text-gray-400" />;
        }
    };

    const getHouseName = (houseId: number) => {
        const house = CLAN_HOUSE_TIERS[houseId];
        return house ? house.name : 'No House';
    };

    const getHouseImage = (houseId: number) => {
        // Map houseId to the correct guild house image
        // houseId 0 = no house, 1-6 = T1-T6
        if (houseId <= 0) return '/gameimages/guild_house_1.png'; // Default to T1 if no house
        return `/gameimages/guild_house_${houseId}.png`;
    };

    // Map of upgrade IDs to their names and image paths
    const upgradeMap: Record<string, { name: string; image: string }> = {
        '16': { name: 'Get Up', image: 'get_up' },
        '17': { name: 'Strength In Numbers', image: 'strength_in_numbers' },
        '18': { name: 'Potioneering', image: 'bigger_bottles' },
        '19': { name: 'Group Effort', image: 'group_effort' },
        '20': { name: 'An Offer They Cant Refuse', image: 'an_offer_they_cant_refuse' },
        '21': { name: 'Yoink', image: 'yoink' },
        '22': { name: 'Bullseye', image: 'bullseye' },
        '23': { name: 'Gatherers', image: 'gatherers' },
        '30': { name: 'More Gathering', image: 'gatherer_event_completions' },
        '31': { name: 'No Time To Waste', image: 'gatherer_event_cooldown' },
        '32': { name: 'More Crafting', image: 'crafting_event_completions' },
        '33': { name: 'Gotta Get Crafting', image: 'crafting_event_cooldown' },
        '35': { name: 'Laid-back Events', image: 'easy_events' },
        '37': { name: 'Turkey Chasers', image: 'turkey_chasers' },
        '38': { name: 'Line The Turkeys Up', image: 'line_the_turkeys_up' },
        '51': { name: 'Keep em` Coming', image: 'auto_clan_boss' },
        '52': { name: 'Clan Boss Slayers', image: 'clan_boss_boost' },
        '54': { name: 'Ways Of The Genie', image: 'ways_of_the_genie' }
    };

    const parseUpgrades = (serializedUpgrades: string | undefined) => {
        if (!serializedUpgrades) return {};
        
        try {
            const upgrades: Record<string, number> = {};
            
            // Initialize all upgrades as locked (0)
            Object.values(upgradeMap).forEach(({ name }) => {
                upgrades[name] = 0;
            });
            
            // Parse the serialized upgrades string
            const upgradeIds = serializedUpgrades.replace(/[\[\]]/g, '').split(',').map(id => id.trim());
            
            // Mark unlocked upgrades (1)
            upgradeIds.forEach(id => {
                const upgrade = upgradeMap[id];
                if (upgrade) {
                    upgrades[upgrade.name] = 1;
                }
            });
            
            return upgrades;
        } catch (err) {
            console.error('Error parsing upgrades:', err);
            return {};
        }
    };

    if (!isOpen && !standalone) return null;

    const content = (
        <div
            ref={modalRef}
            className="relative bg-[#002626] p-6 md:p-8 rounded-lg border border-[#004444] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl"
        >
            {/* Close Button for Modal */}
            {!standalone && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white hover:text-red-400 z-20"
                    aria-label="Close"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
            )}

            {/* Clan Info Header */}
            <div className="mb-6 space-y-4">
                <div className="flex items-center flex-wrap">
                    <FaShieldAlt className="mr-2 text-emerald-400" />
                    <span>Clan Name:</span>
                    <span
                        className={`ml-2 font-semibold ${
                            !standalone
                                ? 'cursor-pointer text-white hover:text-emerald-400 hover:underline'
                                : 'text-white'
                        }`}
                        onClick={() => {
                            if (!standalone) {
                                if (onSearchClan) {
                                    onSearchClan(clanName);
                                    onClose();
                                } else {
                                    router.push(
                                        `/clan/${encodeURIComponent(clanName)}`
                                    );
                                    onClose();
                                }
                            }
                        }}
                    >
                        {clanName || 'No Clan'}
                    </span>
                    {standalone && clanData.tag && (
                        <span className="ml-2 px-2 py-0.5 text-sm bg-emerald-700 text-white rounded-lg">
                            {clanData.tag}
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    <FaUsers className="mr-2 text-emerald-400" />
                    <span>Members:</span>
                    <span className="ml-2 text-white font-semibold">
                        {memberCount}/20
                    </span>
                </div>
                <div className="flex items-center">
                    <FaHome className="mr-2 text-emerald-400" />
                    <span>Guild House:</span>
                    <span className="ml-2 text-white font-semibold">
                        {getHouseName(clanData.houseId || 0)}
                    </span>
                </div>
            </div>

            {/* Columns */}
            <div className="md:grid md:grid-cols-2 md:gap-8">
                {/* Member List */}
                <div>
                    <h3 className="text-xl font-bold text-emerald-400 mb-2">
                        Members List
                    </h3>
                    <div className="space-y-1">
                        {Array.isArray(clanData.memberlist) &&
                            clanData.memberlist.map((member, index) => (
                                <div
                                    key={member.memberName}
                                    className="flex items-center text-right"
                                >
                                    <span className="w-6 text-gray-400 mr-2">
                                        {index + 1}.
                                    </span>
                                    {getRankIcon(member.rank)}
                                    <span
                                        className="text-white cursor-pointer hover:text-emerald-400 hover:underline"
                                        onClick={() =>
                                            handleMemberClick(member.memberName)
                                        }
                                    >
                                        {member.memberName}
                                    </span>
                                    <span className="ml-2 text-gray-400">
                                        - {getRankTitle(member.rank)}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>

                {/* Details */}
                <div>
                    <h3 className="text-xl font-bold text-emerald-400 mb-2 mt-6 md:mt-0">
                        Clan Details
                    </h3>
                    <div className="space-y-4">
                        {clanData.recruitmentMessage && (
                            <div className="bg-[#003333] p-4 rounded-lg">
                                <h3 className="text-base font-semibold text-emerald-400 mb-2">
                                    Recruitment Message
                                </h3>
                                <p className="text-gray-200 whitespace-pre-wrap">
                                    {clanData.recruitmentMessage}
                                </p>
                            </div>
                        )}
                        <div className="flex items-center">
                            <span>Min. Total Level:</span>
                            <span className="ml-2 text-white font-semibold">
                                {clanData.minimumTotalLevelRequired}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span>Recruiting:</span>
                            <span
                                className={`ml-2 font-semibold ${
                                    clanData.isRecruiting
                                        ? 'text-green-400'
                                        : 'text-red-400'
                                }`}
                            >
                                {clanData.isRecruiting ? 'Yes' : 'No'}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span>Language:</span>
                            <span className="ml-2 text-white font-semibold">
                                {clanData.language}
                            </span>
                        </div>
                        <div className="flex justify-center items-center mt-6">
                            <div className="relative w-64 h-64">
                                <Image
                                    src={getHouseImage(clanData.houseId || 0)}
                                    alt={`${getHouseName(clanData.houseId || 0)} image`}
                                    fill
                                    className="object-contain"
                                    sizes="192px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return standalone ? (
        <div className="space-y-8">
            {content}
            {/* Clan Upgrades */}
            {clanData.serializedUpgrades && (
                <div className="bg-[#002626] p-6 rounded-lg border border-[#004444]">
                    <h3 className="text-xl font-bold text-emerald-400 mb-4">
                        Clan Upgrades
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {Object.entries(parseUpgrades(clanData.serializedUpgrades)).map(([name, tier]) => {
                            // Find the upgrade info for this name
                            const upgradeInfo = Object.values(upgradeMap).find(u => u.name === name);
                            const imageName = upgradeInfo?.image || name.toLowerCase().replace(/\s+/g, '_');
                            
                            return (
                                <div
                                    key={name}
                                    className={`bg-[#003333] p-4 rounded-lg border border-[#004444] flex flex-col items-center ${
                                        tier === 1 ? 'opacity-50' : 'opacity-100'
                                    }`}
                                >
                                    <div className="relative w-10 h-10 mb-2">
                                        <Image
                                            src={`/gameimages/clan_upgrade_${imageName}.png`}
                                            alt={name}
                                            fill
                                            sizes="40px"
                                            className="object-contain"
                                        />
                                    </div>
                                    <p className="text-white font-semibold text-sm mb-1 text-center">
                                        {name}
                                    </p>
                                    <p className="text-emerald-300 text-sm">
                                        {tier === 1 ? 'Unlocked' : 'Locked'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    ) : (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            {content}
        </div>
    );
}
