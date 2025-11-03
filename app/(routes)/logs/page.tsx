import LogsViewer from "@/components/LogsViewer";

export default function LogsPage({
  searchParams,
}: {
  searchParams?: { q?: string; mode?: string };
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const mode = searchParams?.mode === "player" ? "player" : "clan";

  return (
    <div className="min-h-[calc(100vh-120px)] px-4 py-6">
      <LogsViewer initialQuery={q} initialMode={mode} autoSearch />
    </div>
  );
}
