// webapp/src/app/workshops/[id]/edit/page.tsx
// This is a Server Component - NO 'use client' at the top

import { makeStore } from '@/app/lib/store';
import { apiSlice } from '@/app/lib/features/api/apiSlice';
import { notFound } from 'next/navigation'; // For handling workshop not found
import WorkshopEditForm from './WorkshopEditForm';

type EditWorkshopPageProps = {
    params: {
        id: string; // The ID from the URL segment [id]
    };
};

export default async function EditWorkshopPage({ params: paramPromise }: EditWorkshopPageProps) {
    const params = await paramPromise
    const workshopId = params.id;

    // Fetch the workshop data on the server
    const { data: workshop, isError, error } = await makeStore().dispatch(
        apiSlice.endpoints.getWorkshopById.initiate(workshopId)
    );

    if (isError || !workshop) {
        console.error(`Error fetching workshop ${workshopId}:`, error);
        // Use Next.js notFound() to render the not-found page
        // This is better for SEO than just rendering an error message
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
