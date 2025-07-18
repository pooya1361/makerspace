// app/activities/page.tsx
// This is a Server Component, ideal for fetching data from your backend.

import Link from 'next/link';
import { Activity } from '@types';


// Function to fetch activities from your Spring Boot backend
async function getActivities(): Promise<Activity[]> {
    try {
        // Replace with your actual backend endpoint for activities
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/activities`);

        if (!res.ok) {
            console.error('Failed to fetch activities:', res.status, res.statusText);
            throw new Error('Failed to fetch activities data.');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching activities:", error);
        return []; // Return an empty array on error
    }
}

export default async function ActivitiesPage() {
    const activities = await getActivities(); // Fetch data on the server

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-center mb-10 text-green-800">Explore Our Activities</h1>

            {activities.length === 0 ? (
                <p className="text-center text-xl text-gray-600">No activities available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity) => (
                        <div key={activity.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            {/* If you have activity images, you'd render them here */}
                            {/* <img src={activity.imageUrl} alt={activity.name} className="w-full h-48 object-cover" /> */}
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-2 text-gray-900">{activity.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{activity.description}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    <h4>Location: {activity.workshop.name}</h4>
                                </p>
                                <Link
                                    href={`/activities/${activity.id}`} // Link to a dynamic activity detail page
                                    className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}