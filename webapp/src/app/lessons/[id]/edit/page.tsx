// webapp/src/app/lessons/[id]/edit/page.tsx
// This is a Server Component - NO 'use client' at the top

import { makeStore } from '@/app/lib/store';
import { apiSlice } from '@/app/lib/features/api/apiSlice';
import { notFound } from 'next/navigation'; // For handling workshop not found
import LessonForm from '@/app/components/LessonForm';

type EditLessonPageProps = {
    params: {
        id: string; // The ID from the URL segment [id]
    };
};

export default async function EditLessonPage({ params: paramPromise }: EditLessonPageProps) {
    const params = await paramPromise
    const lessonId = params.id;

    // Fetch the Lesson data on the server
    const { data: lesson, isError, error } = await makeStore().dispatch(
        apiSlice.endpoints.getLessonById.initiate(lessonId)
    );

    if (isError || !lesson) {
        console.error(`Error fetching Lesson ${lessonId}:`, error);
        // Use Next.js notFound() to render the not-found page
        // This is better for SEO than just rendering an error message
        notFound();
    }

    return (
        <div className="container mx-auto p-6 md:p-10">
            <LessonForm initialLesson={lesson} />
        </div>
    );
}
