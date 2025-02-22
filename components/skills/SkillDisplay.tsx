//components
import { SkillCard } from "./SkillCard";
//utils
import { formatSkills } from "@/utils/skills/formatters/skillFormatter";

interface SkillDisplayProps {
  skills: Record<string, number>;
}
export default function SkillDisplay({ skills }: SkillDisplayProps) {
  const formattedSkills = formatSkills(skills);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {formattedSkills.map(
        ({
          skillName,
          xp,
          level,
          color,
        }: {
          skillName: string;
          xp: number;
          level: number;
          color: string;
        }) => (
          <SkillCard
            key={skillName}
            skillName={skillName}
            xp={xp}
            level={level}
            color={color}
          />
        )
      )}
    </div>
  );
}
