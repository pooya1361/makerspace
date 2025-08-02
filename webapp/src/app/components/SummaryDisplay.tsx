// webapp/components/SummaryDisplay.tsx
"use client";

import { useSelector } from 'react-redux';
import { apiSlice } from '../lib/features/api/apiSlice';
import { selectIsLoggedIn } from '../lib/features/auth/authSlice';

export default function SummaryDisplay() {
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const { data: summary, isLoading, isError, error } = apiSlice.useGetOverallSummaryQuery(undefined, {
        skip: !isLoggedIn,
    });

    if (!isLoggedIn) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mb-8 shadow-md w-full">
                <p className="text-lg font-semibold">Please log in to view overall statistics.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-8 shadow-md w-full animate-pulse">
                <p className="text-lg font-semibold">Loading overall statistics...</p>
            </div>
        );
    }

    if (isError) {
        console.error("Error fetching summary (Client Component):", error);
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md mb-8 shadow-md w-full">
                <p className="text-lg font-semibold">Error loading statistics. Please try again later.</p>
                {/* You can display more specific error details here if needed */}
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="bg-gray-100 border-l-4 border-gray-500 text-gray-800 p-4 rounded-md mb-8 shadow-md w-full">
                <p className="text-lg font-semibold">No summary data available.</p>
            </div>
        );
    }

    return (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-md mb-8 shadow-md w-full">
            <h2 className="text-2xl font-semibold mb-3">Overall Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-4xl font-bold text-blue-700">{summary.totalWorkshops}</p>
                    <p className="text-gray-600">Workshops</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-4xl font-bold text-blue-700">{summary.totalActivities}</p>
                    <p className="text-gray-600">Activities</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-4xl font-bold text-blue-700">{summary.totalLessons}</p>
                    <p className="text-gray-600">Lessons</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-4xl font-bold text-blue-700">{summary.totalScheduledLessons}</p>
                    <p className="text-gray-600">Scheduled Lessons</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-4xl font-bold text-blue-700">{summary.totalUsers}</p>
                    <p className="text-gray-600">Makers</p>
                </div>
            </div>
        </div>
    );
}