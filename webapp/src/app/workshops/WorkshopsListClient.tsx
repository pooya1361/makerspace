// app/workshops/WorkshopsListClient.tsx
'use client';

import Link from 'next/link';
import AdminOnly from '../components/AdminOnly';
import { apiSlice } from '../lib/features/api/apiSlice';

export default function WorkshopsListClient() {
    const { data: workshops, isLoading, isError, error } = apiSlice.useGetWorkshopsGraphQLQuery();

    if (isLoading) {
        return (
            <p className="text-center text-xl text-gray-900" aria-live="polite">
                Loading workshops...
            </p>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-700 text-xl" role="alert">
                <p>Error loading workshops. Please try again later.</p>
                {process.env.NODE_ENV === 'development' && (
                    <pre aria-hidden="true" className="mt-4 text-sm text-gray-600">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                )}
            </div>
        );
    }

    if (!workshops || workshops.length === 0) {
        return (
            <p
                data-testid="empty-workshops"
                className="text-center text-xl text-gray-900"
                role="status"
            >
                No workshops available yet. Check back soon!
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {workshops.map(workshop => (
                <article
                    key={workshop.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 motion-reduce:transform-none motion-reduce:transition-none"
                >
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-2 text-gray-900">
                            {workshop.name}
                        </h2>
                        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                            {workshop.description}
                        </p>
                        <p className="text-gray-700 text-sm mb-4">
                            Size: {workshop.size} m²
                        </p>
                        <p className="text-gray-700 text-sm mb-4">
                            {(workshop.activities && workshop.activities.length > 0) ?
                                `Activities: ${workshop.activities.map(a => a.name).join(", ")}` :
                                "No activities have been added yet"
                            }
                        </p>
                        <div className='flex gap-3 justify-end'>
                            <AdminOnly>
                                <Link
                                    data-testid="edit-workshop-button"
                                    href={`/workshops/${workshop.id}/edit`}
                                    aria-label={`Edit workshop ${workshop.name}`}
                                    className="focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 inline-flex items-center justify-center bg-gray-100 border-blue-800 border text-blue-800 px-3 py-2 rounded-lg transition duration-300 hover:bg-gray-200"
                                >
                                    <span aria-hidden="true">📝</span>
                                    <span className="sr-only">Edit</span>
                                </Link>
                            </AdminOnly>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}