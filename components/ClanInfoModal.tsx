'use client';

import {
    FaShieldAlt,
    FaTimes,
    FaUsers,
    FaCrown,
    FaUser,
    FaUserTie,
} from 'react-icons/fa';
import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ClanData } from '@/types/clan.types';

interface ClanInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    clanName: string;
    memberCount: number;
    clanData: ClanData;
    standalone?: boolean;
    onSearchMember?: (memberName: string) => void;
}

export default function ClanInfoModal({
    isOpen,
    onClose,
    clanName,
    memberCount,
    clanData,
    standalone = false,
    onSearchMember,
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
                                router.push(
                                    `/clan/${encodeURIComponent(clanName)}`
                                );
                                onClose();
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
                    </div>
                </div>
            </div>
        </div>
    );

    return standalone ? (
        content
    ) : (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            {content}
        </div>
    );
}
