// app/lessons/[id]/page.tsx
// This is a Server Component for fetching and displaying single lesson details.

import { apiSlice } from '@/app/lib/features/api/apiSlice';
import { store } from '@/app/lib/store';
import Link from 'next/link';
import { notFound } from 'next/navigation';


// Define the props for this page component (dynamic segment 'id')
interface LessonDetailsPageProps {
    params: Promise<{
        id: string; // The ID from the URL will be a string
    }>;
}

export default async function LessonDetailsPage({ params: paramsPromise }: LessonDetailsPageProps) {
    // Await the params Promise first, then destructure
    const params = await paramsPromise;
    const { id: lessonId } = params;

    const { data: lesson, isError, error } = await store.dispatch(
        apiSlice.endpoints.getLessonById.initiate(lessonId)
    );

    if (isError) {
        console.error("Error fetching lesson:", error);
        // You might want to render a specific error page or message
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold text-red-600 mb-4">Error loading lesson details.</h1>
                <p className="text-gray-600">Please try again later.</p>
                <Link href="/lessons" className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
                    Back to Lessons
                </Link>
            </div>
        );
    }

    // If lesson is null/undefined after dispatch, it means it wasn't found (e.g., 404 from backend)
    if (!lesson) {
        notFound(); // Triggers Next.js's not-found.tsx page
    }

    if (!lesson) {
        // Handle the case where the lesson is not found or an error occurred
        return (
            <div className="container mx-auto p-6 md:p-10 text-center text-red-600">
                <h1 className="text-3xl font-bold mb-4">Lesson Not Found</h1>
                <p className="text-lg">The lesson you are looking for does not exist or an error occurred.</p>
                <Link href="/lessons" className="mt-6 inline-block bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                    Back to Lessons
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg mt-8 mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">{lesson.name}</h1>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {lesson.description}
            </p>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {lesson.activity.name} [{lesson.activity.workshop.name}]
            </p>

            <div className="mt-10 text-center">
                <Link href="/lessons" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 text-lg">
                    &larr; Back to All Lessons
                </Link>
                {/* You might add other buttons here, e.g., "Schedule a Session" */}
            </div>
        </div>
    );
}