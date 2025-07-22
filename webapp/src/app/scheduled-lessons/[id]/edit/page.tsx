// webapp/src/app/scheduled-lessons/[id]/edit/page.tsx
// This is a Server Component - NO 'use client' at the top

import ScheduledLessonForm from '@/app/components/ScheduledLessonForm';
import { apiSlice } from '@/app/lib/features/api/apiSlice';
import { makeStore } from '@/app/lib/store';
import { notFound } from 'next/navigation'; // For handling workshop not found

type EditScheduledLessonPageProps = {
    params: {
        id: string; // The ID from the URL segment [id]
    };
};

export default async function EditScheduledLessonPage({ params: paramPromise }: EditScheduledLessonPageProps) {
    const params = await paramPromise
    const scheduledLessonId = params.id;

    // Fetch the Scheduled Lesson data on the server
    const { data: scheduledLesson, isError, error } = await makeStore().dispatch(
        apiSlice.endpoints.getScheduledLessonById.initiate(scheduledLessonId)
    );

    if (isError || !scheduledLesson) {
        console.error(`Error fetching Scheduled Lesson ${scheduledLessonId}:`, error);
        // Use Next.js notFound() to render the not-found page
        // This is better for SEO than just rendering an error message
        notFound();
    }

    return (
        <div className="container mx-auto p-6 md:p-10">
            <ScheduledLessonForm initialScheduledLesson={scheduledLesson} />
        </div>
    );
}
