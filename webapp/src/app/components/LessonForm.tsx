// webapp/src/app/Lessons/[id]/edit/LessonEditForm.tsx or a new path like /components/LessonForm.tsx
'use client';

import { revalidateLessonsPath } from '@/app/actions';
import { LessonCreateDTO, LessonResponseDTO } from '@/app/interfaces/api';
import {
    useCreateLessonMutation,
    useDeleteLessonMutation,
    useGetActivitiesQuery,
    useUpdateLessonMutation,
} from '@/app/lib/features/api/apiSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Type definition for the component's props
type LessonFormProps = {
    initialLesson?: LessonResponseDTO; // Make initialLesson optional for "add" mode
};

export default function LessonForm({ initialLesson }: LessonFormProps) {
    const router = useRouter();
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Determine if we are in "edit" mode or "add" mode
    const isEditMode = initialLesson !== undefined;

    // Initialize state based on mode
    const [name, setName] = useState(initialLesson?.name || '');
    const [description, setDescription] = useState(initialLesson?.description || '');
    const [activityId, setActivityId] = useState<number>(
        initialLesson?.activity?.id || -1
    );
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Conditional RTK Query mutations
    const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
    const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();
    const [addLesson, { isLoading: isAdding }] = useCreateLessonMutation();

    const { data: activities, isLoading: isLoadingActivities, isError, error } = useGetActivitiesQuery();

    const isFormLoading = isUpdating || isDeleting || isAdding;

    // Focus management on mount
    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    // Handle the case where lesson is deleted
    useEffect(() => {
        if (isError && error && (error as any)?.status === 404) {
            console.log('Lesson not found, redirecting...');
            router.replace('/lessons');
            return;
        }
    }, [isError, error, router]);

    useEffect(() => {
        setName(initialLesson?.name || '');
        setDescription(initialLesson?.description || '');
        setActivityId(initialLesson?.activity?.id || -1);
        setFieldErrors({});
        setErrorMessage('');
        setSuccessMessage('');
    }, [initialLesson]);

    const handleActivityChange = (value: string) => {
        const id = value ? Number(value) : -1;
        setActivityId(id);
        // Clear activity-related errors
        if (fieldErrors.activity) {
            setFieldErrors(prev => ({ ...prev, activity: '' }));
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!name.trim()) {
            errors.name = 'Lesson name is required.';
        }

        if (!activityId || activityId < 1) {
            errors.activity = 'Activity selection is required.';
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
            if (fieldErrors.name && nameInputRef.current) {
                nameInputRef.current.focus();
            }
            return;
        }

        try {
            if (isEditMode) {
                // --- EDIT LOGIC ---
                await updateLesson({
                    id: initialLesson!.id,
                    name,
                    description,
                    activityId: activityId,
                }).unwrap();
                setSuccessMessage('Lesson updated successfully!');
            } else {
                // --- ADD LOGIC ---
                const newLesson: LessonCreateDTO = {
                    id: -1,
                    name,
                    description,
                    activityId: activityId,
                };
                await addLesson(newLesson).unwrap();
                setSuccessMessage('Lesson added successfully!');
            }

            await revalidateLessonsPath();

            // Announce success and redirect after a brief delay
            setTimeout(() => {
                router.push('/lessons');
            }, 1500);

        } catch (err: any) {
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

    const handleDeleteConfirm = async () => {
        if (!initialLesson) return;

        try {
            await deleteLesson(initialLesson.id.toString()).unwrap();
            setSuccessMessage('Lesson deleted successfully!');
            await revalidateLessonsPath();

            setTimeout(() => {
                router.push('/lessons');
            }, 1500);
        } catch (err: any) {
            console.error('Failed to delete Lesson:', err);
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
                {isEditMode ? 'Edit Lesson' : 'Add New Lesson'}
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
                {/* Lesson Name Field */}
                <div className="mb-4">
                    <label
                        htmlFor="lesson-name"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Lesson Name: <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                        ref={nameInputRef}
                        type="text"
                        id="lesson-name"
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
                        Enter a descriptive name for the lesson
                    </p>
                </div>

                {/* Description Field */}
                <div className="mb-4">
                    <label
                        htmlFor="lesson-description"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Description:
                    </label>
                    <textarea
                        id="lesson-description"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 h-32"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isFormLoading}
                        aria-describedby="description-help"
                        placeholder="Describe what this lesson covers..."
                    />
                    <p id="description-help" className="text-gray-500 text-sm mt-1">
                        Optional: Provide details about the lesson content
                    </p>
                </div>

                {/* Activity Field */}
                <div className="mb-6">
                    <label
                        htmlFor="activity-select"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Activity: <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    {isLoadingActivities ? (
                        <p aria-live="polite" className="text-gray-600">Loading activities...</p>
                    ) : (
                        <>
                            {activities && activities.length > 0 ? (
                                <select
                                    id="activity-select"
                                    onChange={(e) => handleActivityChange(e.target.value)}
                                    className="border border-gray-300 text-gray-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 block w-full p-2.5"
                                    value={activityId > 0 ? activityId : ''}
                                    disabled={isFormLoading}
                                    required
                                    aria-required="true"
                                    aria-invalid={fieldErrors.activity ? 'true' : 'false'}
                                    aria-describedby={fieldErrors.activity ? 'activity-error' : 'activity-help'}
                                >
                                    <option value="">-- Select an Activity --</option>
                                    {activities.map(activity => (
                                        <option key={activity.id} value={activity.id}>
                                            {activity.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-600">No activities have been added yet.</p>
                            )}
                            {fieldErrors.activity && (
                                <p id="activity-error" className="text-red-600 text-sm mt-1" role="alert">
                                    {fieldErrors.activity}
                                </p>
                            )}
                            <p id="activity-help" className="text-gray-500 text-sm mt-1">
                                Select the activity this lesson will teach
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
                        href="/lessons"
                        className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition duration-200 motion-reduce:transition-none"
                    >
                        Cancel
                    </Link>
                </div>

                {/* Hidden status messages for screen readers */}
                {isFormLoading && (
                    <div className="sr-only" aria-live="polite">
                        <span id="submit-status">
                            {isUpdating && "Updating lesson, please wait..."}
                            {isAdding && "Adding lesson, please wait..."}
                            {isDeleting && "Deleting lesson, please wait..."}
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
                            {`Are you sure you want to delete the lesson ${initialLesson?.name}? This action cannot be undone.`}
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