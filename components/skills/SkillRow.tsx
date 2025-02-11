interface SkillRowProps {
  name: string;
  level: number;
  getSkillColor: (level: number) => string;
  formatSkillName: (name: string) => string;
}

export function SkillRow({
  name,
  level,
  getSkillColor,
  formatSkillName,
}: SkillRowProps) {
  return (
    <p className="ml-4">
      {formatSkillName(name)}:{" "}
      <span className={`${getSkillColor(level)} font-bold`}>{level}</span>
    </p>
  );
}
