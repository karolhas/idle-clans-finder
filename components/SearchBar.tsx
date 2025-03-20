import { useState, useEffect, useRef } from 'react';
//icons
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  searchResult: string | null; // Pass search result (null if not found)
}

export default function SearchBar({ onSearch, isLoading, searchResult }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isRecentSearchesVisible, setIsRecentSearchesVisible] = useState(false); // Toggle for Recent Searches dropdown
  const searchBarRef = useRef<HTMLDivElement>(null); // Reference to the search bar container
  const recentSearchesRef = useRef<HTMLDivElement>(null); // Reference to the recent searches dropdown

  // Load recent searches from localStorage
  useEffect(() => {
    const storedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(storedSearches);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current && !searchBarRef.current.contains(event.target as Node) &&
        recentSearchesRef.current && !recentSearchesRef.current.contains(event.target as Node)
      ) {
        setIsRecentSearchesVisible(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    onSearch(trimmedQuery);

    // Only update recent searches if the search result is NOT null
    // We'll check for the actual result before saving to recent searches
    if (searchResult !== null && searchResult !== 'Player not found') {
      const updatedSearches = [trimmedQuery, ...recentSearches.filter((q) => q !== trimmedQuery)].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }

    setQuery(''); // Clear the search bar after submitting the search
    setIsRecentSearchesVisible(false); // Hide the dropdown after search submission
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
  };

  const handleSearchClick = (search: string) => {
    onSearch(search);
    setQuery(''); // Clear the search bar after clicking on a recent search
    setIsRecentSearchesVisible(false); // Hide the dropdown after selecting a recent search
  };

  const toggleRecentSearches = () => {
    setIsRecentSearchesVisible(!isRecentSearchesVisible); // Toggle visibility of the recent searches section
  };

  const handleClearSearchHistory = () => {
    localStorage.removeItem('recentSearches'); // Remove searches from localStorage
    setRecentSearches([]); // Clear the recent searches from state
    setIsRecentSearchesVisible(false); // Hide the dropdown after clearing
  };

  const handleRemoveSearch = (search: string) => {
    const updatedSearches = recentSearches.filter((s) => s !== search);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches)); // Update localStorage
  };

  return (
    <div className="max-w-5xl mx-auto flex gap-8 relative" ref={searchBarRef}>
      {/* Search Bar */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Search for a player (nickname)"
            className="w-full px-4 py-2 border text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            disabled={isLoading}
          />
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
      </div>

      {/* Tab to Toggle Recent Searches Visibility */}
      <div className="flex items-center justify-center">
        <button
          onClick={toggleRecentSearches}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none"
        >
          Recent Searches
        </button>
      </div>

      {/* Recent Searches Section (Fixed Position at the Right, Stays at the Top) */}
      {isRecentSearchesVisible && (
        <div
          className="absolute right-0 top-0 w-64 bg-gray-100 p-4 rounded-lg shadow-md"
          ref={recentSearchesRef}
        >
          <h3 className="text-lg font-semibold mb-2 text-black underline">Recent Searches</h3>
          <ul>
            {recentSearches.length > 0 ? (
              recentSearches.map((search, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center px-4 py-2 text-black hover:bg-gray-200 cursor-pointer rounded-lg"
                >
                  <span onClick={() => handleSearchClick(search)}>{search}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the search click when removing
                      handleRemoveSearch(search); // Remove individual search
                    }}
                    className="text-red-500 hover:text-red-700"
                    aria-label="remove-search"
                  >
                    X
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No recent searches</li>
            )}
          </ul>
          {/* Clear Search History Button */}
          {recentSearches.length > 0 && (
            <button
              onClick={handleClearSearchHistory}
              className="mt-2 text-red-500 text-sm cursor-pointer hover:underline"
            >
              Clear Search History
            </button>
          )}
        </div>
      )}
    </div>
  );
}
