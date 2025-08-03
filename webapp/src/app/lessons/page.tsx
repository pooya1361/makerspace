// app/lessons/page.tsx
// This is a Server Component, ideal for fetching data from your backend.

import Link from 'next/link';
import AdminOnly from '../components/AdminOnly';
import { apiSlice } from '../lib/features/api/apiSlice';
import { store } from '../lib/store';
import LessonsListClient from './LessonsListClient';

export default async function LessonsPage() {
    await store.dispatch(apiSlice.endpoints.getLessons.initiate(undefined));

    return (
        <div className="container mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-purple-700">Lessons</h1>
                <AdminOnly>
                    <Link href="/lessons/add" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                        + Add Lesson
                    </Link>
                </AdminOnly>
            </div>

            <LessonsListClient />
        </div>
    );
}