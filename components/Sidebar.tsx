//hooks
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
//icons
import { FaHome, FaChartBar } from "react-icons/fa";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 text-white p-2 rounded-lg transition-colors bg-[#003333] hover:bg-[#004444]"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="menu-button"
      >
        {isOpen ? (
          <RxCross2 className="w-6 h-6" />
        ) : (
          <RxHamburgerMenu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 h-screen bg-[#002626] fixed left-0 top-0 p-4 border-r border-[#004444] transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="mb-8 mt-14 md:mt-0">
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
        </div>

        <nav className="space-y-4">
          <Link
            href="/"
            className={`flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#003333] p-2 rounded-lg transition-colors ${
              pathname === "/" ? "bg-[#003333] text-white" : ""
            }`}
            onClick={handleLinkClick}
          >
            <FaHome className="w-5 h-5" />
            <span>Home</span>
          </Link>

          <Link
            href="/ranking"
            className={`flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#003333] p-2 rounded-lg transition-colors ${
              pathname === "/ranking" ? "bg-[#003333] text-white" : ""
            }`}
            onClick={handleLinkClick}
          >
            <FaChartBar className="w-5 h-5" />
            <span>Ranking</span>
          </Link>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
