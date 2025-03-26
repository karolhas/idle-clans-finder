import { useState } from 'react';
import { FaHistory, FaTimes } from 'react-icons/fa';
import { IoEye, IoEyeOff } from 'react-icons/io5';

interface SearchHistoryProps {
    recentSearches: string[];
    onSearchClick: (query: string) => void;
    onRemoveSearch: (query: string) => void;
    onClearAll: () => void;
}

export default function SearchHistory({
    recentSearches,
    onSearchClick,
    onRemoveSearch,
    onClearAll,
}: SearchHistoryProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            {/* Mobile Button - positioned in the bottom right corner, away from the main content */}
            <button
                className="md:hidden fixed bottom-4 right-4 bg-emerald-500 text-white p-3 rounded-full shadow-lg z-50"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label="Toggle search history"
            >
                <FaHistory className="w-5 h-5" />
            </button>

            {/* Mobile History Drawer - full width at the bottom of the screen */}
            <div
                className={`md:hidden fixed inset-x-0 bottom-0 bg-[#002626] border-t border-[#004444] shadow-lg transition-transform duration-300 ease-in-out z-40 ${
                    isExpanded ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-emerald-500">
                            Player Search History
                        </h2>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-300 text-lg"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {recentSearches.length > 0 ? (
                        <>
                            <ul className="space-y-3 max-h-64 overflow-y-auto">
                                {recentSearches.map((query, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-white p-2 rounded shadow"
                                    >
                                        <button
                                            className="flex-1 text-left text-gray-800 text-sm"
                                            onClick={() => {
                                                onSearchClick(query);
                                                setIsExpanded(false);
                                            }}
                                        >
                                            {query}
                                        </button>
                                        <button
                                            className="text-red-500 text-xs ml-2"
                                            onClick={() =>
                                                onRemoveSearch(query)
                                            }
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={onClearAll}
                                className="mt-6 w-full text-sm font-semibold text-red-600 hover:underline"
                            >
                                Clear All
                            </button>
                        </>
                    ) : (
                        <p className="text-gray-400 text-sm">
                            No recent searches
                        </p>
                    )}
                </div>
            </div>

            {/* Desktop History Panel - positioned as a fixed sidebar on the right */}
            <aside className="hidden md:block absolute right-4 top-24 w-64 p-4 bg-[#002626] rounded-lg shadow-lg">
                <div className="flex justify-between items-center gap-2 mb-2">
                    <h2 className="text-lg font-bold text-emerald-400">
                        Player Search History
                    </h2>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-emerald-400 hover:text-emerald-100 transition-colors duration-200 bg-emerald-900 rounded-md p-1"
                        aria-label="Toggle history visibility"
                    >
                        {isExpanded ? (
                            <IoEye className="w-5 h-5" />
                        ) : (
                            <IoEyeOff className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {isExpanded ? (
                    recentSearches.length > 0 ? (
                        <div className="overflow-hidden mt-4">
                            <ul className="space-y-3">
                                {recentSearches.map((query, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-white/90 p-2 rounded shadow"
                                    >
                                        <button
                                            className="flex-1 text-left text-gray-800 text-sm"
                                            onClick={() => onSearchClick(query)}
                                        >
                                            {query}
                                        </button>
                                        <button
                                            className="text-red-500 text-xs ml-2"
                                            onClick={() =>
                                                onRemoveSearch(query)
                                            }
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={onClearAll}
                                className="mt-6 w-full text-sm text-red-600 hover:underline"
                            >
                                Clear All
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm">
                            No recent searches
                        </p>
                    )
                ) : (
                    <p className="text-gray-400 text-sm">
                        Click button to show history
                    </p>
                )}
            </aside>
        </>
    );
}
