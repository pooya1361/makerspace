// app/lessons/[id]/page.tsx
// This is a Server Component for fetching and displaying single lesson details.

import Link from 'next/link';
import { notFound } from 'next/navigation'; // Import notFound for 404 handling
// No need to import useParams from 'next/navigation' as it's passed as a prop
// No need to import useEffect or useState for Server Components

import { ProposedTimeSlotSummaryDTO, ScheduledLessonResponseDTO } from '@/app/interfaces/api'; // Assuming @types maps to this path
import moment from 'moment';

// Define the props for this page component (dynamic segment 'id')
interface ScheduledLessonDetailsPageProps {
    params: Promise<{
        id: string; // The ID from the URL will be a string
    }>;
}
// Function to fetch a single scheduled lesson by ID from your Spring Boot backend
// This function will run on the server.
async function getScheduledLessonById(id: string): Promise<ScheduledLessonResponseDTO | null> {
    try {
        // IMPORTANT: For server-side fetches, use the FULL ABSOLUTE URL to your backend API.
        // Replace 'http://localhost:8080' with your actual backend URL.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scheduled-lessons/${id}`, {
            // Optional: Next.js automatically caches fetch requests.
            // You can control caching behavior here if needed (e.g., revalidate every X seconds).
            // cache: 'no-store', // Example: to always fetch fresh data
            // next: { revalidate: 60 }, // Example: to revalidate data every 60 seconds
        });

        if (!res.ok) {
            if (res.status === 404) {
                console.warn(`ScheduledLesson with ID ${id} not found.`);
                return null; // Return null to trigger notFound() in the page component
            }
            console.error(`Failed to fetch ScheduledLesson ${id}:`, res.status, res.statusText);
            // For other errors, you might throw an error to be caught by an error.tsx boundary
            throw new Error('Failed to fetch ScheduledLesson details.');
        }
        const data: ScheduledLessonResponseDTO = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching ScheduledLesson ${id}:`, error);
        // Return null or re-throw the error to be handled by Next.js's error mechanisms
        return null;
    }
}

// This is an async Server Component. 'params' is passed directly.
export default async function ScheduledLessonDetailsPage({ params: paramsPromise }: ScheduledLessonDetailsPageProps) {
    const params = await paramsPromise;
    const lessonId = params.id; // Extract ID directly from the params prop

    // Fetch data directly within the Server Component
    const scheduledLesson = await getScheduledLessonById(lessonId);

    // Handle loading/error/not found states based on the fetched data
    // For Server Components, you typically don't have explicit 'loading' state
    // as the page waits for data before rendering.
    if (!scheduledLesson) {
        notFound(); // Triggers Next.js's 404 page if data is null
    }

    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg mt-8 mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">{scheduledLesson.lesson.name}</h1>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {scheduledLesson.lesson.description}
            </p>

            <h2 className="text-2xl text-gray-700 font-semibold mt-6 mb-3">Proposed Time Slots</h2>
            {scheduledLesson.proposedTimeSlots && scheduledLesson.proposedTimeSlots.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">Start Time</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">End Time</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">Votes</th>
                                {/* Add other ProposedTimeSlot headers */}
                            </tr>
                        </thead>
                        <tbody>
                            {scheduledLesson.proposedTimeSlots.map((slot: ProposedTimeSlotSummaryDTO) => {
                                // Create a new Date object for proposedStartTime to avoid modifying it
                                const startTime = slot.proposedStartTime ? new Date(slot.proposedStartTime) : null;
                                // Calculate endTime by adding durationInMinutes to a NEW Date object based on startTime
                                const endTime = startTime ? new Date(startTime.getTime() + scheduledLesson.durationInMinutes * 60 * 1000) : null;

                                return (
                                    <tr key={slot.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                                            {startTime ? moment(startTime).format('YYYY-MM-DD HH:mm') : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                                            {endTime ? moment(endTime).format('HH:mm') : 'N/A'}
                                        </td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800 flex items-center justify-between align-middle">
                                            <span className='flex align-middle'>{slot.votes?.length ?? 0}</span>
                                            <Link
                                                href={`/proposed-time-slots/${slot.id}/votes?scheduledLessonId=${scheduledLesson.id}`} // Link to the new votes page
                                                className="ml-2 text-blue-500 hover:underline"
                                            >
                                                <button className="rounded-md cursor-pointer p-1.5 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none" type="button">
                                                    🗳️
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No proposed time slots for this lesson.</p>
            )}

            <div className="mt-10 text-center">
                <Link href="/scheduled-lessons" className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 text-lg">
                    &larr; Back to All Scheduled Lessons
                </Link>
                {/* You might add other buttons here, e.g., "Schedule a Session" */}
            </div>
        </div>
    );
}