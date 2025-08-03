//app/lessons/LessonsListClient.tsx
'use client';
import Link from "next/link";
import AdminOnly from "../components/AdminOnly";
import { apiSlice } from "../lib/features/api/apiSlice";

export default function LessonsListClient() {
    const { data: lessons, isLoading, isError, error } = apiSlice.useGetLessonsQuery();

    if (isLoading) {
        return <p className="text-center text-xl text-gray-600">Loading lessons...</p>;
    }

    if (isError) {
        return (
            <div className="text-center text-red-600 text-xl">
                <p>Error loading lessons. Please try again later.</p>
                {process.env.NODE_ENV === 'development' && <pre className="mt-4 text-sm text-gray-700">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    if (!lessons || lessons.length === 0) {
        return <p className="text-center text-xl text-gray-600">No lessons available yet. Check back soon!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lessons.map((lesson) => (
                <div key={lesson.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    {/* Add a placeholder image or actual image if available */}
                    {/* <img src={lesson.imageUrl || '/placeholder-lesson.jpg'} alt={lesson.name} className="w-full h-48 object-cover" /> */}
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold mb-2 text-gray-900">{lesson.name}</h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.description}</p>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.activity?.name}</p>
                        <div className='flex gap-3 justify-end'>
                            <AdminOnly>
                            <Link
                                href={`/lessons/${lesson.id}/edit`}
                                className="inline-block bg-gray-100 border-green-600 border hover:border-2 text-white px-2 py-2 rounded-lg transition duration-300"
                            >
                                📝
                            </Link>
                            </AdminOnly>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}