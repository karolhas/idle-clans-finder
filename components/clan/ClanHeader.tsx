"use client";

import { FaShieldAlt, FaUsers, FaHome } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { ClanData } from "@/types/clan.types";
import { CLAN_HOUSE_TIERS } from "@/utils/gamedata/calculator-constants";

interface ClanHeaderProps {
  clanName: string;
  memberCount: number;
  clanData: ClanData;
  onSearchClan?: (clanName: string) => void;
  onClose?: () => void;
}

export default function ClanHeader({
  clanName,
  memberCount,
  clanData,
  onSearchClan,
  onClose,
}: ClanHeaderProps) {
  const router = useRouter();

  const getHouseName = (houseId: number) => {
    if (!houseId && houseId !== 0) return "No House";
    const house = CLAN_HOUSE_TIERS[houseId + 1];
    return house ? house.name : "No House";
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 mt-12 border-b border-white/10 pb-6">
      <div className="w-full md:w-auto">
        <h2
          className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-cyan-300 cursor-pointer hover:opacity-80 transition-opacity flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3"
          onClick={() => {
            if (onSearchClan) {
              onSearchClan(clanName);
              if (onClose) onClose();
            } else {
              router.push(`/clan/${encodeURIComponent(clanName)}`);
              if (onClose) onClose();
            }
          }}
        >
          <div className="flex items-center gap-3">
            <FaShieldAlt className="text-emerald-500 flex-shrink-0" />
            <span>{clanName || "No Clan"}</span>
          </div>
          {clanData.tag && (
            <span className="text-teal-500/80 font-mono text-2xl">
              [{clanData.tag}]
            </span>
          )}
        </h2>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          <FaUsers className="text-emerald-500" />
          <span className="text-gray-400 text-sm">Members</span>
          <span className="text-white font-bold">{memberCount}/20</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
          <FaHome className="text-emerald-500" />
          <span className="text-gray-400 text-sm">House</span>
          <span className="text-white font-bold">
            {getHouseName(clanData.houseId || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
