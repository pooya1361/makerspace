// webapp/src/lib/features/auth/authSlice.ts
import { UserResponseDTO } from '@/app/interfaces/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
    user: UserResponseDTO | null;
    isLoggedIn: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoggedIn: false, // Will be set to true after successful login
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: UserResponseDTO }>
        ) => {
            state.user = action.payload.user;
            state.isLoggedIn = true;
        },

        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },

        setAuthStatus: (
            state,
            action: PayloadAction<{ isLoggedIn: boolean; user?: UserResponseDTO }>
        ) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.user = action.payload.user || null;
        },
    },
});

export const { setCredentials, logout, setAuthStatus } = authSlice.actions;

export default authSlice.reducer;

// Updated selectors
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserEmail = (state: { auth: AuthState }) => state.auth.user?.email;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.userType;