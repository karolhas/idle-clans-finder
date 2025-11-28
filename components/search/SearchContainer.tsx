import { ReactNode } from "react";

interface SearchContainerProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function SearchContainer({
  children,
  title,
  description,
}: SearchContainerProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 mb-4 drop-shadow-sm">
          {title}
        </h1>
        <p className="text-gray-400 text-lg">{description}</p>
      </div>

      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 p-8 rounded-3xl border-2 border-white/5 bg-black/20 backdrop-blur-xl shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
