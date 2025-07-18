// app/scheduledLessons/page.tsx
// This is a Server Component, ideal for fetching data from your backend.

import Link from 'next/link';
import { ScheduledLesson } from '@types';


// Function to fetch scheduled lessons from your Spring Boot backend
async function getScheduledLessons(): Promise<ScheduledLesson[]> {
    try {
        // No cache: 'no-store' here, leveraging Next.js caching
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scheduled-lessons`);

        if (!res.ok) {
            console.error('Failed to fetch scheduled lessons:', res.status, res.statusText);
            throw new Error('Failed to fetch scheduled lessons data.');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching scheduled lessons:", error);
        return []; // Return an empty array on error
    }
}

export default async function ScheduledLessonsPage() {
    const lessons = await getScheduledLessons(); // Fetch data on the server

    return (
        <div className="container mx-auto p-6 md:p-10">

            {lessons.length === 0 ? (
                <p className="text-center text-xl text-gray-600">No scheduled lessons available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lessons.map((scheduledLesson) => (
                        <div key={scheduledLesson.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            {/* Add a placeholder image or actual image if available */}
                            {/* <img src={lesson.imageUrl || '/placeholder-lesson.jpg'} alt={lesson.name} className="w-full h-48 object-cover" /> */}
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-2 text-gray-900">{scheduledLesson.lesson.name}</h2>
                                <h4 className="mb-2 text-gray-400">{scheduledLesson.lesson.activity.name} [{scheduledLesson.lesson.activity.workshop.name}]</h4>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">Instructor: {scheduledLesson.instructor.username}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{scheduledLesson.durationInMinutes} minutes</p>
                                <Link
                                    href={`/scheduled-lessons/${scheduledLesson.id}`} // Link to a dynamic lesson detail page
                                    className="inline-block bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-ortext-orange-700 transition duration-300"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}