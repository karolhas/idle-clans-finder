import Image from "next/image";

interface SkillCardProps {
  skillName: string;
  xp: number;
  level: number;
  color: string;
}

export function SkillCard({ skillName, xp, level, color }: SkillCardProps) {
  return (
    <div className="bg-[#002626] p-4 rounded-lg border border-[#004444] hover:bg-[#003333] transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <div className="relative w-5 h-5">
          <Image
            src={`/skills/${skillName}.png`}
            alt={`${skillName} icon`}
            fill
            sizes="20px"
            className="object-contain"
            priority
          />
        </div>
        <p className="text-gray-300 text-sm">
          {skillName.charAt(0).toUpperCase() + skillName.slice(1)}
        </p>
      </div>
      <p className={`text-xl font-bold ${color}`}>Level {level}</p>
      <p className="text-xs text-gray-400">
        {Math.floor(xp).toLocaleString()} XP
      </p>
    </div>
  );
}
