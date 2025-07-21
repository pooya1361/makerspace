// webapp/src/app/workshops/add/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in App Router
import Link from 'next/link';
import { apiSlice, useCreateWorkshopMutation } from '@/app/lib/features/api/apiSlice';
import { revalidateWorkshopsPath } from '@/app/actions';
import { store } from '@/app/lib/store';

export default function AddWorkshopPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [size, setSize] = useState(''); // Use string for input, convert to number later
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // RTK Query mutation hook
    const [createWorkshop, { isLoading, isSuccess, isError, error }] = useCreateWorkshopMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        // Basic client-side validation
        if (!name.trim() || !size.trim()) {
            setErrorMessage('All fields are required.');
            return;
        }
        const parsedSize = parseFloat(size);
        if (isNaN(parsedSize) || parsedSize <= 0) {
            setErrorMessage('Size must be a positive number.');
            return;
        }

        try {
            await createWorkshop({
                name, description, size: parsedSize,
                activityIds: []
            }).unwrap();
            setName('');
            setDescription('');
            setSize('');

            await revalidateWorkshopsPath();

            router.push(`/workshops?refresh=true`); // To enable force fetch in workshops page
            router.replace('/workshops'); // for a clean url display

        } catch (err: any) {
            console.error('Failed to add workshop:', err);
            // Display error from RTK Query (backend validation or network error)
            if (err.data && err.data.message) {
                setErrorMessage(err.data.message);
            } else if (err.error) {
                setErrorMessage(err.error); // For generic fetch errors
            }
            else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="container mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-bold text-blue-800 mb-8 text-center">Add New Workshop</h1>

            <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
                {errorMessage && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Error!</p>
                        <p>{errorMessage}</p>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Success!</p>
                        <p>{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Workshop Name:
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                            Description:
                        </label>
                        <textarea
                            id="description"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isLoading}
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="size" className="block text-gray-700 text-sm font-bold mb-2">
                            Size (m²):
                        </label>
                        <input
                            type="number" // Use type="number" for numeric input, but handle as string initially for empty state
                            id="size"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            disabled={isLoading}
                            min="0" // HTML5 validation hint
                            step="0.01" // Allow decimal sizes
                            required
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adding...' : 'Add Workshop'}
                        </button>
                        <Link
                            href="/workshops"
                            className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}