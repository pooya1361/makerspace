// webapp/src/app/lessons/[id]/edit/page.tsx
'use client';  // ← Add this!

import LessonForm from '@/app/components/LessonForm';
import { useGetLessonByIdQuery } from '@/app/lib/features/api/apiSlice';
import { useParams } from 'next/navigation';

export default function EditLessonPage() {
    const params = useParams();
    const lessonId = params.id as string;

    // Use the hook instead of direct dispatch
    const { data: lesson, isError, error, isLoading } = useGetLessonByIdQuery(lessonId);

    console.log("🚀 ~ EditLessonPage ~ lesson:", lesson, error);

    if (isLoading) {
        return <div>Loading lesson...</div>;
    }

    if (isError) {
        // Don't call notFound() - just show a loading state while redirecting
        return <div>Lesson not found. Redirecting...</div>;
    }

    if (!lesson) {
        return <div>No lesson data available.</div>;
    }

    return (
        <div className="container mx-auto p-6 md:p-10">
            <LessonForm initialLesson={lesson} />
        </div>
    );
}