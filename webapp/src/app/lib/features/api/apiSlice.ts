// webapp/src/lib/features/api/apiSlice.ts
import { ActivityCreateDTO, ActivityResponseDTO, Lesson, LessonCreateDTO, LessonResponseDTO, LessonUser, LessonUserCreateDTO, LessonUserResponseDTO, ProposedTimeSlotCreateDTO, ProposedTimeSlotResponseDTO, ScheduledLessonCreateDTO, ScheduledLessonResponseDTO, SummaryResponseDTO, UserCreateDTO, UserResponseDTO, VoteCreateDTO, VoteResponseDTO, WorkshopCreateDTO, WorkshopResponseDTO } from '@/app/interfaces/api'; // Adjust path as needed
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setCredentials, startLogout } from '../auth/authSlice';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    user: UserResponseDTO
}

const isServer = typeof window === "undefined";

const baseQuery = fetchBaseQuery({
    baseUrl: isServer ? process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:8080' : '/api', // Goes to proxy
    credentials: 'include', // For client-side requests
});

const baseQueryWithAuth = async (args: any, api: any, extraOptions: { serverCookies?: string }) => {
    console.log(`🔍 RTK Query: ${api.type} ${api.endpoint}`);

    // ✅ Server-side: Use cookies passed via extraOptions (no import needed!)
    if (typeof window === 'undefined' && extraOptions?.serverCookies) {
        console.log('✅ Server: Using server-provided cookies');

        const modifiedArgs = typeof args === 'string'
            ? { url: args, headers: {} }
            : { ...args, headers: { ...args.headers } };

        if (isServer && extraOptions?.serverCookies) {
            modifiedArgs.headers['Cookie'] = extraOptions.serverCookies;
        }

        const result = await baseQuery(modifiedArgs, api, extraOptions);

        if (result.error) {
            console.log('❌ Server RTK Query Error:', result.error.status);
        } else {
            console.log('✅ Server RTK Query Success');
        }

        return result;
    }

    // ✅ Client-side: Use normal credentials: 'include'
    const result = await baseQuery(args, api, extraOptions);

    if (result.error) {
        console.log('❌ Client RTK Query Error:', {
            status: result.error.status,
            endpoint: typeof args === 'string' ? args : args.url,
        });

        // Handle 401 on client
        if (typeof window !== 'undefined' && result.error.status === 401) {
            console.warn('❌ Client: Unauthorized, redirecting to login');
            window.location.href = '/login';
        }
    } else {
        console.log('✅ Client RTK Query Success');
    }

    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['ScheduledLesson', 'Lesson', 'ProposedTimeSlot', 'Vote', 'Summary', 'Workshop', 'Activity', 'User', 'LessonUser', 'WorkshopGraphQL'],
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

        getCurrentUser: builder.query<any, void>({
            query: () => '/api/auth/me',
            providesTags: ['User'],
        }),

        getOverallSummary: builder.query<SummaryResponseDTO, void>({
            query: () => '/api/summary',
            providesTags: ['Summary'], // Tag for caching
        }),

        getAvailableLessons: builder.query<ScheduledLessonResponseDTO[], void>({
            query: () => '/api/summary/available-lessons',
            providesTags: ['Summary'],
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
         * ------------------------------------------------------------ Lesson-User ------------------------------------------------------------
         */
        getLessonUsers: builder.query<LessonUserResponseDTO[], void>({
            query: () => '/api/lesson-users',
            providesTags: ['LessonUser'],
        }),

        getLessonUserById: builder.query<LessonUser, string>({
            query: (id) => `/api/lesson-users/${id}`,
            providesTags: (result, error, id) => [{ type: 'LessonUser', id }],
        }),

        getLessonsByUserId: builder.query<LessonUserResponseDTO[], string>({
            query: (id) => `/api/lesson-users/user/${id}`,
            providesTags: (result, error, id) => [{ type: 'LessonUser', id }],
        }),

        createLessonUser: builder.mutation<LessonUserResponseDTO, Omit<LessonUserCreateDTO, 'id'>>({
            query: (newLessonUser) => ({
                url: '/api/lesson-users',
                method: 'POST',
                body: newLessonUser,
            }),
            invalidatesTags: ['LessonUser', 'Summary'],
        }),

        updateLessonUser: builder.mutation<LessonUserResponseDTO, LessonUserCreateDTO>({
            query: ({ id, ...patch }) => ({
                url: `/api/lesson-users/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (result, error, { id }) => ['LessonUser', { type: 'LessonUser', id }, 'Summary'],
        }),

        deleteLessonUser: builder.mutation<void, string>({
            query: (id) => ({
                url: `/api/lesson-users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => ['LessonUser', { type: 'LessonUser', id }, 'Summary'],
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

        getWorkshopsGraphQL: builder.query<WorkshopResponseDTO[], void>({
            query: () => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query { 
                            workshops { 
                                id 
                                name 
                                description 
                                size 
                                activities {
                                    id
                                    name
                                    description
                                }
                            } 
                        }`
                }
            }),
            transformResponse: (response: any) => {
                if (response.errors) {
                    throw new Error(response.errors[0]?.message || 'GraphQL error');
                }
                return response.data.workshops;
            },
            providesTags: ['WorkshopGraphQL'],
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

        createWorkshopGraphQL: builder.mutation<WorkshopResponseDTO, Omit<WorkshopCreateDTO, 'id'>>({
            query: (workshop) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation CreateWorkshop($input: WorkshopCreateInput!) {
                            createWorkshop(input: $input) {
                                id
                                name
                                description
                                size
                                activities {
                                    id
                                    name
                                    description
                                }
                            }
                        }
                    `,
                    variables: { input: workshop }
                }
            }),
            transformResponse: (response: { data: { createWorkshop: WorkshopResponseDTO } }) => 
                response.data.createWorkshop,
            invalidatesTags: ['WorkshopGraphQL'],
        }),

        getWorkshopById: builder.query<WorkshopResponseDTO, string>({
            query: (id) => `/api/workshops/${id}`,
            // Invalidate specific workshop detail cache if you have it
            providesTags: (result, error, id) => [{ type: 'Workshop', id }],
        }),

        getWorkshopByIdGraphQL: builder.query<WorkshopResponseDTO, string>({
            query: (id) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        query GetWorkshop($id: ID!) {
                            workshop(id: $id) {
                                id
                                name
                                description
                                size
                                activities {
                                    id
                                    name
                                    description
                                }
                            }
                        }
                    `,
                    variables: { id }
                }
            }),
            transformResponse: (response: { data: { workshop: WorkshopResponseDTO } }) =>
                response.data.workshop,
            providesTags: (result, error, id) => [{ type: 'WorkshopGraphQL', id }],
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

        updateWorkshopGraphQL: builder.mutation<WorkshopResponseDTO, { id: string; workshop: WorkshopCreateDTO }>({
            query: ({ id, workshop }) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation UpdateWorkshop($id: ID!, $input: WorkshopCreateInput!) {
                            updateWorkshop(id: $id, input: $input) {
                                id
                                name
                                description
                                size
                                activities {
                                    id
                                    name
                                    description
                                }
                            }
                        }
                    `,
                    variables: { id, input: workshop }
                }
            }),
            transformResponse: (response: { data: { updateWorkshop: WorkshopResponseDTO } }) =>
                response.data.updateWorkshop,
            invalidatesTags: (result, error, { id }) => [{ type: 'WorkshopGraphQL', id }, 'WorkshopGraphQL'],
        }),

        deleteWorkshop: builder.mutation<void, string>({ // Pass id as string
            query: (id) => ({
                url: `/api/workshops/${id}`,
                method: 'DELETE',
            }),
            // Invalidate the list and the specific workshop item
            invalidatesTags: (result, error, id) => ['Workshop', { type: 'Workshop', id }, 'Activity'],
        }),

        deleteWorkshopGraphQL: builder.mutation<boolean, string>({
            query: (id) => ({
                url: '/graphql',
                method: 'POST',
                body: {
                    query: `
                        mutation DeleteWorkshop($id: ID!) {
                            deleteWorkshop(id: $id)
                        }
                    `,
                    variables: { id }
                }
            }),
            transformResponse: (response: { data: { deleteWorkshop: boolean } }) =>
                response.data.deleteWorkshop,
            transformErrorResponse: (response: any) => {
                console.error('❌ GraphQL getWorkshops failed:', response);
                return response;
            },
            invalidatesTags: ['WorkshopGraphQL'],
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
    useGetAvailableLessonsQuery,
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

    // Lesson-user
    useGetLessonUserByIdQuery,
    useGetLessonsByUserIdQuery,
    useGetLessonUsersQuery,
    useUpdateLessonUserMutation,
    useDeleteLessonUserMutation,
    useCreateLessonUserMutation,

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
    useGetWorkshopsGraphQLQuery,
    useGetWorkshopByIdGraphQLQuery,
    useCreateWorkshopGraphQLMutation,
    useUpdateWorkshopGraphQLMutation,
    useDeleteWorkshopGraphQLMutation,
    
    // Activity
    useGetActivitiesQuery,
    useCreateActivityMutation,
    useGetActivityByIdQuery,
    useUpdateActivityMutation,
    useDeleteActivityMutation,
} = apiSlice;