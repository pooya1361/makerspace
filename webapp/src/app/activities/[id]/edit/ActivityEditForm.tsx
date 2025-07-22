/* eslint-disable @typescript-eslint/no-explicit-any */
// webapp/src/app/activities/[id]/edit/ActivityEditForm.tsx
'use client'; // This must be a Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    useUpdateActivityMutation,
    useDeleteActivityMutation,
    useGetWorkshopsQuery
} from '@/app/lib/features/api/apiSlice';
import { revalidateActivitiesPath } from '@/app/actions'; // Your Server Action for revalidation
import { ActivityResponseDTO } from '@/app/interfaces/api'; // Assuming you have this interface

type ActivityEditFormProps = {
    initialActivity: ActivityResponseDTO;
};

export default function ActivityEditForm({ initialActivity }: ActivityEditFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialActivity.name);
    const [description, setDescription] = useState(initialActivity.description);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [workshopId, setWorkshopId] = useState<number | null>(initialActivity.workshop?.id)

    const [updateActivity, { isLoading: isUpdating }] = useUpdateActivityMutation();
    const [deleteActivity, { isLoading: isDeleting }] = useDeleteActivityMutation();
    const { data: workshops, isLoading: isLoadingWorkshops } = useGetWorkshopsQuery();

    const isFormLoading = isUpdating || isDeleting;

    // Optional: Update form state if initialActivity changes (e.g., from a different edit link)
    useEffect(() => {
        setName(initialActivity.name);
        setDescription(initialActivity.description);
    }, [initialActivity]);

    const handleWorkshopChange = (workshopId: number) => {
        setWorkshopId(workshopId || null)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!name.trim()) {
            setErrorMessage('All fields are required.');
            return;
        }

        try {
            // Call the RTK Query mutation to update the activity
            await updateActivity({
                id: initialActivity.id,
                name,
                description,
                workshopId: workshopId as unknown as number
            }).unwrap();

            setSuccessMessage('Activity updated successfully!');

            // Revalidate the /activities path to show the updated list
            await revalidateActivitiesPath();

            // Navigate back to the activities list page, forcing a refresh
            router.push(`/activities?refresh=true`);
            router.replace('/activities');

        } catch (err: any) {
            console.error('Failed to update activity:', err);
            if (err.data && err.data.message) {
                setErrorMessage(err.data.message);
            } else if (err.error) {
                setErrorMessage(err.error);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete activity "${initialActivity.name}"?`)) {
            return;
        }

        try {
            await deleteActivity(initialActivity.id.toString()).unwrap();
            setSuccessMessage('Activity deleted successfully!');

            // Revalidate the /activities path
            await revalidateActivitiesPath();

            // Navigate back to the activities list page after deletion
            router.push(`/activities?refresh=true`);
            router.replace('/activities');

        } catch (err: any) {
            console.error('Failed to delete activity:', err);
            if (err.data && err.data.message) {
                setErrorMessage(err.data.message);
            } else if (err.error) {
                setErrorMessage(err.error);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
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
                        Activity Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isFormLoading}
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
                        disabled={isFormLoading}
                    ></textarea>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Workshop:
                    </label>
                    {isLoadingWorkshops ? (
                        <p>Loading workshops...</p>
                    ) : (
                        Number(workshops?.length) > 0 ?
                            <select id="workshops"
                                onChange={(e) => handleWorkshopChange(Number(e.target.value))}
                                className="border text-gray-700 text-sm rounded-lg block w-full p-2.5"
                                value={workshopId ?? -1}
                            >
                                <option key={-1} className="inline-flex items-center" value={undefined}></option>
                                {workshops!.map(workshop => (
                                    <option key={workshop.id} className="inline-flex items-center" value={workshop.id}>
                                        {workshop.name}
                                    </option>
                                ))}
                            </select>
                            :
                            <span className="ml-2 text-gray-700">No workshpo has been added yet.</span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className='flex gap-3'>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            disabled={isFormLoading}
                        >
                            {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                        <button
                            type="button" // Important: type="button" to prevent form submission
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            disabled={isFormLoading}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                    <Link
                        href="/activities"
                        className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800 "
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
