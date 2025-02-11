//components
import PvMStatsDisplay from "@/components/PvMStats/PvMStatsDisplay";
import SkillDisplay from "@/components/Skills/SkillDisplay";
import UpgradesDisplay from "./Upgrades/UpgradesDisplay";
//types
import { Player } from "@/types/player";
//icons
import { FaGamepad, FaShieldAlt, FaUser } from "react-icons/fa";

interface SearchResultsProps {
  player: Player;
  error?: string;
}

export default function SearchResults({ player, error }: SearchResultsProps) {
  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8">
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
            <p className="flex items-center font-light">
              <FaGamepad className="mr-1" /> Game Mode:{" "}
              <span className="text-white ml-1 font-semibold">
                {player.gameMode === "default" ? "Normal" : player.gameMode}
              </span>
            </p>
          </div>

          <div className="bg-[#002626] p-6 rounded-lg border border-[#004444]">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">
              Clan Info
            </h2>
            <p className="flex items-center font-light">
              <FaShieldAlt className="mr-1" /> Clan:{" "}
              <span className="text-white ml-1 font-semibold">
                {player.guildName || "No Clan"}
              </span>
            </p>
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="bg-[#002626] p-4 md:p-6 rounded-lg border border-[#004444]">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">
              PvM Stats
            </h2>
            <PvMStatsDisplay stats={player.pvmStats} />
          </div>
        </div>
      </div>

      <div className="space-y-8">
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
    </div>
  );
}
