// webapp/src/lib/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ScheduledLesson, ProposedTimeSlot, Lesson, ProposedTimeSlotResponseDTO, SummaryResponseDTO, WorkshopResponseDTO, Workshop, ActivityResponseDTO, WorkshopCreateDTO } from '@/app/interfaces/api'; // Adjust path as needed

export const apiSlice = createApi({
    reducerPath: 'api', // Unique name for the slice in the Redux store
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
    }),
    tagTypes: ['ScheduledLesson', 'Lesson', 'ProposedTimeSlot', 'Vote', 'Summary', 'Workshop', 'Activity'],
    endpoints: (builder) => ({
        getScheduledLessonById: builder.query<ScheduledLesson, string>({
            query: (id) => `/api/scheduled-lessons/${id}`,
            providesTags: (result, error, id) => [{ type: 'ScheduledLesson', id }],
        }),

        getLessonById: builder.query<Lesson, string>({
            query: (id) => `/api/lessons/${id}`,
            providesTags: (result, error, id) => [{ type: 'Lesson', id }],
        }),

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

        getActivities: builder.query<ActivityResponseDTO[], void>({
            query: () => '/api/activities', // Adjust to your actual API endpoint
            providesTags: ['Activity'], // Define a new tag type if needed
        }),
    }),
});

// Export the auto-generated hooks
export const {
    useGetScheduledLessonByIdQuery,
    useGetLessonByIdQuery,
    useGetProposedTimeSlotByIdQuery,
    useGetVotesForProposedTimeSlotQuery,
    useGetOverallSummaryQuery,
    useGetWorkshopsQuery,
    useCreateWorkshopMutation,
    useGetWorkshopByIdQuery,
    useUpdateWorkshopMutation,
    useDeleteWorkshopMutation,
    useGetActivitiesQuery
} = apiSlice;