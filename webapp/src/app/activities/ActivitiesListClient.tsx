// app/activities/ActivitiesListClient.tsx
'use client';

import Link from 'next/link';
import AdminOnly from '../components/AdminOnly';
import { apiSlice } from '../lib/features/api/apiSlice';

export default function ActivitiesListClient() {
    const { data: activities, isLoading, isError, error } = apiSlice.useGetActivitiesQuery();

    if (isLoading) {
        return <p className="text-center text-xl text-gray-600">Loading activities...</p>;
    }

    if (isError) {
        return (
            <div className="text-center text-red-600 text-xl">
                <p>Error loading activities. Please try again later.</p>
                {process.env.NODE_ENV === 'development' && <pre className="mt-4 text-sm text-gray-700">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    if (!activities || activities.length === 0) {
        return <p className="text-center text-xl text-gray-600">No activities available yet. Check back soon!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities!.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    {/* If you have activity images, you'd render them here */}
                    {/* <img src={activity.imageUrl} alt={activity.name} className="w-full h-48 object-cover" /> */}
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-2 text-gray-900">{activity.name}</h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{activity.description}</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">Location: {activity.workshop ? activity.workshop.name : 'Not assigned'}</p>
                        <div className='flex gap-3 justify-end'>
                            <AdminOnly>
                                <Link
                                    href={`/activities/${activity.id}/edit`}
                                    className="inline-block bg-gray-100 border-green-800 border hover:border-2 text-white px-2 py-2 rounded-lg transition duration-300"
                                >
                                    📝
                                </Link>
                            </AdminOnly>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}