//hooks
import { useState } from "react";
//icons
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-5xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a player (nickname)"
        className="flex-1 px-4 py-2 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className={`px-4 py-2 bg-emerald-500 text-white rounded-lg transition-colors
          ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-emerald-600"
          }`}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <FaSearch className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}
