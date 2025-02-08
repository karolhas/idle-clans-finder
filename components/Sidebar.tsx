import { FaHome, FaChartBar } from "react-icons/fa";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#002626] fixed left-0 top-0 p-4 border-r border-[#004444]">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
      </div>

      <nav className="space-y-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#003333] p-2 rounded-lg transition-colors"
        >
          <FaHome className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/ranking"
          className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#003333] p-2 rounded-lg transition-colors"
        >
          <FaChartBar className="w-5 h-5" />
          <span>Ranking</span>
        </Link>
      </nav>
    </div>
  );
}
