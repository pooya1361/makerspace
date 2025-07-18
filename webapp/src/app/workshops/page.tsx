// app/workshops/page.tsx
// This is a Server Component, so it can fetch data directly from the backend.

import Link from 'next/link';
import { Workshop } from '@types';

// Function to fetch workshops from your Spring Boot backend
async function getWorkshops(): Promise<Workshop[]> {
    try {
        // Replace with your actual backend endpoint for workshops
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/workshops`);

        if (!res.ok) {
            console.error('Failed to fetch workshops:', res.status, res.statusText);
            // It's good practice to throw an error or return an empty array if fetching fails
            throw new Error('Failed to fetch workshops data.');
        }
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching workshops:", error);
        return []; // Return an empty array on error
    }
}

export default async function WorkshopsPage() {
    const workshops = await getWorkshops(); // Fetch data on the server

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-center mb-10 text-blue-800">Explore Our Workshops</h1>

            {workshops.length === 0 ? (
                <p className="text-center text-xl text-gray-600">No workshops available yet. Check back soon!</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {workshops.map((workshop) => (
                        <div key={workshop.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            {/* If you have workshop images, you'd render them here */}
                            {/* <img src={workshop.imageUrl} alt={workshop.name} className="w-full h-48 object-cover" /> */}
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-2 text-gray-900">{workshop.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workshop.description}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workshop.size} m²</p>
                                <Link
                                    href={`/workshops/${workshop.id}`} // Link to a dynamic workshop detail page
                                    className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
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