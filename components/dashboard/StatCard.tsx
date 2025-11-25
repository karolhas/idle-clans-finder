import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border-2 bg-white/5 p-6 shadow-lg border-emerald-600/20 hover:border-emerald-500/30 group">
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10"></div>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-gray-400 text-sm font-medium tracking-wide">
              {title}
            </p>
            <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 mt-1">
              {value}
            </h3>
          </div>
          {icon && (
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 group-hover:text-emerald-300 group-hover:border-emerald-500/30">
              {icon}
            </div>
          )}
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-2">
            {trend && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                {trend}
              </span>
            )}
            {subtitle && (
              <span className="text-gray-500 text-xs font-medium">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
