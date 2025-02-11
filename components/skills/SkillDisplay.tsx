import { SkillCard } from "./SkillCard";
import { useSkills } from "../../lib/useSkills";

interface SkillDisplayProps {
  skills: Record<string, number>;
}

export default function SkillDisplay({ skills }: SkillDisplayProps) {
  const { formattedSkills } = useSkills(skills);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {formattedSkills.map(({ skillName, xp, level, color }) => (
        <SkillCard
          key={skillName}
          skillName={skillName}
          xp={xp}
          level={level}
          color={color}
        />
      ))}
    </div>
  );
}
