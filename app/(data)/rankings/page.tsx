'use client';

import { FaChartBar } from 'react-icons/fa';

export default function MarketPage() {
    return (
        <main className="p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-emerald-400 mb-6 flex items-center">
                    <FaChartBar className="mr-3" />
                    Rankings
                </h1>
                <div className="bg-[#002020] p-8 rounded-lg shadow-lg">
                    <p className="text-xl text-center text-gray-300">
                        This page will be available soon...
                    </p>
                </div>
            </div>
        </main>
    );
}
