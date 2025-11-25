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
                className={`md:hidden fixed inset-x-0 bottom-0 bg-[#0a1f1f]/95 border-t-2 border-white/10 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out z-40 ${
                    isExpanded ? 'translate-y-0' : 'translate-y-full'
                }`}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-emerald-400">
                            Player Search History
                        </h2>
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {recentSearches.length > 0 ? (
                        <>
                            <ul className="space-y-3 max-h-64 overflow-y-auto pr-2">
                                {recentSearches.map((query, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                                    >
                                        <button
                                            className="flex-1 text-left text-gray-200 text-sm font-medium"
                                            onClick={() => {
                                                onSearchClick(query);
                                                setIsExpanded(false);
                                            }}
                                        >
                                            {query}
                                        </button>
                                        <button
                                            className="text-red-400 hover:text-red-300 text-xs ml-2 p-1"
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
                                className="mt-6 w-full py-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-colors border border-red-500/20 rounded-lg hover:bg-red-500/10"
                            >
                                Clear All
                            </button>
                        </>
                    ) : (
                        <p className="text-gray-500 text-sm italic">
                            No recent searches
                        </p>
                    )}
                </div>
            </div>

            {/* Desktop History Panel - positioned as a fixed sidebar on the right */}
            <aside className="hidden md:block absolute right-4 top-32 w-72 p-6 bg-[#0a1f1f]/80 rounded-2xl shadow-xl border-2 border-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/10">
                <div className="flex justify-between items-center gap-2 mb-4">
                    <h2 className="text-lg font-bold text-emerald-400">
                        Recent Searches
                    </h2>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 bg-emerald-900/30 rounded-lg p-2 hover:bg-emerald-900/50"
                        aria-label="Toggle history visibility"
                    >
                        {isExpanded ? (
                            <IoEye className="w-4 h-4" />
                        ) : (
                            <IoEyeOff className="w-4 h-4" />
                        )}
                    </button>
                </div>

                {isExpanded ? (
                    recentSearches.length > 0 ? (
                        <div className="overflow-hidden mt-2 animate-fade-in">
                            <ul className="space-y-2">
                                {recentSearches.map((query, index) => (
                                    <li
                                        key={index}
                                        className="flex justify-between items-center bg-white/5 p-2.5 rounded-lg border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-200 group"
                                    >
                                        <button
                                            className="flex-1 text-left text-gray-300 text-sm font-medium group-hover:text-white truncate"
                                            onClick={() => onSearchClick(query)}
                                        >
                                            {query}
                                        </button>
                                        <button
                                            className="text-gray-600 hover:text-red-400 text-xs ml-2 p-1 opacity-0 group-hover:opacity-100 transition-all"
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
                                className="mt-4 w-full text-xs font-medium text-red-400 hover:text-red-300 hover:underline transition-colors text-center"
                            >
                                Clear History
                            </button>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic text-center py-4">
                            No recent searches
                        </p>
                    )
                ) : (
                    <p className="text-gray-500 text-xs text-center py-2">
                        Expand to view history
                    </p>
                )}
            </aside>
        </>
    );
}
