//app/lessons/ScheduledLessonsListClient.tsx
'use client';
import Link from "next/link";
import { apiSlice } from "../lib/features/api/apiSlice";

export default function ScheduledLessonsListClient() {
    const { data: scheduledLessons, isLoading, isError, error } = apiSlice.useGetScheduledLessonsQuery();

    if (isLoading) {
        return <p className="text-center text-xl text-gray-600">Loading scheduled lessons...</p>;
    }

    if (isError) {
        return (
            <div className="text-center text-red-600 text-xl">
                <p>Error loading scheduled lessons. Please try again later.</p>
                {process.env.NODE_ENV === 'development' && <pre className="mt-4 text-sm text-gray-700">{JSON.stringify(error, null, 2)}</pre>}
            </div>
        );
    }

    if (!scheduledLessons || scheduledLessons.length === 0) {
        return <p className="text-center text-xl text-gray-600">No scheduled lessons available yet. Check back soon!</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scheduledLessons.map((scheduledLesson) => (
                <div key={scheduledLesson.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                    {/* Add a placeholder image or actual image if available */}
                    {/* <img src={lesson.imageUrl || '/placeholder-lesson.jpg'} alt={lesson.name} className="w-full h-48 object-cover" /> */}
                    <div className="p-6 flex flex-col justify-between h-full">
                        <div className="">
                            <h2 className="text-2xl font-semibold mb-2 text-gray-900">{scheduledLesson.lesson.name}</h2>
                            <h4 className="mb-2 text-gray-400">{scheduledLesson.lesson.activity.name} [{scheduledLesson.lesson.activity.workshop.name}]</h4>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">Instructor: {scheduledLesson.instructor.username}</p>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{scheduledLesson.durationInMinutes} minutes</p>
                        </div>
                        <div className='flex gap-3 justify-between'>
                            <Link
                                href={`/scheduled-lessons/${scheduledLesson.id}`} // Link to a dynamic lesson detail page
                                className="inline-block bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-ortext-orange-700 transition duration-300"
                            >
                                View Details
                            </Link>
                            <Link
                                href={`/scheduled-lessons/${scheduledLesson.id}/edit`}
                                className="inline-block bg-gray-100 border-orange-600 border hover:border-2 text-white px-2 py-2 rounded-lg transition duration-300"
                            >
                                📝
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}