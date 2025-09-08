//app/lessons/ScheduledLessonsListClient.tsx
'use client';
import { ScheduledLessonItem } from "../components/ScheduledLessonItem";
import { apiSlice } from "../lib/features/api/apiSlice";

export default function ScheduledLessonsListClient() {
    const { data: scheduledLessons, isLoading, isError, error } = apiSlice.useGetScheduledLessonsQuery();

    if (isLoading) {
        return (
            <p className="text-center text-xl text-gray-700" aria-live="polite">
                Loading scheduled lessons...
            </p>
        );
    }

    if (isError) {
        return (
            <div className="text-center text-red-700 text-xl" role="alert">
                <p>Error loading scheduled lessons. Please try again later.</p>
                {process.env.NODE_ENV === 'development' && (
                    <pre aria-hidden="true" className="mt-4 text-sm text-gray-600">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                )}
            </div>
        );
    }

    if (!scheduledLessons || scheduledLessons.length === 0) {
        return (
            <p className="text-center text-xl text-gray-700" role="status">
                No scheduled lessons available yet. Check back soon!
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scheduledLessons.map((scheduledLesson, key) => (
                <ScheduledLessonItem key={key} scheduledLesson={scheduledLesson} />
            ))}
        </div>
    );
}