// webapp/src/app/workshops/[id]/edit/WorkshopEditForm.tsx
'use client'; // This must be a Client Component

import { revalidateWorkshopsPath } from '@/app/actions'; // Your Server Action for revalidation
import { WorkshopResponseDTO } from '@/app/interfaces/api'; // Assuming you have this interface
import {
    useDeleteWorkshopGraphQLMutation,
    useGetActivitiesQuery,
    useUpdateWorkshopGraphQLMutation
} from '@/app/lib/features/api/apiSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type WorkshopEditFormProps = {
    initialWorkshop: WorkshopResponseDTO;
};

export default function WorkshopEditForm({ initialWorkshop }: WorkshopEditFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialWorkshop.name);
    const [description, setDescription] = useState(initialWorkshop.description);
    const [size, setSize] = useState(initialWorkshop.size.toString()); // Keep as string for input
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>(
        initialWorkshop.activities?.map(a => a.id) || []
    );

    const [updateWorkshop, { isLoading: isUpdating }] = useUpdateWorkshopGraphQLMutation();
    const [deleteWorkshop, { isLoading: isDeleting }] = useDeleteWorkshopGraphQLMutation();
    const { data: activities, isLoading: isLoadingActivities } = useGetActivitiesQuery();

    const isFormLoading = isUpdating || isDeleting;

    // Optional: Update form state if initialWorkshop changes (e.g., from a different edit link)
    useEffect(() => {
        setName(initialWorkshop.name);
        setDescription(initialWorkshop.description);
        setSize(initialWorkshop.size.toString());
    }, [initialWorkshop]);

    const handleActivityChange = (activityId: number) => {
        setSelectedActivityIds(prev =>
            prev.includes(activityId)
                ? prev.filter(id => id !== activityId)
                : [...prev, activityId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

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
            await updateWorkshop({
                id: initialWorkshop.id.toString(),
                workshop: {
                    id: initialWorkshop.id,
                    name,
                    description,
                    size: parsedSize,
                    activityIds: selectedActivityIds
                }
            }).unwrap();

            setSuccessMessage('Workshop updated successfully!');

            await revalidateWorkshopsPath();

            router.push('/workshops');

        } catch (err: any) {
            console.error('Failed to update workshop:', err);
            if ('data' in err && err.data?.message) {
                setErrorMessage(err.data.message);
            } else if ('error' in err) {
                setErrorMessage(err.error);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete workshop "${initialWorkshop.name}"?`)) {
            return;
        }

        try {
            deleteWorkshop(initialWorkshop.id.toString());
            setSuccessMessage('Workshop deleted successfully!');

            // Revalidate the /workshops path
            await revalidateWorkshopsPath();

            // Navigate back to the workshops list page after deletion
            // router.push(`/workshops?refresh=true`);
            router.push('/workshops');

        } catch (err: any) {
            console.error('Failed to delete workshop:', err);
            if (err.data && err.data.message) {
                setErrorMessage(err.data.message);
            } else if (err.error) {
                setErrorMessage(err.error);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    const filteredActivities = useMemo(() => {
        return activities?.filter(ac =>
            !ac.workshop || ac.workshop.id === initialWorkshop.id
        ) || [];
    }, [activities, initialWorkshop.id]);

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
                        Workshop Name:
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
                    <label htmlFor="size" className="block text-gray-700 text-sm font-bold mb-2">
                        Size (m²):
                    </label>
                    <input
                        type="number"
                        id="size"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        disabled={isFormLoading}
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Activities:
                    </label>
                    {isLoadingActivities ? (
                        <p>Loading activities...</p>
                    ) : (
                        filteredActivities.length > 0 ?
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {filteredActivities.map(activity => (
                                    <label key={activity.id} className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                            value={activity.id.toString()}
                                            checked={selectedActivityIds.includes(activity.id)}
                                            onChange={() => handleActivityChange(activity.id)}
                                            disabled={activity.workshop && activity.workshop.id != initialWorkshop.id}
                                        />
                                        <span className="ml-2 text-gray-700">{activity.name}</span>
                                    </label>
                                ))}
                            </div>
                            :
                            <span className="ml-2 text-gray-700">All the activities are already alocated</span>
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
                        href="/workshops"
                        className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800 "
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
