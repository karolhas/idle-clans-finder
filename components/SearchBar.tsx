"use client";

import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get("search") as string;
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-5xl mx-auto">
      <input
        type="text"
        name="search"
        placeholder="Search for a player (nickname)"
        className="flex-1 px-4 py-1 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
      />
      <button
        type="submit"
        className="px-4 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
      >
        <FaSearch className="w-5 h-5" />
      </button>
    </form>
  );
}
