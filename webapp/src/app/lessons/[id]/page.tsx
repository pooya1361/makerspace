// app/lessons/[id]/page.tsx
// This is a Server Component for fetching and displaying single lesson details.
// 'use client';

import Link from 'next/link';

// Define the Lesson type, consistent with your backend Lesson DTO/Entity
interface Lesson {
    id: number;
    name: string;
    description: string;
    // Add more fields as per your backend's Lesson model
    // e.g., difficultyLevel?: string;
    //       instructorName?: string;
}

// Define the props for this page component (dynamic segment 'id')
interface LessonDetailsPageProps {
    params: Promise<{
        id: string; // The ID from the URL will be a string
    }>;
}

// Function to fetch a single lesson by ID from your Spring Boot backend
async function getLessonById(id: string): Promise<Lesson | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/lessons/${id}`);

        if (!res.ok) {
            if (res.status === 404) {
                console.warn(`Lesson with ID ${id} not found.`);
                return null;
            }
            console.error(`Failed to fetch lesson ${id}:`, res.status, res.statusText);
            throw new Error('Failed to fetch lesson details.');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching lesson ${id}:`, error);
        return null; // Return null on error
    }
}

export default async function LessonDetailsPage({ params: paramsPromise }: LessonDetailsPageProps) {
    // Await the params Promise first, then destructure
    const params = await paramsPromise;
    const { id } = params;

    const lesson = await getLessonById(id); // Fetch data using the ID from params

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

            {/* If you have an image for the lesson */}
            {/* {lesson.imageUrl && (
        <div className="mb-6">
          <img src={lesson.imageUrl} alt={lesson.name} className="w-full h-96 object-cover rounded-lg" />
        </div>
      )} */}

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {lesson.description}
            </p>

            {/* Add more lesson details here as needed */}
            {/* Example:
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Difficulty:</h3>
          <p className="text-gray-600">{lesson.difficultyLevel}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Instructor:</h3>
          <p className="text-gray-600">{lesson.instructorName}</p>
        </div>
      </div>
      */}

            <div className="mt-10 text-center">
                <Link href="/lessons" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 text-lg">
                    &larr; Back to All Lessons
                </Link>
                {/* You might add other buttons here, e.g., "Schedule a Session" */}
            </div>
        </div>
    );
}