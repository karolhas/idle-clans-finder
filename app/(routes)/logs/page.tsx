import LogsViewer from "@/components/logs/LogsViewer";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function LogsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const sp = (await searchParams) ?? {};
  const rawQ = Array.isArray(sp.q) ? sp.q[0] : sp.q;
  const rawMode = Array.isArray(sp.mode) ? sp.mode[0] : sp.mode;

  const q = typeof rawQ === "string" ? rawQ : "";
  const mode = rawMode === "player" ? "player" : "clan";

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-6">
      <LogsViewer initialQuery={q} initialMode={mode} autoSearch />
    </div>
  );
}
