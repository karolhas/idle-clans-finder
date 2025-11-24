import Link from "next/link";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color?: string; // e.g., 'emerald'
}

export default function DashboardCard({
  title,
  description,
  icon,
  href,
  color = "emerald",
}: DashboardCardProps) {
  return (
    <Link
      href={href}
      className="group block h-full relative overflow-hidden rounded-xl border-2 border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20"
    >
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-600/10 blur-3xl transition-all group-hover:bg-emerald-500/20" />

      <div className="relative flex flex-col h-full">
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-${color}-500/10 text-${color}-400 group-hover:bg-${color}-500/20 group-hover:text-${color}-300 transition-colors`}
        >
          {icon}
        </div>

        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
          {title}
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
          {description}
        </p>

        <div className="mt-auto pt-4 flex items-center text-sm font-medium text-emerald-500 opacity-0 transform translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">
          Explore
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
