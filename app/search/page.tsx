import SearchInterface from "@/components/search/SearchInterface";

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-[#031111] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <SearchInterface />
        </div>
      </div>
    </main>
  );
}
