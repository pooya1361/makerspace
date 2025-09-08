// webapp/src/app/activities/[id]/edit/ActivityEditForm.tsx or a new path like /components/ActivityForm.tsx
'use client';

import { revalidateActivitiesPath } from '@/app/actions';
import { ActivityCreateDTO, ActivityResponseDTO } from '@/app/interfaces/api';
import {
    useCreateActivityMutation,
    useDeleteActivityMutation,
    useGetWorkshopsQuery,
    useUpdateActivityMutation,
} from '@/app/lib/features/api/apiSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Type definition for the component's props
type ActivityFormProps = {
    initialActivity?: ActivityResponseDTO; // Make initialActivity optional for "add" mode
};

export default function ActivityForm({ initialActivity }: ActivityFormProps) {
    const router = useRouter();
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Conditional RTK Query mutations
    const [updateActivity, { isLoading: isUpdating }] = useUpdateActivityMutation();
    const [deleteActivity, { isLoading: isDeleting }] = useDeleteActivityMutation();
    const [addActivity, { isLoading: isAdding }] = useCreateActivityMutation();

    const { data: workshops, isLoading: isLoadingWorkshops } = useGetWorkshopsQuery();

    const isFormLoading = isUpdating || isDeleting || isAdding;

    // Focus management on mount
    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    // Optional: Update form state if initialActivity changes
    useEffect(() => {
        setName(initialActivity?.name || '');
        setDescription(initialActivity?.description || '');
        setWorkshopId(initialActivity?.workshop?.id ?? null);
        setFieldErrors({});
        setErrorMessage('');
        setSuccessMessage('');
    }, [initialActivity]);

    const handleWorkshopChange = (value: string) => {
        // Convert string to number, if empty string, set to null
        const id = value ? Number(value) : null;
        setWorkshopId(id);
        // Clear any workshop-related errors
        if (fieldErrors.workshop) {
            setFieldErrors(prev => ({ ...prev, workshop: '' }));
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!name.trim()) {
            errors.name = 'Activity name is required.';
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setFieldErrors({});

        if (!validateForm()) {
            // Focus on first error field
            if (nameInputRef.current && fieldErrors.name) {
                nameInputRef.current.focus();
            }
            return;
        }

        try {
            if (isEditMode) {
                // --- EDIT LOGIC ---
                await updateActivity({
                    id: initialActivity!.id,
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

            // Announce success and redirect after a brief delay
            setTimeout(() => {
                router.push('/activities');
            }, 1500);

        } catch (err: any) {
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

    const handleDeleteConfirm = async () => {
        if (!initialActivity) return;

        try {
            await deleteActivity(initialActivity.id.toString()).unwrap();
            setSuccessMessage('Activity deleted successfully!');
            await revalidateActivitiesPath();

            setTimeout(() => {
                router.push('/activities');
            }, 1500);
        } catch (err: any) {
            console.error('Failed to delete activity:', err);
            if (err.data && err.data.message) {
                setErrorMessage(err.data.message);
            } else if (err.error) {
                setErrorMessage(err.error);
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-gray-700">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
                {isEditMode ? 'Edit Activity' : 'Add New Activity'}
            </h1>

            {/* Status Messages */}
            {errorMessage && (
                <div
                    className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-4"
                    role="alert"
                    aria-live="assertive"
                >
                    <p className="font-bold">Error!</p>
                    <p>{errorMessage}</p>
                </div>
            )}
            {successMessage && (
                <div
                    className="bg-green-50 border-l-4 border-green-400 text-green-700 p-4 mb-4"
                    role="alert"
                    aria-live="polite"
                >
                    <p className="font-bold">Success!</p>
                    <p>{successMessage}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
                {/* Activity Name Field */}
                <div className="mb-4">
                    <label
                        htmlFor="activity-name"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Activity Name: <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                        ref={nameInputRef}
                        type="text"
                        id="activity-name"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (fieldErrors.name) {
                                setFieldErrors(prev => ({ ...prev, name: '' }));
                            }
                        }}
                        disabled={isFormLoading}
                        required
                        aria-required="true"
                        aria-invalid={fieldErrors.name ? 'true' : 'false'}
                        aria-describedby={fieldErrors.name ? 'name-error' : 'name-help'}
                    />
                    {fieldErrors.name && (
                        <p id="name-error" className="text-red-600 text-sm mt-1" role="alert">
                            {fieldErrors.name}
                        </p>
                    )}
                    <p id="name-help" className="text-gray-500 text-sm mt-1">
                        Enter a descriptive name for the activity
                    </p>
                </div>

                {/* Description Field */}
                <div className="mb-4">
                    <label
                        htmlFor="activity-description"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Description:
                    </label>
                    <textarea
                        id="activity-description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 h-32"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isFormLoading}
                        aria-describedby="description-help"
                        placeholder="Describe what this activity involves..."
                    />
                    <p id="description-help" className="text-gray-500 text-sm mt-1">
                        Optional: Provide details about the activity
                    </p>
                </div>

                {/* Workshop Field */}
                <div className="mb-6">
                    <label
                        htmlFor="workshop-select"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Workshop:
                    </label>
                    {isLoadingWorkshops ? (
                        <p aria-live="polite" className="text-gray-600">Loading workshops...</p>
                    ) : (
                        <>
                            {workshops && workshops.length > 0 ? (
                                <select
                                    id="workshop-select"
                                    onChange={(e) => handleWorkshopChange(e.target.value)}
                                    className="border border-gray-300 text-gray-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 block w-full p-2.5"
                                    value={workshopId ?? ''}
                                    disabled={isFormLoading}
                                    aria-describedby="workshop-help"
                                >
                                    <option value="">-- Select a Workshop (Optional) --</option>
                                    {workshops.map(workshop => (
                                        <option key={workshop.id} value={workshop.id}>
                                            {workshop.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-600">No workshops have been added yet.</p>
                            )}
                            <p id="workshop-help" className="text-gray-500 text-sm mt-1">
                                Optional: Associate this activity with a specific workshop
                            </p>
                        </>
                    )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-between">
                    <div className='flex gap-3'>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 motion-reduce:transition-none"
                            disabled={isFormLoading}
                            aria-describedby={isFormLoading ? "submit-status" : undefined}
                        >
                            {isEditMode ? (isUpdating ? 'Updating...' : 'Update') : (isAdding ? 'Adding...' : 'Add')}
                        </button>

                        {isEditMode && (
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 motion-reduce:transition-none"
                                disabled={isFormLoading}
                                aria-describedby={isDeleting ? "delete-status" : undefined}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        )}
                    </div>

                    <Link
                        href="/activities"
                        className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition duration-200 motion-reduce:transition-none"
                    >
                        Cancel
                    </Link>
                </div>

                {/* Hidden status messages for screen readers */}
                {isFormLoading && (
                    <div className="sr-only" aria-live="polite">
                        <span id="submit-status">
                            {isUpdating && "Updating activity, please wait..."}
                            {isAdding && "Adding activity, please wait..."}
                            {isDeleting && "Deleting activity, please wait..."}
                        </span>
                    </div>
                )}
            </form>

            {/* Accessible Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-dialog-title"
                    aria-describedby="delete-dialog-description"
                >
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4">
                        <h2 id="delete-dialog-title" className="text-lg font-bold mb-4 text-gray-900">
                            Confirm Delete
                        </h2>
                        <p id="delete-dialog-description" className="text-gray-700 mb-6">
                            {`Are you sure you want to delete the activity ${initialActivity?.name}? This action cannot be undone.`}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}