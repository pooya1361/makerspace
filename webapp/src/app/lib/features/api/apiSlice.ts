// webapp/src/lib/features/api/apiSlice.ts
import { ActivityCreateDTO, ActivityResponseDTO, Lesson, LessonCreateDTO, LessonResponseDTO, ProposedTimeSlotCreateDTO, ProposedTimeSlotResponseDTO, ScheduledLessonCreateDTO, ScheduledLessonResponseDTO, SummaryResponseDTO, UserCreateDTO, UserResponseDTO, VoteCreateDTO, VoteResponseDTO, WorkshopCreateDTO, WorkshopResponseDTO } from '@/app/interfaces/api'; // Adjust path as needed
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout as authLogout, logout, setCredentials, startLogout } from '../auth/authSlice';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    user: UserResponseDTO
}

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:8080',
    credentials: 'include',
    prepareHeaders: (headers) => {
        console.log('RTK Query: Making request with cookies');
        console.log('Document cookies:', document?.cookie); // Add this
        console.log('Headers being sent:', Object.fromEntries(headers.entries())); // Add this
        return headers;
    },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    const result = await baseQuery(args, api, extraOptions);

    // Add detailed logging
    if (result.error) {
        console.log('API Error Details:', {
            status: result.error.status,
            data: result.error.data,
            url: args,
            error: result.error
        });
    }

    if (result.error && result.error.status === 401) {
        console.warn('Unauthorized request. Dispatching logout...');

        try {
            await baseQuery('/api/auth/logout', api, {
                ...extraOptions,
                method: 'POST'
            });
        } catch (logoutError) {
            console.warn('Logout endpoint failed:', logoutError);
        }

        api.dispatch(authLogout());
        api.dispatch(apiSlice.util.resetApiState());
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['ScheduledLesson', 'Lesson', 'ProposedTimeSlot', 'Vote', 'Summary', 'Workshop', 'Activity', 'User'],
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/api/auth/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials({
                        user: data.user
                    }));
                    console.log('Login successful - cookies set by server');
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/api/auth/logout',
                method: 'POST',
                responseHandler: 'text'
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                // Set logout flag immediately to prevent auth checks
                dispatch(startLogout());

                try {
                    await queryFulfilled; // Wait for server to clear cookie
                    console.log('Logout successful - server cleared cookies');
                } catch (error) {
                    console.error('Logout failed:', error);
                } finally {
                    // Clear client-side state regardless of success/failure
                    dispatch(logout());
                    dispatch(apiSlice.util.resetApiState());
                }
            },
        }),

        register: builder.mutation<UserResponseDTO, Omit<UserCreateDTO, 'id'>>({
            query: (userData) => ({
                url: '/api/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),

        // Get current user info (for auth check on page load)
        getCurrentUser: builder.query<any, void>({
            query: () => '/api/auth/me',
            providesTags: ['User'],
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
         * ------------------------------------------------------------ Vote ------------------------------------------------------------
        */
        addVote: builder.mutation<VoteResponseDTO, Omit<VoteCreateDTO, 'id'>>({
            query: (newVote) => ({
                url: '/api/votes',
                method: 'POST',
                body: newVote,
            }),
            invalidatesTags: ['Vote', 'ProposedTimeSlot', 'ScheduledLesson'],
        }),

        deleteVote: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/votes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['ProposedTimeSlot', { type: 'ProposedTimeSlot', id }, 'ScheduledLesson', 'Vote'],
        }),

        /**
         * ------------------------------------------------------------ Proposed time slot ------------------------------------------------------------
        */
        getProposedTimeSlotById: builder.query<ProposedTimeSlotResponseDTO, string>({
            query: (id) => `/api/proposed-time-slots/${id}`,
            providesTags: (result, error, id) => [{ type: 'ProposedTimeSlot', id }],
        }),

        addProposedTimeSlot: builder.mutation<ProposedTimeSlotResponseDTO, Omit<ProposedTimeSlotCreateDTO, 'id'>>({
            query: (newProposedTimeSlot) => ({
                url: '/api/proposed-time-slots',
                method: 'POST',
                body: newProposedTimeSlot,
            }),
            invalidatesTags: ['ScheduledLesson', 'ProposedTimeSlot'],
        }),

        updateProposedTimeSlot: builder.mutation<ProposedTimeSlotResponseDTO, ProposedTimeSlotCreateDTO>({
            query: ({ id, ...patch }) => ({
                url: `/api/proposed-time-slots/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => ['ProposedTimeSlot', { type: 'ProposedTimeSlot', id }, 'ScheduledLesson'],
        }),

        deleteProposedTimeSlot: builder.mutation<void, number>({
            query: (id) => ({
                url: `/api/proposed-time-slots/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['ProposedTimeSlot', { type: 'ProposedTimeSlot', id }, 'ScheduledLesson'],
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
            transformResponse: (response: ScheduledLessonResponseDTO) => {
                return {
                    ...response,
                    startTime: response.startTime instanceof String ? new Date(response.startTime) : response.startTime, // Convert the string to a Date object
                    proposedTimeSlots: response.proposedTimeSlots.map(pts => {
                        return {
                            ...pts,
                            proposedStartTime: new Date(pts.proposedStartTime)
                        }
                    })
                };
            },
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
    useLoginMutation,
    useLogoutMutation,
    useRegisterMutation,
    useGetCurrentUserQuery,
    useGetOverallSummaryQuery,
    useGetUsersQuery,

    // Vote
    useAddVoteMutation,
    useDeleteVoteMutation,

    // Proposed time slot
    useGetProposedTimeSlotByIdQuery,
    useAddProposedTimeSlotMutation,
    useUpdateProposedTimeSlotMutation,
    useDeleteProposedTimeSlotMutation,

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