// app/workshops/WorkshopsListClient.tsx
'use client';

import Link from 'next/link';
import AdminOnly from '../components/AdminOnly';
import { apiSlice } from '../lib/features/api/apiSlice';

export default function WorkshopsListClient() {
    const { data: workshops, isLoading, isError, error } = apiSlice.useGetWorkshopsQuery();

    if (isLoading) {
        return <p className="text-center text-xl text-gray-600">Loading workshops...</p>;
    }

    if (isError) {
        return (
            <div className="text-center text-red-600 text-xl">
                <p>Error loading workshops. Please try again later.</p>
                {process.env.NODE_ENV === 'development' && <pre className="mt-4 text-sm text-gray-700">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    if (!workshops || workshops.length === 0) {
        return <p className="text-center text-xl text-gray-600">No workshops available yet. Check back soon!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.map(workshop => (
                <div key={workshop.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-2 text-gray-900">{workshop.name}</h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workshop.description}</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workshop.size} m²</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {(workshop.activities && workshop.activities.length > 0) ?
                                "Activities: " + workshop.activities.map(a => a.name).join(", ") :
                                "No activities have been added yet"
                            }
                        </p>
                        <div className='flex gap-3 justify-end'>
                            <AdminOnly>
                                <Link
                                    href={`/workshops/${workshop.id}/edit`}
                                    className="inline-block bg-gray-100 border-blue-600 border text-white px-2 py-2 rounded-lg transition duration-300"
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