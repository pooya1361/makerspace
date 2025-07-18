// This is a Server Component, no 'use client'; needed
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { VoteResponseDTO, ProposedTimeSlot } from '@/app/interfaces/api'; // Your generated types

// Function to fetch votes for a specific proposed time slot
async function getVotesForProposedTimeSlot(slotId: string): Promise<VoteResponseDTO[] | null> {
    try {
        // IMPORTANT: Use the FULL ABSOLUTE URL for server-side fetches to your backend.
        // Replace 'http://localhost:8080' with your actual backend URL.
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/proposed-time-slots/${slotId}`, {
            // Optional: Cache control. Next.js caches fetch requests by default.
            // cache: 'no-store', // To always fetch fresh data
            // next: { revalidate: 60 }, // To revalidate data every 60 seconds
        });

        if (!res.ok) {
            if (res.status === 404) {
                console.warn(`Proposed Time Slot with ID ${slotId} not found or has no votes.`);
                return null; // Return null to trigger notFound() or handle no data
            }
            console.error(`Failed to fetch votes for slot ${slotId}:`, res.status, res.statusText);
            throw new Error(`Failed to fetch votes: ${res.statusText}`);
        }

        const data = await res.json();
        return data.votes;
    } catch (error) {
        console.error(`Error fetching votes for slot ${slotId}:`, error);
        return null; // Return null on error
    }
}

interface ProposedTimeSlotVotesPageProps {
    params: { id: string };
    searchParams: { scheduledLessonId?: string }; // Query parameters are strings, optional
}

// This is an async Server Component function
export default async function ProposedTimeSlotVotesPage({ params, searchParams }: ProposedTimeSlotVotesPageProps) {
    // const params = await paramsPromise;
    const proposedTimeSlotId = params.id;
    const scheduledLessonId = searchParams.scheduledLessonId;
    const votes = await getVotesForProposedTimeSlot(proposedTimeSlotId);

    // You might want to fetch the ProposedTimeSlot details here too if you need its name/info
    // For simplicity, we'll just display the ID in the title for now.
    // const proposedTimeSlotDetails: ProposedTimeSlot | null = await getProposedTimeSlotDetails(proposedTimeSlotId);

    if (!votes || votes.length === 0) {
        // If votes is null (e.g., 404 or other fetch error), you might show a message or notFound()
        // For now, let's just say no votes found.
        // If you want a full 404 page for a non-existent slot, check `proposedTimeSlotDetails` too.
        return (
            <div className="container mx-auto p-6 text-center">
                <h1 className="text-3xl font-bold text-blue-800 mb-4">Votes for Proposed Time Slot ID: {proposedTimeSlotId}</h1>
                <p className="text-gray-600">No votes found for this time slot or an error occurred.</p>
                <div className="mt-8">
                    <Link href={`/scheduled-lessons/${scheduledLessonId}`} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg">
                        &larr; Back to Scheduled Lesson
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg mt-8 mb-12">
            <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">Votes for Proposed Time Slot ID: {proposedTimeSlotId}</h1>

            <h2 className="text-2xl font-semibold mt-6 mb-3">All Votes</h2>
            {votes.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">User</th>
                                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-600">Email</th>
                                {/* Add other vote-specific headers like 'Vote Date' if available */}
                            </tr>
                        </thead>
                        <tbody>
                            {votes.map((vote: VoteResponseDTO) => (
                                <tr key={vote.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-sm text-gray-800">{vote.user?.username || 'N/A'}</td>
                                    <td className="py-2 px-4 border-b text-sm text-gray-800">{vote.user?.email}</td>
                                    {/* Add other vote data */}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-600">No votes recorded for this time slot yet.</p>
            )}

            <div className="mt-10 text-center">
                {/* Link back to the Scheduled Lesson details page */}
                <Link href={`/scheduled-lessons/${scheduledLessonId}`} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg">
                    &larr; Back to Proposed Time Slot
                </Link>
            </div>
        </div>
    );
}