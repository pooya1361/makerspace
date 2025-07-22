// webapp/src/app/activities/[id]/edit/ActivityEditForm.tsx or a new path like /components/ActivityForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    useUpdateActivityMutation,
    useDeleteActivityMutation,
    useGetWorkshopsQuery,
    useCreateActivityMutation, // <-- NEW: Add mutation hook
} from '@/app/lib/features/api/apiSlice';
import { revalidateActivitiesPath } from '@/app/actions';
import { ActivityResponseDTO } from '@/app/interfaces/api';
import { ActivityCreateDTO } from '@/app/interfaces/api'; // Assuming you have this for add operations

// Type definition for the component's props
type ActivityFormProps = {
    initialActivity?: ActivityResponseDTO; // Make initialActivity optional for "add" mode
};

export default function ActivityForm({ initialActivity }: ActivityFormProps) {
    const router = useRouter();

    // Determine if we are in "edit" mode or "add" mode
    const isEditMode = initialActivity !== undefined;

    // Initialize state based on mode
    const [name, setName] = useState(initialActivity?.name || '');
    const [description, setDescription] = useState(initialActivity?.description || '');
    const [workshopId, setWorkshopId] = useState<number | null>(
        initialActivity?.workshop?.id ?? null // Use nullish coalescing for cleaner default
    );
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Conditional RTK Query mutations
    const [updateActivity, { isLoading: isUpdating }] = useUpdateActivityMutation();
    const [deleteActivity, { isLoading: isDeleting }] = useDeleteActivityMutation();
    const [addActivity, { isLoading: isAdding }] = useCreateActivityMutation(); // <-- NEW: Add mutation

    const { data: workshops, isLoading: isLoadingWorkshops } = useGetWorkshopsQuery();

    const isFormLoading = isUpdating || isDeleting || isAdding; // Include isAdding

    // Optional: Update form state if initialActivity changes (e.g., from a different edit link)
    // This useEffect ensures that if the component is reused for a *different* edit item
    // without remounting, the form fields update.
    useEffect(() => {
        setName(initialActivity?.name || '');
        setDescription(initialActivity?.description || '');
        setWorkshopId(initialActivity?.workshop?.id ?? null);
    }, [initialActivity]);

    const handleWorkshopChange = (value: string) => {
        // Convert string to number, if empty string, set to null
        const id = value ? Number(value) : null;
        setWorkshopId(id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!name.trim()) {
            setErrorMessage('Activity Name is required.'); // Be more specific
            return;
        }

        try {
            if (isEditMode) {
                // --- EDIT LOGIC ---
                await updateActivity({
                    id: initialActivity!.id, // 'id' is guaranteed in edit mode
                    name,
                    description,
                    workshopId: workshopId as unknown as number,
                }).unwrap();
                setSuccessMessage('Activity updated successfully!');
            } else {
                // --- ADD LOGIC ---
                const newActivity: ActivityCreateDTO = {
                    id: -1,
                    name,
                    description,
                    workshopId: workshopId as unknown as number,
                };
                await addActivity(newActivity).unwrap();
                setSuccessMessage('Activity added successfully!');
            }

            await revalidateActivitiesPath();
            router.push(`/activities?refresh=true`);
            router.replace('/activities'); // Replace history entry

        } catch (err: any) { // Consider type narrowing here, as discussed previously
            console.error(`Failed to ${isEditMode ? 'update' : 'add'} activity:`, err);
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
        if (!initialActivity || !window.confirm(`Are you sure you want to delete activity "${initialActivity.name}"?`)) {
            return;
        }

        try {
            await deleteActivity(initialActivity.id.toString()).unwrap();
            setSuccessMessage('Activity deleted successfully!');
            await revalidateActivitiesPath();
            router.push(`/activities?refresh=true`);
            router.replace('/activities');
        } catch (err: any) { // Consider type narrowing
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
            <h2 className="text-2xl font-bold mb-6 text-center">
                {isEditMode ? 'Edit Activity' : 'Add New Activity'}
            </h2>
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
                        <>
                            {workshops && workshops.length > 0 ? ( // Check for workshops existence and length
                                <select
                                    id="workshops"
                                    onChange={(e) => handleWorkshopChange(e.target.value)}
                                    className="border text-gray-700 text-sm rounded-lg block w-full p-2.5"
                                    value={workshopId ?? ''} // Use empty string for null/undefined to select default option
                                >
                                    <option value="undefined">-- Select a Workshop (Optional) --</option> {/* Added a placeholder option */}
                                    {workshops.map(workshop => (
                                        <option key={workshop.id} value={workshop.id}>
                                            {workshop.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="ml-2 text-gray-700">No workshop has been added yet.</span>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className='flex gap-3'>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                            disabled={isFormLoading}
                        >
                            {isEditMode ? (isUpdating ? 'Updating...' : 'Update') : (isAdding ? 'Adding...' : 'Add')}
                        </button>
                        {isEditMode && ( // Only show delete button in edit mode
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                                disabled={isFormLoading}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        )}
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