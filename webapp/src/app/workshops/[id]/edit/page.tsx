// webapp/src/app/workshops/[id]/edit/page.tsx
'use client';

import { useGetWorkshopByIdQuery } from '@/app/lib/features/api/apiSlice';
import { selectIsLoggedIn } from '@/app/lib/features/auth/authSlice';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation'; // For handling workshop not found
import { useSelector } from 'react-redux';
import WorkshopEditForm from './WorkshopEditForm';

type EditWorkshopPageProps = {
    id: string; // The ID from the URL segment [id]
};
export default function EditWorkshopPage() {
    const params = useParams<EditWorkshopPageProps>();
    const workshopId = params.id;
    const isLoggedIn = useSelector(selectIsLoggedIn);

    // Fetch the workshop data on the server
    const { data: workshop, isError, error, isLoading } = useGetWorkshopByIdQuery(workshopId, {
        skip: !isLoggedIn || !workshopId, // Skip if not logged in or no ID
    });

    if (!isLoggedIn) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center">
                <h1 className="text-4xl font-bold text-red-800 mb-8">Access Denied</h1>
                <p className="text-lg text-gray-700">Please log in to edit workshops.</p>
                <Link href="/login" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
                    Go to Login
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-6 md:p-10 text-center">
                <h1 className="text-4xl font-bold text-blue-800 mb-8">Loading Workshop...</h1>
                <p className="text-lg text-gray-700">Please wait while we fetch the activity details.</p>
            </div>
        );
    }

    if (isError) {
        console.error(`Error fetching activity ${workshopId} (Client Component):`, error);
        return (
            <div className="container mx-auto p-6 md:p-10 text-center">
                <h1 className="text-4xl font-bold text-red-800 mb-8">Error Loading Workshop</h1>
                <p className="text-lg text-gray-700">There was a problem fetching the activity. Please try again.</p>
            </div>
        );
    }

    if (!workshop) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Edit Workshop</h1>
            {/* Pass the fetched workshop data as a prop to the Client Component */}
            <WorkshopEditForm initialWorkshop={workshop} />
        </div>
    );
}
