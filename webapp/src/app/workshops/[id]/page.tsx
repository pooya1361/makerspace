// app/workshops/[id]/page.tsx
// This is a Server Component, ideal for fetching data from your backend.

import Link from "next/link";

// Define the Workshop type, consistent with your backend Workshop DTO/Entity
interface Workshop {
    id: number;
    name: string;
    description: string;
    // Add more fields as per your backend's Workshop model
    // e.g., imageUrl?: string;
    //       durationInMinutes?: number;
    //       startDate?: string; // If it's a string, ensure it's ISO formatted from backend
    //       instructorName?: string;
}

// Define the props for this page component
// In App Router, dynamic segments like '[id]' are passed as props to the page component
interface WorkshopDetailsPageProps {
    params: {
        id: string; // The ID from the URL will be a string
    };
}

// Function to fetch a single workshop by ID from your Spring Boot backend
async function getWorkshopById(id: string): Promise<Workshop | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/workshops/${id}`);

        if (!res.ok) {
            // If the workshop is not found, or another HTTP error occurs
            if (res.status === 404) {
                console.warn(`Workshop with ID ${id} not found.`);
                return null;
            }
            console.error(`Failed to fetch workshop ${id}:`, res.status, res.statusText);
            throw new Error('Failed to fetch workshop details.');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching workshop ${id}:`, error);
        return null; // Return null on error
    }
}

export default async function WorkshopDetailsPage({ params: paramsPromise }: WorkshopDetailsPageProps) {
    const params = await paramsPromise;
    const { id } = params;
    const workshop = await getWorkshopById(id); // Fetch data using the ID from params

    if (!workshop) {
        // Handle the case where the workshop is not found or an error occurred
        return (
            <div className="container mx-auto p-6 md:p-10 text-center text-red-600">
                <h1 className="text-3xl font-bold mb-4">Workshop Not Found</h1>
                <p className="text-lg">The workshop you are looking for does not exist or an error occurred.</p>
                <Link href="/workshops" className="mt-6 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                    Back to Workshops
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg mt-8 mb-12">
            <h1 className="text-4xl font-bold text-blue-800 mb-6 text-center">{workshop.name}</h1>

            {/* If you have an image for the workshop */}
            {/* {workshop.imageUrl && (
        <div className="mb-6">
          <img src={workshop.imageUrl} alt={workshop.name} className="w-full h-96 object-cover rounded-lg" />
        </div>
      )} */}

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {workshop.description}
            </p>

            {/* Add more workshop details here as needed */}
            {/* Example:
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Duration:</h3>
          <p className="text-gray-600">{workshop.durationInMinutes} minutes</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Instructor:</h3>
          <p className="text-gray-600">{workshop.instructorName}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Start Date:</h3>
          <p className="text-gray-600">{workshop.startDate ? new Date(workshop.startDate).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
      */}

            <div className="mt-10 text-center">
                <Link href="/workshops" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 text-lg">
                    &larr; Back to All Workshops
                </Link>
                {/* You might add other buttons here, e.g., "Enroll Now", "Propose Time Slot" */}
            </div>
        </div>
    );
}