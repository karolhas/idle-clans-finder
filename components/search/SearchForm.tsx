import { FaSearch, FaTimes } from "react-icons/fa";
import { FormEvent } from "react";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (query: string) => void;
  placeholder: string;
  isLoading: boolean;
}

export default function SearchForm({
  searchQuery,
  setSearchQuery,
  onSearch,
  placeholder,
  isLoading,
}: SearchFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-14 pr-32 py-5 bg-[#0a1f1f]/80 border-2 border-white/10 rounded-2xl text-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all duration-300 backdrop-blur-xl shadow-inner"
            disabled={isLoading}
          />
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-400 transition-colors duration-300">
            <FaSearch className="w-6 h-6" />
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-28 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-red-400 transition-colors"
            >
              <FaTimes />
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
              isLoading || !searchQuery.trim()
                ? "bg-white/5 text-gray-500 cursor-not-allowed"
                : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 hover:scale-105"
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
