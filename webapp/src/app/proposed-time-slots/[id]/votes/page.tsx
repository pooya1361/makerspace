import { apiSlice } from '@/app/lib/features/api/apiSlice';
import { makeStore } from '@/app/lib/store';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { VoteSummaryDTO } from '@/app/interfaces/api'; // Your generated types

interface ProposedTimeSlotVotesPageProps {
    params: { id: string };
    searchParams: { scheduledLessonId?: string }; // Query parameters are strings, optional
}

// This is an async Server Component function
export default async function ProposedTimeSlotVotesPage({ params: paramsPromise, searchParams: searchParamsPromise }: ProposedTimeSlotVotesPageProps) {
    const params = await paramsPromise;
    const searchParams = await searchParamsPromise;
    const proposedTimeSlotId = params.id;
    const scheduledLessonId = searchParams.scheduledLessonId;


    const { data: proposedTimeSlot, isError, error } = await makeStore().dispatch(
        apiSlice.endpoints.getVotesForProposedTimeSlot.initiate(proposedTimeSlotId)
    );

    if (isError) {
        console.error("Error fetching votes:", error);
        // You might want to render a specific error page or message
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

    const votes = proposedTimeSlot?.votes;

    // If lesson is null/undefined after dispatch, it means it wasn't found (e.g., 404 from backend)
    if (!votes) {
        notFound(); // Triggers Next.js's not-found.tsx page
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
                            {votes.map((vote: VoteSummaryDTO) => (
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