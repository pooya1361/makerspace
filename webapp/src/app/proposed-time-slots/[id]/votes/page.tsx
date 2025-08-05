import { apiSlice } from '@/app/lib/features/api/apiSlice';
import { store } from '@/app/lib/store';
import moment from 'moment';
import Link from 'next/link';
import VotesListClient from './VotesListClient';

interface ProposedTimeSlotVotesPageProps {
    params: Promise<{
        id: string;
    }>;
    searchParams: Promise<{ 
        scheduledLessonId?: string 
    }>; 
}

// This is an async Server Component function
export default async function ProposedTimeSlotVotesPage({ params: paramsPromise, searchParams: searchParamsPromise }: ProposedTimeSlotVotesPageProps) {
    const params = await paramsPromise;
    const searchParams = await searchParamsPromise;
    const proposedTimeSlotId = params.id;
    const scheduledLessonId = searchParams.scheduledLessonId;

    const { data: proposedTimeSlot} = await store.dispatch(apiSlice.endpoints.getProposedTimeSlotById.initiate(proposedTimeSlotId));

    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg mt-8 mb-12">
            <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">Votes for Proposed Time Slot: {moment(proposedTimeSlot?.proposedStartTime).format('YYYY-MM-DD HH:mm')}</h1>

            <VotesListClient proposedTimeSlotId={proposedTimeSlotId} />

            <div className="mt-10 text-center">
                {/* Link back to the Scheduled Lesson details page */}
                <Link href={`/scheduled-lessons/${scheduledLessonId}`} className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg">
                    &larr; Back to Proposed Time Slot
                </Link>
            </div>
        </div>
    );
}