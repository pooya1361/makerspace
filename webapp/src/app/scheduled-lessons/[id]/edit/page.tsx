// webapp/src/app/scheduled-lessons/[id]/edit/page.tsx
'use client'

import ScheduledLessonForm from '@/app/components/ScheduledLessonForm';
import { useGetScheduledLessonByIdQuery } from '@/app/lib/features/api/apiSlice';
import { use } from 'react';

type EditScheduledLessonPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default function EditScheduledLessonPage({ params: paramsPromise }: EditScheduledLessonPageProps) {
    const params = use(paramsPromise);
    const scheduledLessonId = params.id;

    // Fetch the Scheduled Lesson data on the server
    const { data: scheduledLesson, isError, isLoading } = useGetScheduledLessonByIdQuery(scheduledLessonId)

    if (isLoading) {
        return <div>Loading scheduled lesson...</div>;
    }

    if (isError) {
        // Don't call notFound() - just show a loading state while redirecting
        return <div>Scheduled lesson not found. Redirecting...</div>;
    }

    if (!scheduledLesson) {
        return <div>No scheduled lesson data available.</div>;
    }

    return (
        <div className="container mx-auto p-6 md:p-10">
            <ScheduledLessonForm initialScheduledLesson={scheduledLesson} />
        </div>
    );
}
