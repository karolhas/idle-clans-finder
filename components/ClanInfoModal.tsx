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
}: ClanInfoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (standalone) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, standalone]);

  const handleMemberClick = useCallback(
    (memberName: string) => {
      router.push(`/player/${encodeURIComponent(memberName)}`);
      if (!standalone) onClose();
    },
    [router, onClose, standalone]
  );

  if (!isOpen && !standalone) return null;

  const getRankTitle = (rank: number) => {
    switch (rank) {
      case 2: return 'Leader';
      case 1: return 'Deputy';
      default: return 'Member';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 2: return <FaCrown className="w-4 h-4 mr-2 text-yellow-400" />;
      case 1: return <FaUserTie className="w-4 h-4 mr-2 text-blue-400" />;
      default: return <FaUser className="w-4 h-4 mr-2 text-gray-400" />;
    }
  };

  const content = (
    <div
      ref={modalRef}
      className="bg-[#002626] p-6 rounded-lg border border-[#004444] max-w-4xl w-full mx-auto"
    >
      {!standalone && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-emerald-400">Clan Details</h2>
          <button
            onClick={onClose}
            className="text-gray-100 hover:text-white transition-colors"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Clan Name + Tag */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center">
  <FaShieldAlt className="mr-2 text-emerald-400" />
  <span>Clan Name:</span>
  {standalone ? (
    <span className="ml-2 text-white font-semibold">
      {clanName || 'No Clan'}
    </span>
  ) : (
    <span
      className="ml-2 text-white font-semibold cursor-pointer hover:text-emerald-400 hover:underline"
      onClick={() => router.push(`/clan/${encodeURIComponent(clanName)}`)}
    >
      {clanName || 'No Clan'}
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

      {/* Member List & Details */}
      <div className="md:grid md:grid-cols-2 md:gap-8">
        {/* Members */}
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
                  <span className="w-6 text-gray-400 mr-2">{index + 1}.</span>
                  {getRankIcon(member.rank)}
                  <span
                    className="text-white cursor-pointer hover:text-emerald-400 hover:underline"
                    onClick={() => handleMemberClick(member.memberName)}
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

        {/* Clan Details */}
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
                  clanData.isRecruiting ? 'text-green-400' : 'text-red-400'
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

  return standalone ? content : (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 overflow-y-auto">
      {content}
    </div>
  );
}
