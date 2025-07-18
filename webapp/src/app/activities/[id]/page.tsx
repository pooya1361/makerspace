// app/activities/[id]/page.tsx
// This is a Server Component for fetching and displaying single activity details.

import Link from 'next/link';

// Define the Activity type, consistent with your backend Activity DTO/Entity
interface Activity {
    id: number;
    name: string;
    description: string;
    // Add more fields as per your backend's Activity model
    // e.g., imageUrl?: string;
    //       durationInMinutes?: number;
    //       instructorName?: string;
}

// Define the props for this page component (dynamic segment 'id')
interface ActivityDetailsPageProps {
    params: {
        id: string; // The ID from the URL will be a string
    };
}

// Function to fetch a single activity by ID from your Spring Boot backend
async function getActivityById(id: string): Promise<Activity | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities/${id}`);

        if (!res.ok) {
            if (res.status === 404) {
                console.warn(`Activity with ID ${id} not found.`);
                return null;
            }
            console.error(`Failed to fetch activity ${id}:`, res.status, res.statusText);
            throw new Error('Failed to fetch activity details.');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error(`Error fetching activity ${id}:`, error);
        return null; // Return null on error
    }
}

export default async function ActivityDetailsPage({ params: paramsPromise }: ActivityDetailsPageProps) {
    const params = await paramsPromise;
    const { id } = params;
    const activity = await getActivityById(id); // Fetch data using the ID from params

    if (!activity) {
        // Handle the case where the activity is not found or an error occurred
        return (
            <div className="container mx-auto p-6 md:p-10 text-center text-red-600">
                <h1 className="text-3xl font-bold mb-4">Activity Not Found</h1>
                <p className="text-lg">The activity you are looking for does not exist or an error occurred.</p>
                <Link href="/activities" className="mt-6 inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-300">
                    Back to Activities
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 md:p-10 bg-white shadow-lg rounded-lg mt-8 mb-12">
            <h1 className="text-4xl font-bold text-green-800 mb-6 text-center">{activity.name}</h1>

            {/* If you have an image for the activity */}
            {/* {activity.imageUrl && (
        <div className="mb-6">
          <img src={activity.imageUrl} alt={activity.name} className="w-full h-96 object-cover rounded-lg" />
        </div>
      )} */}

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {activity.description}
            </p>

            {/* Add more activity details here as needed */}
            {/* Example:
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Duration:</h3>
          <p className="text-gray-600">{activity.durationInMinutes} minutes</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Instructor:</h3>
          <p className="text-gray-600">{activity.instructorName}</p>
        </div>
      </div>
      */}

            <div className="mt-10 text-center">
                <Link href="/activities" className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 text-lg">
                    &larr; Back to All Activities
                </Link>
                {/* You might add other buttons here, e.g., "Sign Up" */}
            </div>
        </div>
    );
}