"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaSearch,
  FaChartBar,
  FaCalculator,
  FaStore,
  FaListAlt,
  FaHome,
} from "react-icons/fa";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/", icon: <FaHome className="mr-1.5" />, text: "Dashboard" },
    { href: "/search", icon: <FaSearch className="mr-1.5" />, text: "Search" },
    {
      href: "/rankings",
      icon: <FaChartBar className="mr-1.5" />,
      text: "Rankings",
    },
    {
      href: "/calculator",
      icon: <FaCalculator className="mr-1.5" />,
      text: "Calculator",
    },
    {
      href: "/market",
      icon: <FaStore className="mr-1.5" />,
      text: "Market",
    },
    {
      href: "/logs",
      icon: <FaListAlt className="mr-1.5" />,
      text: "Logs",
    },
    // {
    //   href: "/next-skill",
    //   icon: <FaLevelUpAlt className="mr-1.5" />,
    //   text: "Next Skill",
    // },
  ];

  return (
    <nav className="bg-[#002020] shadow-md border-b border-[#2a2f3e] relative z-30">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 xl:px-32">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/new_logo.png"
                alt="logo idle clans"
                height={60}
                width={60}
                priority
              />
              <span className="text-emerald-400 font-bold text-xl">
                Idle Clans Hub
              </span>
            </Link>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  pathname === link.href
                    ? "text-emerald-300"
                    : "text-gray-200 hover:text-white hover:bg-[#003030]"
                }`}
              >
                {link.icon}
                {link.text}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger button */}
          <button
            className="md:hidden text-white p-2 rounded-lg transition-colors hover:bg-[#003333]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <RxCross2 className="w-6 h-6" />
            ) : (
              <RxHamburgerMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute w-full bg-[#002626] shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-40 ${
          isMobileMenuOpen ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block w-full px-3 py-3 rounded-md text-base font-medium ${
                pathname === link.href
                  ? "text-emerald-300"
                  : "text-gray-200 hover:text-white hover:bg-[#003333]"
              }`}
            >
              <div className="flex items-center">
                {link.icon}
                {link.text}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Overlay for clicking outside - positioned BEHIND the dropdown */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-30"
          style={{ backgroundColor: "transparent" }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
}
