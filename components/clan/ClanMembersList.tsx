"use client";

import { FaUsers, FaCrown, FaUserTie, FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ClanData } from "@/types/clan.types";

interface ClanMembersListProps {
  clanData: ClanData;
  clanName: string;
  onSearchMember?: (memberName: string) => void;
  onClose?: () => void;
}

export default function ClanMembersList({
  clanData,
  clanName,
  onSearchMember,
  onClose,
}: ClanMembersListProps) {
  const router = useRouter();

  const handleMemberClick = (memberName: string) => {
    if (onSearchMember) {
      onSearchMember(memberName);
      if (onClose) onClose();
    } else {
      router.push(`/player/${encodeURIComponent(memberName)}`);
      if (onClose) onClose();
    }
  };

  const getRankTitle = (rank: number) => {
    switch (rank) {
      case 2:
        return "Leader";
      case 1:
        return "Deputy";
      default:
        return "Member";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 2:
        return <FaCrown className="w-4 h-4 text-amber-400" />;
      case 1:
        return <FaUserTie className="w-4 h-4 text-blue-400" />;
      default:
        return <FaUser className="w-4 h-4 text-emerald-500/50" />;
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 group-hover:text-teal-400 transition-colors flex items-center gap-2">
          <FaUsers className="text-emerald-500" />
          Members List
        </h3>
        {clanName && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/logs?mode=clan&q=${encodeURIComponent(clanName)}`);
              if (onClose) onClose();
            }}
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-800 hover:text-white transition-all duration-300"
          >
            View Clan Logs
          </button>
        )}
      </div>

      <div className="bg-black/30 rounded-xl border border-white/5 overflow-hidden">
        <div className="grid grid-cols-12 gap-2 p-3 bg-black/40 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-white/5">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-6">Name</div>
          <div className="col-span-4 text-right">Action</div>
        </div>
        <div className="max-h-[580px] overflow-y-auto custom-scrollbar">
          {Array.isArray(clanData.memberlist) &&
          clanData.memberlist.length > 0 ? (
            clanData.memberlist.map((member, index) => (
              <div
                key={member.memberName}
                className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                <div className="col-span-1 text-center text-gray-500 font-mono text-sm">
                  {index + 1}
                </div>
                <div className="col-span-1 flex justify-center">
                  <div className="tooltip" title={getRankTitle(member.rank)}>
                    {getRankIcon(member.rank)}
                  </div>
                </div>
                <div className="col-span-6 font-medium text-gray-200">
                  <span
                    className="cursor-pointer hover:text-emerald-400 transition-colors"
                    onClick={() => handleMemberClick(member.memberName)}
                  >
                    {member.memberName}
                  </span>
                  <span className="text-xs text-gray-500 ml-2 font-normal hidden sm:inline-block">
                    {getRankTitle(member.rank)}
                  </span>
                </div>
                <div className="col-span-4 text-right">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/logs?mode=player&q=${encodeURIComponent(
                          member.memberName
                        )}`
                      );
                      if (onClose) onClose();
                    }}
                    className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-emerald-600/20 text-gray-400 hover:text-emerald-400 border border-transparent hover:border-emerald-500/30 transition-all"
                  >
                    Logs
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No members found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
