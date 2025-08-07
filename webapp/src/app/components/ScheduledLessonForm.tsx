//components/ScheduledLessonForm.tsx
'use client';

import { ScheduledLessonCreateDTO, ScheduledLessonResponseDTO } from '@/app/interfaces/api';
import { useCreateScheduledLessonMutation, useDeleteScheduledLessonMutation, useGetLessonsQuery, useGetUsersQuery, useUpdateScheduledLessonMutation } from '@/app/lib/features/api/apiSlice';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { revalidateLessonsPath } from '../actions';

// Type definition for the component's props
type ScheduledLessonFormProps = {
    initialScheduledLesson?: ScheduledLessonResponseDTO; // Make initialScheduledLesson optional for "add" mode
};

export default function ScheduledLessonForm({ initialScheduledLesson }: ScheduledLessonFormProps) {
    const router = useRouter();

    // Determine if we are in "edit" mode or "add" mode
    const isEditMode = initialScheduledLesson !== undefined;

    // Initialize state based on mode
    const [startTime, setStartTime] = useState(initialScheduledLesson?.startTime);
    const [duration, setDuration] = useState<number>(initialScheduledLesson?.durationInMinutes || 60);
    const [lessonId, setLessonId] = useState<number | null>(
        initialScheduledLesson?.lesson?.id ?? null // Use nullish coalescing for cleaner default
    );
    const [instructorId, setInstructorId] = useState<number | null>(initialScheduledLesson?.instructor?.id ?? null);

    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Conditional RTK Query mutations
    const [updateScheduledLesson, { isLoading: isUpdating }] = useUpdateScheduledLessonMutation();
    const [deleteScheduledLesson, { isLoading: isDeleting }] = useDeleteScheduledLessonMutation();
    const [addScheduledLesson, { isLoading: isAdding }] = useCreateScheduledLessonMutation(); // <-- NEW: Add mutation

    const { data: lessons, isLoading: isLoadingLessons } = useGetLessonsQuery();
    const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();

    const isFormLoading = isUpdating || isDeleting || isAdding; // Include isAdding

    useEffect(() => {
        setDuration(initialScheduledLesson?.durationInMinutes || 60)
        setLessonId(initialScheduledLesson?.lesson?.id ?? null)
        setStartTime(initialScheduledLesson?.startTime)
        setInstructorId(initialScheduledLesson?.instructor?.id ?? null)
    }, [initialScheduledLesson]);

    const handleLessonChange = (value: string) => {
        // Convert string to number, if empty string, set to null
        const id = value !== "-1" ? Number(value) : null;
        setLessonId(id);
    };

    const handleUserChange = (value: string) => {
        // Convert string to number, if empty string, set to null
        const id = value !== "-1" ? Number(value) : null;
        setInstructorId(id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!instructorId) {
            setErrorMessage('Instructor is required.'); // Be more specific
            return;
        }

        if (!duration) {
            setErrorMessage('Duration is required.'); // Be more specific
            return;
        }

        try {
            if (isEditMode) {
                // --- EDIT LOGIC ---
                await updateScheduledLesson({
                    id: initialScheduledLesson!.id, // 'id' is guaranteed in edit mode
                    startTime,
                    durationInMinutes: duration!,
                    lessonId: lessonId as unknown as number,
                    instructorUserId: instructorId!
                }).unwrap();
                setSuccessMessage('Scheduled Lesson updated successfully!');
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
                setSuccessMessage('Scheduled Lesson added successfully!');
            }

            await revalidateLessonsPath();
            router.push('/scheduled-lessons');

        } catch (err: any) { // Consider type narrowing here, as discussed previously
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

    const handleDelete = async () => {
        if (!initialScheduledLesson || !window.confirm(`Are you sure you want to delete Scheduled Lesson "${initialScheduledLesson.lesson.name}"?`)) {
            return;
        }

        try {
            await deleteScheduledLesson(initialScheduledLesson.id.toString()).unwrap();
            setSuccessMessage('Scheduled Lesson deleted successfully!');
            await revalidateLessonsPath();
            router.push('/scheduled-lessons');
        } catch (err: any) { // Consider type narrowing
            console.error('Failed to delete Scheduled Lesson:', err);
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
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg text-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-center">
                {isEditMode ? 'Edit Scheduled Lesson' : 'Add New Scheduled Lesson'}
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
                {startTime ?
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Scheduled start time:
                        </label>
                        <span className="block text-gray-700 text-sm mb-2">{moment(startTime).format('YYYY-MM-DD HH:mm')}</span>
                        {/* <DateTimeInput value={startTime} onChange={setStartTime} /> */}
                    </div> : undefined
                }

                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                        Duration:
                    </label>
                    <input
                        type="number" // Use type="number" for numeric input, but handle as string initially for empty state
                        id="duration"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        disabled={isFormLoading}
                        min="0" // HTML5 validation hint
                        step="1" // Allow decimal sizes
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Lesson
                    </label>
                    {isLoadingLessons ? (
                        <p>Loading lessons...</p>
                    ) : (
                        <>
                            {lessons && lessons.length > 0 ? ( // Check for lessons existence and length
                                <select
                                    id="lessons"
                                    onChange={(e) => handleLessonChange(e.target.value)}
                                    className="border text-gray-700 text-sm rounded-lg block w-full p-2.5"
                                    value={lessonId ?? ''} // Use empty string for null/undefined to select default option
                                >
                                    <option value={-1}>-- Select a Lesson --</option> {/* Added a placeholder option */}
                                    {lessons.map(lesson => (
                                        <option key={lesson.id} value={lesson.id}>
                                            {lesson.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="ml-2 text-gray-700">No lesson has been added yet.</span>
                            )}
                        </>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Instructor
                    </label>
                    {isLoadingUsers ? (
                        <p>Loading users...</p>
                    ) : (
                        <>
                            {users && users.length > 0 ? ( // Check for users existence and length
                                <select
                                    id="users"
                                    onChange={(e) => handleUserChange(e.target.value)}
                                    className="border text-gray-700 text-sm rounded-lg block w-full p-2.5"
                                    value={instructorId ?? ''} // Use empty string for null/undefined to select default option
                                >
                                    <option value={-1}>-- Select an instructor --</option> {/* Added a placeholder option */}
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>
                                            {user.firstName} {user.lastName}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <span className="ml-2 text-gray-700">No user found.</span>
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
                        href="/scheduled-lessons"
                        className="inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800 "
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}