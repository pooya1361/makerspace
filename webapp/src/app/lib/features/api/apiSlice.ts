// webapp/src/lib/features/api/apiSlice.ts
import { ActivityCreateDTO, ActivityResponseDTO, Lesson, LessonCreateDTO, LessonResponseDTO, ProposedTimeSlot, ProposedTimeSlotResponseDTO, ScheduledLessonCreateDTO, ScheduledLessonResponseDTO, SummaryResponseDTO, UserResponseDTO, WorkshopCreateDTO, WorkshopResponseDTO } from '@/app/interfaces/api'; // Adjust path as needed
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api', // Unique name for the slice in the Redux store
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    }),
    tagTypes: ['ScheduledLesson', 'Lesson', 'ProposedTimeSlot', 'Vote', 'Summary', 'Workshop', 'Activity', 'User'],
    endpoints: (builder) => ({
        getProposedTimeSlotById: builder.query<ProposedTimeSlot, string>({
            query: (id) => `/api/proposed-time-slots/${id}`,
            providesTags: (result, error, id) => [{ type: 'ProposedTimeSlot', id }],
        }),

        getVotesForProposedTimeSlot: builder.query<ProposedTimeSlotResponseDTO, string>({
            query: (proposedTimeSlotId) => `/api/proposed-time-slots/${proposedTimeSlotId}`,
            providesTags: (result, error, proposedTimeSlotId) => [{ type: 'Vote', id: proposedTimeSlotId }],
        }),

        getOverallSummary: builder.query<SummaryResponseDTO, void>({
            query: () => '/api/summary',
            providesTags: ['Summary'], // Tag for caching
        }),

        getUsers: builder.query<UserResponseDTO[], void>({
            query: () => '/api/users',
            providesTags: ['User'], // Tag for caching
        }),

        /**
        * ------------------------------------------------------------ Scheduled Lesson ------------------------------------------------------------
        */
        getScheduledLessons: builder.query<ScheduledLessonResponseDTO[], void>({
            query: () => '/api/scheduled-lessons',
            providesTags: ['ScheduledLesson'], // Tag for caching
        }),

        getScheduledLessonById: builder.query<ScheduledLessonResponseDTO, string>({
            query: (id) => `/api/scheduled-lessons/${id}`,
            providesTags: (result, error, id) => [{ type: 'ScheduledLesson', id }],
        }),

        createScheduledLesson: builder.mutation<ScheduledLessonResponseDTO, Omit<ScheduledLessonCreateDTO, 'id'>>({
            query: (newScheduledLesson) => ({
                url: '/api/scheduled-lessons',
                method: 'POST',
                body: newScheduledLesson,
            }),
            invalidatesTags: ['ScheduledLesson', 'Summary'],
        }),

        updateScheduledLesson: builder.mutation<ScheduledLessonResponseDTO, ScheduledLessonCreateDTO>({ // ScheduledLesson includes id
            query: ({ id, ...patch }) => ({
                url: `/api/scheduled-lessons/${id}`,
                method: 'PATCH', // Or PATCH depending on your API
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => ['ScheduledLesson', { type: 'ScheduledLesson', id }, 'Workshop'],
        }),

        deleteScheduledLesson: builder.mutation<void, string>({ // Pass id as string
            query: (id) => ({
                url: `/api/scheduled-lessons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['ScheduledLesson', { type: 'ScheduledLesson', id }, 'Workshop'],
        }),

        /**
         * ------------------------------------------------------------ Lesson ------------------------------------------------------------
         */
        getLessons: builder.query<LessonResponseDTO[], void>({
            query: () => '/api/lessons',
            providesTags: ['Lesson'], // Tag for caching
        }),

        getLessonById: builder.query<Lesson, string>({
            query: (id) => `/api/lessons/${id}`,
            providesTags: (result, error, id) => [{ type: 'Lesson', id }],
        }),

        createLesson: builder.mutation<LessonResponseDTO, Omit<LessonCreateDTO, 'id'>>({
            query: (newLesson) => ({
                url: '/api/lessons',
                method: 'POST',
                body: newLesson,
            }),
            invalidatesTags: ['Lesson', 'Summary'],
        }),

        updateLesson: builder.mutation<LessonResponseDTO, LessonCreateDTO>({ // Lesson includes id
            query: ({ id, ...patch }) => ({
                url: `/api/lessons/${id}`,
                method: 'PATCH', // Or PATCH depending on your API
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => ['Lesson', { type: 'Lesson', id }, 'Workshop'],
        }),

        deleteLesson: builder.mutation<void, string>({ // Pass id as string
            query: (id) => ({
                url: `/api/lessons/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['Lesson', { type: 'Lesson', id }, 'Workshop'],
        }),

        /**
         * ------------------------------------------------------------ Workshop ------------------------------------------------------------
         */
        getWorkshops: builder.query<WorkshopResponseDTO[], void>({
            query: () => '/api/workshops',
            providesTags: ['Workshop'], // Tag for caching
        }),

        createWorkshop: builder.mutation<WorkshopResponseDTO, Omit<WorkshopCreateDTO, 'id'>>({ // Returns WorkshopResponseDTO, takes WorkshopCreateDTO without ID
            query: (newWorkshop) => ({
                url: '/api/workshops',
                method: 'POST',
                body: newWorkshop,
            }),
            // Invalidate 'Workshop' tag to refetch the list after creation
            invalidatesTags: ['Workshop', 'Summary'], // Invalidate summary too, as count might change
        }),

        getWorkshopById: builder.query<WorkshopResponseDTO, string>({
            query: (id) => `/api/workshops/${id}`,
            // Invalidate specific workshop detail cache if you have it
            providesTags: (result, error, id) => [{ type: 'Workshop', id }],
        }),

        updateWorkshop: builder.mutation<WorkshopResponseDTO, WorkshopCreateDTO>({ // Workshop includes id
            query: ({ id, ...patch }) => ({
                url: `/api/workshops/${id}`,
                method: 'PATCH', // Or PATCH depending on your API
                body: patch,
            }),
            // Invalidate the list and the specific workshop item
            invalidatesTags: (result, error, { id }) => ['Workshop', { type: 'Workshop', id }, 'Activity'],
        }),

        deleteWorkshop: builder.mutation<void, string>({ // Pass id as string
            query: (id) => ({
                url: `/api/workshops/${id}`,
                method: 'DELETE',
            }),
            // Invalidate the list and the specific workshop item
            invalidatesTags: (result, error, id) => ['Workshop', { type: 'Workshop', id }, 'Activity'],
        }),

        /**
         * ------------------------------------------------------------ Activity ------------------------------------------------------------
         */
        getActivities: builder.query<ActivityResponseDTO[], void>({
            query: () => '/api/activities', // Adjust to your actual API endpoint
            providesTags: ['Activity'], // Define a new tag type if needed
        }),

        createActivity: builder.mutation<ActivityResponseDTO, Omit<ActivityCreateDTO, 'id'>>({
            query: (newActivity) => ({
                url: '/api/activities',
                method: 'POST',
                body: newActivity,
            }),
            invalidatesTags: ['Activity', 'Summary'],
        }),

        getActivityById: builder.query<ActivityResponseDTO, string>({
            query: (id) => `/api/activities/${id}`,
            providesTags: (result, error, id) => [{ type: 'Activity', id }],
        }),

        updateActivity: builder.mutation<ActivityResponseDTO, ActivityCreateDTO>({ // Activity includes id
            query: ({ id, ...patch }) => ({
                url: `/api/activities/${id}`,
                method: 'PATCH', // Or PATCH depending on your API
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => ['Activity', { type: 'Activity', id }, 'Workshop'],
        }),

        deleteActivity: builder.mutation<void, string>({ // Pass id as string
            query: (id) => ({
                url: `/api/activities/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['Activity', { type: 'Activity', id }, 'Workshop'],
        }),

    }),
});

// Export the auto-generated hooks
export const {
    useGetProposedTimeSlotByIdQuery,
    useGetVotesForProposedTimeSlotQuery,
    useGetOverallSummaryQuery,
    useGetUsersQuery,

    // Lesson
    useGetLessonByIdQuery,
    useGetLessonsQuery,
    useUpdateLessonMutation,
    useDeleteLessonMutation,
    useCreateLessonMutation,

    // Scheduled lesson
    useGetScheduledLessonByIdQuery,
    useGetScheduledLessonsQuery,
    useUpdateScheduledLessonMutation,
    useDeleteScheduledLessonMutation,
    useCreateScheduledLessonMutation,

    // Workshop
    useGetWorkshopsQuery,
    useCreateWorkshopMutation,
    useGetWorkshopByIdQuery,
    useUpdateWorkshopMutation,
    useDeleteWorkshopMutation,

    // Activity
    useGetActivitiesQuery,
    useCreateActivityMutation,
    useGetActivityByIdQuery,
    useUpdateActivityMutation,
    useDeleteActivityMutation,
} = apiSlice;