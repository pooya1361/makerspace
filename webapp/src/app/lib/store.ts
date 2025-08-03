// webapp/src/lib/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import authReducer from './features/auth/authSlice';

export const makeStore = () =>
    configureStore({
        reducer: {
            [apiSlice.reducerPath]: apiSlice.reducer,
            auth: authReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [
                        // Ignore RTK Query actions
                        'api/executeQuery/fulfilled',
                        'api/executeQuery/pending',
                        'api/executeMutation/fulfilled',
                        'api/executeMutation/pending',
                    ],
                    ignoredActionsPaths: [
                        'payload.proposedTimeSlots',
                        'payload.startTime',
                        'meta.arg.originalArgs',
                    ],
                    ignoredPaths: [
                        // Ignore these paths in state where dates are stored
                        'api.queries',
                        'api.mutations',
                    ],
                },
            }).concat(apiSlice.middleware),
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const store = makeStore();