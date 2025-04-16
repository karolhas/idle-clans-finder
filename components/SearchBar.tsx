'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ Next.js navigation
import { FaSearch, FaTimes } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  searchQuery?: string;
}

export default function SearchBar({
  onSearch,
  isLoading,
  searchQuery,
}: SearchBarProps) {
  const [query, setQuery] = useState(searchQuery || '');
  const router = useRouter(); // ✅

  useEffect(() => {
    if (searchQuery !== undefined) {
      setQuery(searchQuery);
    }
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // ✅ Update URL via Next.js router
    router.push(`/?player=${encodeURIComponent(trimmed)}`);

    onSearch(trimmed);
  };

  const handleClear = () => {
    setQuery('');
    // Optional: clear URL here if you want
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-5xl">
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a player or @clan (nickname)"
          className="w-full px-4 py-2 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          disabled={isLoading}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className={`px-4 py-2 bg-emerald-500 text-white rounded-lg transition-colors cursor-pointer
          ${isLoading ? 'opacity-50' : 'hover:bg-emerald-600'}`}
        aria-label="search-button"
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
