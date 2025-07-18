// webapp/src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';

export const store = configureStore({
    reducer: {
        // Add the generated API reducer to the store
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of RTK Query.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;