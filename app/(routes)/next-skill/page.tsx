// app/(routes)/next-skill/page.tsx
import NextSkill from "@/components/next-skill/NextSkill";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function NextSkillPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};
  const rawPlayer = Array.isArray(sp.player) ? sp.player[0] : sp.player;
  const player = typeof rawPlayer === "string" ? rawPlayer : "";

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-6">
      <NextSkill initialPlayer={player} autoSearch />
    </div>
  );
}
