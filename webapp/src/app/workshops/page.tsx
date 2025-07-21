// app/workshops/page.tsx

import Link from 'next/link';
import { store } from '../lib/store';
import { apiSlice } from '../lib/features/api/apiSlice';
import { WorkshopResponseDTO } from '../interfaces/api';

type WorkshopsPageProps = {
    searchParams?: Record<string, string | string[] | undefined>;
};

export default async function WorkshopsPage({ searchParams }: WorkshopsPageProps) {
    const params = await searchParams;
    const forceRefetch = !!params?.refresh;

    const { data: workshops, isError, error } = await store.dispatch(
        apiSlice.endpoints.getWorkshops.initiate(undefined, {
            forceRefetch
        })
    );

    return (
        <div className="container mx-auto p-6 md:p-10">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-4xl font-bold text-blue-800">Workshops</h1>
                {/* The "Add Workshop" button should ALWAYS be here */}
                <Link href="/workshops/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    + Add Workshop
                </Link>
            </div>

            {/* Conditional rendering for content based on data/error */}
            {isError ? (
                // Display error message if fetching failed
                <div className="text-center text-red-600 text-xl">
                    <p>Error loading workshops. Please try again later.</p>
                    {/* Optionally, display more details in dev mode: */}
                    {process.env.NODE_ENV === 'development' && <pre className="mt-4 text-sm text-gray-700">{JSON.stringify(error, null, 2)}</pre>}
                </div>
            ) : (!workshops || workshops.length === 0) ? (
                // Display "No workshops" message if data is empty
                <p className="text-center text-xl text-gray-600">No workshops available yet. Check back soon!</p>
            ) : (
                // Display workshops grid if data is available
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {workshops.map((workshop: WorkshopResponseDTO) => (
                        <div key={workshop.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
                            {/* If you have workshop images, you'd render them here */}
                            {/* <img src={workshop.imageUrl} alt={workshop.name} className="w-full h-48 object-cover" /> */}
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-2 text-gray-900">{workshop.name}</h2>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workshop.description}</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{workshop.size} m²</p>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {(workshop.activities && workshop.activities.length > 0) ?
                                        "Activities: " + workshop.activities.map(a => a.name).join(", ") :
                                        "No activities has been added yet"
                                    }
                                </p>
                                <div className='flex gap-3 justify-end'>
                                    <Link
                                        href={`/workshops/${workshop.id}/edit`} // Link to a dynamic workshop detail page
                                        className="inline-block bg-gray-100 border-blue-600 border text-white px-2 py-2 rounded-lg transition duration-300"
                                    >
                                        📝
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}