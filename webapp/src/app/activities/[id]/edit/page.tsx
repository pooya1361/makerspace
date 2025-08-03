// webapp/src/app/activities/[id]/edit/page.tsx
'use client';

import ActivityForm from '@/app/components/ActivityForm';
import { useGetActivityByIdQuery } from '@/app/lib/features/api/apiSlice';
import { selectIsLoggedIn } from '@/app/lib/features/auth/authSlice';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation'; // For handling workshop not found
import { useSelector } from 'react-redux';

type EditActivityPageProps = {
    id: string; // The ID from the URL segment [id]
};

export default function EditActivityPage() {
    const params = useParams<EditActivityPageProps>();
    const activityId = params.id;
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const { data: activity, isLoading, isError, error } = useGetActivityByIdQuery(activityId, {
        skip: !isLoggedIn || !activityId, // Skip if not logged in or no ID
    });

    if (!isLoggedIn) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center">
                <h1 className="text-4xl font-bold text-red-800 mb-8">Access Denied</h1>
                <p className="text-lg text-gray-700">Please log in to edit activities.</p>
                <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center">
                <h1 className="text-4xl font-bold text-blue-800 mb-8">Loading Activity...</h1>
                <p className="text-lg text-gray-700">Please wait while we fetch the activity details.</p>
            </div>
        );
    }

    if (isError) {
        console.error(`Error fetching activity ${activityId} (Client Component):`, error);
        return (
            <div className="container mx-auto p-6 md:p-10 text-center">
                <h1 className="text-4xl font-bold text-red-800 mb-8">Error Loading Activity</h1>
                <p className="text-lg text-gray-700">There was a problem fetching the activity. Please try again.</p>
            </div>
        );
    }

    if (!activity) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 md:p-10">
            <ActivityForm initialActivity={activity} />
        </div>
    );
}
