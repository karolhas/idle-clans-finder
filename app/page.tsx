"use client";

import {
  FaChartBar,
  FaCalculator,
  FaStore,
  FaListAlt,
  FaLevelUpAlt,
  FaSearch,
  FaUsers,
  FaTrophy,
  FaGlobe,
} from "react-icons/fa";
import { SiBuymeacoffee } from "react-icons/si";
import DashboardCard from "@/components/DashboardCard";
import StatCard from "@/components/StatCard";

export default function Home() {
  const stats = [
    {
      title: "Players Online",
      value: "624", // Mock data
      subtitle: "Playing",
      icon: <FaUsers className="w-5 h-5" />,
      trend: "Right Now",
    },
    {
      title: "All Time Peak",
      value: "911", // Mock data
      subtitle: "October 2025",
      icon: <FaTrophy className="w-5 h-5" />,
      trend: "New Record",
    },
    {
      title: "Website Visitors",
      value: "1.2k", // Mock data
      subtitle: "This month",
      icon: <FaGlobe className="w-5 h-5" />,
      trend: "+15%",
    },
  ];

  const tools = [
    {
      title: "Player & Clan Search",
      description:
        "Find players and view their stats, or search for clans to see their members and achievements.",
      icon: <FaSearch className="w-6 h-6" />,
      href: "/search",
      color: "emerald",
    },
    {
      title: "Rankings",
      description:
        "View top players and clans. Track progress and compete for the top spots on the leaderboards.",
      icon: <FaChartBar className="w-6 h-6" />,
      href: "/rankings",
      color: "emerald",
    },
    {
      title: "Calculator",
      description:
        "Optimize your gameplay with our XP and resource calculators. Plan your journey to max level.",
      icon: <FaCalculator className="w-6 h-6" />,
      href: "/calculator",
      color: "emerald",
    },
    {
      title: "Market",
      description:
        "Track item prices and find the best deals. Analyze market trends to maximize your profits.",
      icon: <FaStore className="w-6 h-6" />,
      href: "/market",
      color: "emerald",
    },
    {
      title: "Logs",
      description:
        "View detailed logs of your drops, kills, and other in-game activities.",
      icon: <FaListAlt className="w-6 h-6" />,
      href: "/logs",
      color: "emerald",
    },
    {
      title: "Next Skill",
      description:
        "Find out which skill you should train next based on efficiency and requirements.",
      icon: <FaLevelUpAlt className="w-6 h-6" />,
      href: "/next-skill",
      color: "emerald",
    },
  ];

  return (
    <main className="min-h-screen bg-[#031111] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#031111] to-[#031111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section 1: Hero/Info Card */}
        <div className="mb-12 relative overflow-hidden rounded-2xl border-2 border-emerald-700/30 bg-gradient-to-br from-[#001515] to-[#001212] p-8 md:p-12 text-center md:text-left shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-4 drop-shadow-lg">
              Idle Clans Hub
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6 drop-shadow-md">
              Your ultimate Idle Clans companion is here. Unlock the full
              potential of your game in one powerful, unified platform.
            </p>

            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start mb-6">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium shadow-[0_0_10px_rgba(249,115,22,0.1)]">
                Real-Time Data
              </span>
              <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                Tools & Resources
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium shadow-[0_0_10px_rgba(168,85,247,0.1)]">
                Community Driven
              </span>
            </div>

            <div className="flex justify-center md:justify-start">
              <a
                href="https://www.buymeacoffee.com/hskdev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#031111] border border-[#FFDD00]/40 text-[#FFDD00] hover:bg-[#FFDD00]/10 hover:border-[#FFDD00] hover:shadow-[0_0_15px_rgba(255,221,0,0.15)] transition-all duration-300 group shadow-lg shadow-[#FFDD00]/5"
              >
                <SiBuymeacoffee className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-medium">Buy me a coffee</span>
              </a>
            </div>
          </div>
        </div>

        {/* Section 2: Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Section 3: Quick Access */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <h2 className="text-2xl font-bold text-white">Quick Access</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-900/50 to-transparent" />
          </div>
          <p className="text-gray-400 mb-6 -mt-4">
            Select a feature to get started
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <DashboardCard key={tool.title} {...tool} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
