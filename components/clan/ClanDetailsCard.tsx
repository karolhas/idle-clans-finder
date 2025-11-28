"use client";

import { FaSignInAlt, FaBan, FaLanguage } from "react-icons/fa";
import { ClanData } from "@/types/clan.types";
import { CLAN_HOUSE_TIERS } from "@/utils/gamedata/calculator-constants";
import Image from "next/image";

interface ClanDetailsCardProps {
  clanData: ClanData;
}

export default function ClanDetailsCard({ clanData }: ClanDetailsCardProps) {
  const getHouseName = (houseId: number) => {
    if (!houseId && houseId !== 0) return "No House";
    const house = CLAN_HOUSE_TIERS[houseId + 1];
    return house ? house.name : "No House";
  };

  const getHouseImage = (houseId: number) => {
    if (!houseId && houseId !== 0) return null;
    const houseImages = {
      0: "/gameimages/guild_house_1.png",
      1: "/gameimages/guild_house_2.png",
      2: "/gameimages/guild_house_3.png",
      3: "/gameimages/guild_house_4.png",
      4: "/gameimages/guild_house_5.png",
      5: "/gameimages/guild_house_6.png",
    };
    return houseImages[houseId as keyof typeof houseImages] || null;
  };

  return (
    <div className="space-y-6">
      {/* Recruitment Message */}
      {clanData.recruitmentMessage && (
        <div className="bg-black/40 p-5 rounded-xl border border-white/5 backdrop-blur-sm">
          <h3 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Recruitment Message
          </h3>
          <p className="text-gray-300 text-sm italic leading-relaxed whitespace-pre-wrap">
            &quot;{clanData.recruitmentMessage}&quot;
          </p>
        </div>
      )}

      {/* Stats Card */}
      <div className="bg-black/40 p-5 rounded-xl border border-white/5 backdrop-blur-sm space-y-4">
        <h3 className="text-lg font-bold text-emerald-400 mb-4">Clan Stats</h3>

        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <div className="flex items-center gap-2 text-gray-400">
            <FaSignInAlt className="text-emerald-500/70" />
            <span>Min. Total Level</span>
          </div>
          <span className="text-white font-mono font-bold">
            {clanData.minimumTotalLevelRequired}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <div className="flex items-center gap-2 text-gray-400">
            {clanData.isRecruiting ? (
              <FaSignInAlt className="text-emerald-500/70" />
            ) : (
              <FaBan className="text-red-500/70" />
            )}
            <span>Recruiting</span>
          </div>
          <span
            className={`font-bold px-2 py-0.5 rounded text-xs ${
              clanData.isRecruiting
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {clanData.isRecruiting ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-white/5">
          <div className="flex items-center gap-2 text-gray-400">
            <FaLanguage className="text-emerald-500/70" />
            <span>Language</span>
          </div>
          <span className="text-white">{clanData.language}</span>
        </div>
      </div>

      {/* House Image */}
      <div className="bg-black/30 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        {getHouseImage(clanData.houseId || 0) ? (
          <div className="relative w-full h-36 z-0 mb-6 transform group-hover:scale-105 transition-transform duration-500">
            <Image
              src={getHouseImage(clanData.houseId || 0)!}
              alt={`${getHouseName(clanData.houseId || 0)} image`}
              fill
              className="object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          </div>
        ) : (
          <span className="text-gray-500 italic z-20">No Guild House</span>
        )}
        <div className="absolute bottom-4 left-0 right-0 text-center z-20">
          <span className="text-white font-bold text-lg drop-shadow-md">
            {getHouseName(clanData.houseId || 0)}
          </span>
        </div>
      </div>
    </div>
  );
}
