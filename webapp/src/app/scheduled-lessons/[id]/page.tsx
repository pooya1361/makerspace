// app/lessons/[id]/page.tsx

import Link from 'next/link';

import { apiSlice } from '@/app/lib/features/api/apiSlice';
import { store } from '@/app/lib/store';
import ProposedTimeSlotListClient from './ProposedTimeSlotListClient';

// Define the props for this page component (dynamic segment 'id')
interface ScheduledLessonDetailsPageProps {
    params: Promise<{
        id: number; // The ID from the URL will be a string
    }>;
}

// This is an async Server Component. 'params' is passed directly.
export default async function ScheduledLessonDetailsPage({ params: paramsPromise }: ScheduledLessonDetailsPageProps) {
    const params = await paramsPromise;
    const { data: scheduledLesson } = await store.dispatch(apiSlice.endpoints.getScheduledLessonById.initiate(params.id));


    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg mt-8 mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">{scheduledLesson?.lesson.name}</h1>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {scheduledLesson?.lesson.description}
            </p>

            <ProposedTimeSlotListClient scheduledLessonId={params.id} />

            <div className="mt-10 flex justify-between">
                <Link href="/scheduled-lessons" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 text-lg">
                    &larr; Back to All Scheduled Lessons
                </Link>

            </div>
        </div>
    );
}