import { SkillRow } from "./SkillRow";

interface SkillCategoryProps {
  title: string;
  skills: Record<string, number>;
  total: number;
  getSkillColor: (level: number) => string;
  formatSkillName: (name: string) => string;
}

export function SkillCategory({
  title,
  skills,
  total,
  getSkillColor,
  formatSkillName,
}: SkillCategoryProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-emerald-400 mb-2">
        {title} <span className="text-base">(total: {total})</span>
      </h3>
      <div className="space-y-1">
        {Object.entries(skills).map(([name, level]) => (
          <SkillRow
            key={name}
            name={name}
            level={level}
            getSkillColor={getSkillColor}
            formatSkillName={formatSkillName}
          />
        ))}
      </div>
    </div>
  );
}
