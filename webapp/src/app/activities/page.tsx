// app/activities/page.tsx
// This is a Server Component, ideal for fetching data from your backend.

import Link from 'next/link';
import AdminOnly from '../components/AdminOnly';
import { apiSlice } from '../lib/features/api/apiSlice';
import { store } from '../lib/store';
import ActivitiesListClient from './ActivitiesListClient';

export default async function ActivitiesPage() {
    await store.dispatch(apiSlice.endpoints.getActivities.initiate(undefined));

    return (
        <div className="container mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-green-700">Activities</h1>
                <AdminOnly>
                    <Link href="/activities/add" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                        + Add Activity
                    </Link>
                </AdminOnly>
            </div>
            <ActivitiesListClient />
        </div>
    );
}