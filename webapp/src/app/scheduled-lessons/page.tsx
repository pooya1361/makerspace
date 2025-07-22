// app/scheduledLessons/page.tsx
// This is a Server Component, ideal for fetching data from your backend.

import Link from 'next/link';
import { apiSlice } from '../lib/features/api/apiSlice';
import { store } from '../lib/store';
import ScheduledLessonsListClient from './ScheduledLessonsListClient';

export default async function ScheduledLessonsPage() {
    await store.dispatch(apiSlice.endpoints.getScheduledLessons.initiate(undefined));

    return (
        <div className="container mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-orange-700">Scheduled Lessons</h1>
                <Link href="/scheduled-lessons/add" className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">
                    + Add Scheduled Lesson
                </Link>
            </div>

            <ScheduledLessonsListClient />
        </div>
    );
}