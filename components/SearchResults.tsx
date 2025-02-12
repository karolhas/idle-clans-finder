//hooks
import { useEffect, useState } from "react";
//api
import { fetchClanMembers } from "@/services/apiService";
//components
import PvmStatsDisplay from "@/components/pvmstats/PvmStatsDisplay";
import SkillDisplay from "@/components/skills/SkillDisplay";
import UpgradesDisplay from "@/components/upgrades/UpgradesDisplay";
import ClanInfoModal from "@/components/ClanInfoModal";
//types
import { Player } from "@/types/player";
//icons
import {
  FaGamepad,
  FaShieldAlt,
  FaUser,
  FaUsers,
  FaInfoCircle,
} from "react-icons/fa";
import { GiSwordsEmblem } from "react-icons/gi";
import { getLevel } from "@/lib/xpUtils";

interface SearchResultsProps {
  player: Player;
  error?: string;
}

export default function SearchResults({ player, error }: SearchResultsProps) {
  const [memberCount, setMemberCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clanData, setClanData] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      if (player.guildName) {
        try {
          const data = await fetchClanMembers(player.guildName);
          setMemberCount(data.memberlist?.length || 0);
          setClanData(data);
        } catch (error) {
          console.error("Failed to fetch clan members:", error);
        }
      }
    };

    fetchMembers();
  }, [player.guildName]);

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-4">
          <div className="bg-[#002626] p-6 rounded-lg border border-[#004444]">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">
              Player Info
            </h2>
            <p className="flex items-center mb-2 font-light">
              <FaUser className="mr-1" /> Nickname:{" "}
              <span className="text-white ml-1 font-semibold">
                {player.username}
              </span>
            </p>
            <p className="flex items-center mb-2 font-light">
              <FaGamepad className="mr-1" /> Game Mode:{" "}
              <span className="text-white ml-1 font-semibold">
                {player.gameMode === "default" ? "Normal" : player.gameMode}
              </span>
            </p>
            <p className="flex items-center font-light">
              <GiSwordsEmblem className="mr-1" /> Total Level:{" "}
              <span className="text-white ml-1 font-semibold">
                {Object.values(player.skillExperiences).reduce(
                  (sum, exp) => sum + getLevel(exp),
                  0
                )}
                /2400
              </span>
            </p>
          </div>

          <div
            className="bg-[#002626] p-6 rounded-lg border border-[#004444] cursor-pointer hover:bg-[#003333] transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-emerald-400">Clan Info</h2>
              <FaInfoCircle className="text-xl text-emerald-400" />
            </div>
            <p className="flex items-center mb-2 font-light">
              <FaShieldAlt className="mr-1" /> Clan:{" "}
              <span className="text-white ml-1 font-semibold">
                {player.guildName || "No Clan"}
              </span>
            </p>
            <p className="flex items-center font-light">
              <FaUsers className="mr-1" /> Members:{" "}
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
          <h2 className="text-2xl font-bold mb-4 text-emerald-400">Skills</h2>
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
        clanName={player.guildName || "No Clan"}
        memberCount={memberCount}
        clanData={
          clanData || {
            memberlist: [],
            minimumTotalLevelRequired: 0,
            isRecruiting: false,
            recruitmentMessage: "",
            language: "English",
          }
        }
      />
    </div>
  );
}
