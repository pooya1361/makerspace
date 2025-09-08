//components/ScheduledLessonForm.tsx
'use client';

import { ScheduledLessonCreateDTO, ScheduledLessonResponseDTO } from '@/app/interfaces/api';
import { useCreateScheduledLessonMutation, useDeleteScheduledLessonMutation, useGetLessonsQuery, useGetUsersQuery, useUpdateScheduledLessonMutation } from '@/app/lib/features/api/apiSlice';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { revalidateLessonsPath } from '../actions';

// Type definition for the component's props
type ScheduledLessonFormProps = {
    initialScheduledLesson?: ScheduledLessonResponseDTO; // Make initialScheduledLesson optional for "add" mode
};

export default function ScheduledLessonForm({ initialScheduledLesson }: ScheduledLessonFormProps) {
    const router = useRouter();
    const durationInputRef = useRef<HTMLInputElement>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Determine if we are in "edit" mode or "add" mode
    const isEditMode = initialScheduledLesson !== undefined;

    // Initialize state based on mode
    const [startTime, setStartTime] = useState(initialScheduledLesson?.startTime);
    const [duration, setDuration] = useState<number>(initialScheduledLesson?.durationInMinutes || 60);
    const [lessonId, setLessonId] = useState<number | null>(
        initialScheduledLesson?.lesson?.id ?? null
    );
    const [instructorId, setInstructorId] = useState<number | null>(initialScheduledLesson?.instructor?.id ?? null);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    // Conditional RTK Query mutations
    const [updateScheduledLesson, { isLoading: isUpdating }] = useUpdateScheduledLessonMutation();
    const [deleteScheduledLesson, { isLoading: isDeleting }] = useDeleteScheduledLessonMutation();
    const [addScheduledLesson, { isLoading: isAdding }] = useCreateScheduledLessonMutation();

    const { data: lessons, isLoading: isLoadingLessons } = useGetLessonsQuery();
    const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();

    const isFormLoading = isUpdating || isDeleting || isAdding;

    // Focus management on mount
    useEffect(() => {
        if (durationInputRef.current && !startTime) {
            // If no start time, focus on duration field
            durationInputRef.current.focus();
        }
    }, [startTime]);

    useEffect(() => {
        setDuration(initialScheduledLesson?.durationInMinutes || 60);
        setLessonId(initialScheduledLesson?.lesson?.id ?? null);
        setStartTime(initialScheduledLesson?.startTime);
        setInstructorId(initialScheduledLesson?.instructor?.id ?? null);
        setFieldErrors({});
        setErrorMessage('');
        setSuccessMessage('');
    }, [initialScheduledLesson]);

    const handleLessonChange = (value: string) => {
        const id = value ? Number(value) : null;
        setLessonId(id);
        // Clear lesson-related errors
        if (fieldErrors.lesson) {
            setFieldErrors(prev => ({ ...prev, lesson: '' }));
        }
    };

    const handleUserChange = (value: string) => {
        const id = value ? Number(value) : null;
        setInstructorId(id);
        // Clear instructor-related errors
        if (fieldErrors.instructor) {
            setFieldErrors(prev => ({ ...prev, instructor: '' }));
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!instructorId) {
            errors.instructor = 'Instructor selection is required.';
        }

        if (!duration || duration <= 0) {
            errors.duration = 'Duration must be greater than 0 minutes.';
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
            if (fieldErrors.duration && durationInputRef.current) {
                durationInputRef.current.focus();
            }
            return;
        }

        try {
            if (isEditMode) {
                // --- EDIT LOGIC ---
                await updateScheduledLesson({
                    id: initialScheduledLesson!.id,
                    startTime,
                    durationInMinutes: duration!,
                    lessonId: lessonId as unknown as number,
                    instructorUserId: instructorId!
                }).unwrap();
                setSuccessMessage('Scheduled lesson updated successfully!');
            } else {
                // --- ADD LOGIC ---
                const newLesson: ScheduledLessonCreateDTO = {
                    id: -1,
                    startTime,
                    durationInMinutes: duration!,
                    lessonId: lessonId as unknown as number,
                    instructorUserId: instructorId!
                };
                await addScheduledLesson(newLesson).unwrap();
                setSuccessMessage('Scheduled lesson added successfully!');
            }

            await revalidateLessonsPath();

            // Announce success and redirect after a brief delay
            setTimeout(() => {
                router.push('/scheduled-lessons');
            }, 1500);

        } catch (err: any) {
            console.error(`Failed to ${isEditMode ? 'update' : 'add'} Scheduled Lesson:`, err);
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
        if (!initialScheduledLesson) return;

        try {
            await deleteScheduledLesson(initialScheduledLesson.id.toString()).unwrap();
            setSuccessMessage('Scheduled lesson deleted successfully!');
            await revalidateLessonsPath();

            setTimeout(() => {
                router.push('/scheduled-lessons');
            }, 1500);
        } catch (err: any) {
            console.error('Failed to delete Scheduled Lesson:', err);
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
                {isEditMode ? 'Edit Scheduled Lesson' : 'Add New Scheduled Lesson'}
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
                {/* Start Time Display (if exists) */}
                {startTime && (
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Scheduled Start Time:
                        </label>
                        <time
                            dateTime={startTime instanceof Date ? startTime.toISOString() : startTime}
                            className="block text-gray-700 text-sm mb-2 p-2 bg-gray-50 rounded border"
                        >
                            {moment(startTime).format('YYYY-MM-DD HH:mm')}
                        </time>
                    </div>
                )}

                {/* Duration Field */}
                <div className="mb-4">
                    <label
                        htmlFor="duration"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Duration (minutes): <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <input
                        ref={durationInputRef}
                        type="number"
                        id="duration"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500"
                        value={duration}
                        onChange={(e) => {
                            setDuration(Number(e.target.value));
                            if (fieldErrors.duration) {
                                setFieldErrors(prev => ({ ...prev, duration: '' }));
                            }
                        }}
                        disabled={isFormLoading}
                        min="1"
                        step="1"
                        required
                        aria-required="true"
                        aria-invalid={fieldErrors.duration ? 'true' : 'false'}
                        aria-describedby={fieldErrors.duration ? 'duration-error' : 'duration-help'}
                    />
                    {fieldErrors.duration && (
                        <p id="duration-error" className="text-red-600 text-sm mt-1" role="alert">
                            {fieldErrors.duration}
                        </p>
                    )}
                    <p id="duration-help" className="text-gray-500 text-sm mt-1">
                        Enter the lesson duration in minutes (e.g., 60 for 1 hour)
                    </p>
                </div>

                {/* Lesson Selection */}
                <div className="mb-6">
                    <label
                        htmlFor="lesson-select"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Lesson:
                    </label>
                    {isLoadingLessons ? (
                        <p aria-live="polite" className="text-gray-600">Loading lessons...</p>
                    ) : (
                        <>
                            {lessons && lessons.length > 0 ? (
                                <select
                                    id="lesson-select"
                                    onChange={(e) => handleLessonChange(e.target.value)}
                                    className="border border-gray-300 text-gray-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 block w-full p-2.5"
                                    value={lessonId ?? ''}
                                    disabled={isFormLoading}
                                    aria-describedby="lesson-help"
                                >
                                    <option value="">-- Select a Lesson --</option>
                                    {lessons.map(lesson => (
                                        <option key={lesson.id} value={lesson.id}>
                                            {lesson.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-600">No lessons have been added yet.</p>
                            )}
                            <p id="lesson-help" className="text-gray-500 text-sm mt-1">
                                Optional: Select the lesson to be taught
                            </p>
                        </>
                    )}
                </div>

                {/* Instructor Selection */}
                <div className="mb-6">
                    <label
                        htmlFor="instructor-select"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    >
                        Instructor: <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    {isLoadingUsers ? (
                        <p aria-live="polite" className="text-gray-600">Loading instructors...</p>
                    ) : (
                        <>
                            {users && users.length > 0 ? (
                                <select
                                    id="instructor-select"
                                    onChange={(e) => handleUserChange(e.target.value)}
                                    className="border border-gray-300 text-gray-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-blue-500 block w-full p-2.5"
                                    value={instructorId ?? ''}
                                    disabled={isFormLoading}
                                    required
                                    aria-required="true"
                                    aria-invalid={fieldErrors.instructor ? 'true' : 'false'}
                                    aria-describedby={fieldErrors.instructor ? 'instructor-error' : 'instructor-help'}
                                >
                                    <option value="">-- Select an Instructor --</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-gray-600">No instructors found.</p>
                            )}
                            {fieldErrors.instructor && (
                                <p id="instructor-error" className="text-red-600 text-sm mt-1" role="alert">
                                    {fieldErrors.instructor}
                                </p>
                            )}
                            <p id="instructor-help" className="text-gray-500 text-sm mt-1">
                                Select the instructor who will teach this lesson
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
                        href="/scheduled-lessons"
                        className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 transition duration-200 motion-reduce:transition-none"
                    >
                        Cancel
                    </Link>
                </div>

                {/* Hidden status messages for screen readers */}
                {isFormLoading && (
                    <div className="sr-only" aria-live="polite">
                        <span id="submit-status">
                            {isUpdating && "Updating scheduled lesson, please wait..."}
                            {isAdding && "Adding scheduled lesson, please wait..."}
                            {isDeleting && "Deleting scheduled lesson, please wait..."}
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
                            Are you sure you want to delete this scheduled lesson? This action cannot be undone.
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