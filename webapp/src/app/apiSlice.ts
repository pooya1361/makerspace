// webapp/src/lib/features/api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ScheduledLesson, ProposedTimeSlot, VoteResponseDTO } from '@/app/interfaces/api'; // Adjust path as needed

export const apiSlice = createApi({
    reducerPath: 'api', // Unique name for the slice in the Redux store
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080', // Your backend base URL
    }),
    tagTypes: ['ScheduledLesson', 'ProposedTimeSlot', 'Vote'], // Tags for caching and invalidation
    endpoints: (builder) => ({
        getScheduledLessonById: builder.query<ScheduledLesson, string>({
            query: (id) => `/api/scheduled-lessons/${id}`,
            providesTags: (result, error, id) => [{ type: 'ScheduledLesson', id }],
        }),
        getProposedTimeSlotById: builder.query<ProposedTimeSlot, string>({
            query: (id) => `/api/proposed-time-slots/${id}`,
            providesTags: (result, error, id) => [{ type: 'ProposedTimeSlot', id }],
        }),
        getVotesForProposedTimeSlot: builder.query<VoteResponseDTO[], string>({
            query: (proposedTimeSlotId) => `/api/proposed-time-slots/${proposedTimeSlotId}/votes`,
            providesTags: (result, error, proposedTimeSlotId) => [{ type: 'Vote', id: proposedTimeSlotId }],
        }),
        // You can add mutations here later if needed (e.g., addVote, updateProposedTimeSlot)
    }),
});

// Export the auto-generated hooks
export const {
    useGetScheduledLessonByIdQuery,
    useGetProposedTimeSlotByIdQuery,
    useGetVotesForProposedTimeSlotQuery,
} = apiSlice;