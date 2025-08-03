// app/scheduled-lessons/[id]/page.tsx
'use client';

import { useGetScheduledLessonByIdQuery } from '@/app/lib/features/api/apiSlice';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProposedTimeSlotListClient from './ProposedTimeSlotListClient';

export default function ScheduledLessonDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: scheduledLesson, isLoading, isError } = useGetScheduledLessonByIdQuery(id);

    if (isLoading) {
        return <div className="container mx-auto p-6 text-center">Loading...</div>;
    }

    if (isError || !scheduledLesson) {
        return (
            <div className="container mx-auto p-6">
                <h1 className="text-2xl text-red-600">Error loading scheduled lesson</h1>
                <p>Could not find scheduled lesson with ID: {id}</p>
                <Link href="/scheduled-lessons" className="text-blue-600 underline">
                    ← Back to All Scheduled Lessons
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg mt-8 mb-12">
            <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">
                {scheduledLesson.lesson.name}
            </h1>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {scheduledLesson.lesson.description}
            </p>

            <ProposedTimeSlotListClient scheduledLessonId={id} />

            <div className="mt-10 flex justify-between">
                <Link href="/scheduled-lessons" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300 text-lg">
                    &larr; Back to All Scheduled Lessons
                </Link>
            </div>
        </div>
    );
}