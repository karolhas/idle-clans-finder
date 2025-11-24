import { FaUser, FaShieldAlt } from "react-icons/fa";

interface SearchTabsProps {
  activeTab: "player" | "clan";
  onTabChange: (tab: "player" | "clan") => void;
}

export default function SearchTabs({
  activeTab,
  onTabChange,
}: SearchTabsProps) {
  return (
    <div className="flex p-1 mb-8 rounded-2xl bg-black/20 border-2 border-white/5 backdrop-blur-md">
      <button
        onClick={() => onTabChange("player")}
        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
          activeTab === "player"
            ? "bg-emerald-600/90 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/50"
            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
        }`}
      >
        <FaUser
          className={`w-4 h-4 ${
            activeTab === "player" ? "text-emerald-200" : "text-gray-500"
          }`}
        />
        Player Search
      </button>
      <button
        onClick={() => onTabChange("clan")}
        className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
          activeTab === "clan"
            ? "bg-emerald-600/90 text-white shadow-[0_0_20px_rgba(16,185,129,0.2)] border border-emerald-500/50"
            : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
        }`}
      >
        <FaShieldAlt
          className={`w-4 h-4 ${
            activeTab === "clan" ? "text-emerald-200" : "text-gray-500"
          }`}
        />
        Clan Search
      </button>
    </div>
  );
}
