// webapp/src/app/activities/[id]/edit/page.tsx
// This is a Server Component - NO 'use client' at the top

import { makeStore } from '@/app/lib/store';
import { apiSlice } from '@/app/lib/features/api/apiSlice';
import { notFound } from 'next/navigation'; // For handling workshop not found
import ActivityForm from '@/app/components/ActivityForm';

type EditActivityPageProps = {
    params: {
        id: string; // The ID from the URL segment [id]
    };
};

export default async function EditActivityPage({ params: paramPromise }: EditActivityPageProps) {
    const params = await paramPromise
    const activityId = params.id;

    // Fetch the activity data on the server
    const { data: activity, isError, error } = await makeStore().dispatch(
        apiSlice.endpoints.getActivityById.initiate(activityId)
    );

    if (isError || !activity) {
        console.error(`Error fetching activity ${activityId}:`, error);
        // Use Next.js notFound() to render the not-found page
        // This is better for SEO than just rendering an error message
        notFound();
    }

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Edit Activity</h1>
            <ActivityForm initialActivity={activity} />
        </div>
    );
}
