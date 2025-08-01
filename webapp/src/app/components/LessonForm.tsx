// webapp/src/app/Lessons/[id]/edit/LessonEditForm.tsx or a new path like /components/LessonForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useGetActivitiesQuery,
    useCreateLessonMutation, // <-- NEW: Add mutation hook
} from '@/app/lib/features/api/apiSlice';
import { revalidateLessonsPath } from '@/app/actions';
import { LessonResponseDTO } from '@/app/interfaces/api';
import { LessonCreateDTO } from '@/app/interfaces/api'; // Assuming you have this for add operations

// Type definition for the component's props
type LessonFormProps = {
    initialLesson?: LessonResponseDTO; // Make initialLesson optional for "add" mode
};

export default function LessonForm({ initialLesson }: LessonFormProps) {
    const router = useRouter();

    // Determine if we are in "edit" mode or "add" mode
    const isEditMode = initialLesson !== undefined;

    // Initialize state based on mode
    const [name, setName] = useState(initialLesson?.name || '');
    const [description, setDescription] = useState(initialLesson?.description || '');
    const [activityId, setActivityId] = useState<number | null>(
        initialLesson?.activity?.id ?? null // Use nullish coalescing for cleaner default
    );
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Conditional RTK Query mutations
    const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
    const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
    const [addLesson, { isLoading: isAdding }] = useCreateLessonMutation(); // <-- NEW: Add mutation

    const { data: activities, isLoading: isLoadingActivities } = useGetActivitiesQuery();

    const isFormLoading = isUpdating || isDeleting || isAdding; // Include isAdding

    // Optional: Update form state if initialLesson changes (e.g., from a different edit link)
    // This useEffect ensures that if the component is reused for a *different* edit item
    // without remounting, the form fields update.
    useEffect(() => {
        setName(initialLesson?.name || '');
        setDescription(initialLesson?.description || '');
        setActivityId(initialLesson?.activity?.id ?? null);
    }, [initialLesson]);

    const handleActivityChange = (value: string) => {
        // Convert string to number, if empty string, set to null
        const id = value === "-1" ? Number(value) : null;
        setActivityId(id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!name.trim()) {
            setErrorMessage('Lesson Name is required.'); // Be more specific
            return;
        }

        try {
            if (isEditMode) {
                // --- EDIT LOGIC ---
                await updateLesson({
                    id: initialLesson!.id, // 'id' is guaranteed in edit mode
                    name,
                    description,
                    activityId: activityId as unknown as number,
                }).unwrap();
                setSuccessMessage('Lesson updated successfully!');
            } else {
                // --- ADD LOGIC ---
                const newLesson: LessonCreateDTO = {
                    id: -1,
                    name,
                    description,
                    activityId: activityId as unknown as number,
                };
                await addLesson(newLesson).unwrap();
                setSuccessMessage('Lesson added successfully!');
            }

            await revalidateLessonsPath();
            router.push('/lessons');

        } catch (err: any) { // Consider type narrowing here, as discussed previously
            console.error(`Failed to ${isEditMode ? 'update' : 'add'} Lesson:`, err);
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
        if (!initialLesson || !window.confirm(`Are you sure you want to delete Lesson "${initialLesson.name}"?`)) {
            return;
        }

        try {
            await deleteLesson(initialLesson.id.toString()).unwrap();
            setSuccessMessage('Lesson deleted successfully!');
            await revalidateLessonsPath();
            router.push('/lessons');
        } catch (err: any) { // Consider type narrowing
            console.error('Failed to delete Lesson:', err);
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
                {isEditMode ? 'Edit Lesson' : 'Add New Lesson'}
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
                        Lesson Name:
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
                        Activity:
                    </label>
                    {isLoadingActivities ? (
                        <p>Loading activities...</p>
                    ) : (
                        <>
                            {activities && activities.length > 0 ? ( // Check for activities existence and length
                                <select
                                    id="activities"
                                    onChange={(e) => handleActivityChange(e.target.value)}
                                    className="border text-gray-700 text-sm rounded-lg block w-full p-2.5"
                                    value={activityId ?? ''} // Use empty string for null/undefined to select default option
                                >
                                    <option value={-1}>-- Select a Activity (Optional) --</option> {/* Added a placeholder option */}
                                    {activities.map(workshop => (
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
                        href="/Lessons"
                        className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800 "
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}