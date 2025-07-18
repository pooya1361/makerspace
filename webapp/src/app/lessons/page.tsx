// app/lessons/page.tsx
// This is a Server Component, ideal for fetching data from your backend.

import Link from 'next/link';
import { Lesson } from '@types';


// Function to fetch lessons from your Spring Boot backend
async function getLessons(): Promise<Lesson[]> {
    try {
        // No cache: 'no-store' here, leveraging Next.js caching
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lessons`);

        if (!res.ok) {
            console.error('Failed to fetch lessons:', res.status, res.statusText);
            throw new Error('Failed to fetch lessons data.');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching lessons:", error);
        return []; // Return an empty array on error
    }
}

export default async function LessonsPage() {
    const lessons = await getLessons(); // Fetch data on the server

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-center mb-10 text-purple-800">Learn New Skills with Our Lessons</h1>

            {lessons.length === 0 ? (
                <p className="text-center text-xl text-gray-600">No lessons available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            {/* Add a placeholder image or actual image if available */}
                            {/* <img src={lesson.imageUrl || '/placeholder-lesson.jpg'} alt={lesson.name} className="w-full h-48 object-cover" /> */}
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-2 text-gray-900">{lesson.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.description}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{lesson.activity.name} [{lesson.activity.workshop.name}]</p>
                                <Link
                                    href={`/lessons/${lesson.id}`} // Link to a dynamic lesson detail page
                                    className="inline-block bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
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