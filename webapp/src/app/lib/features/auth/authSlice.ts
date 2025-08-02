// webapp/src/lib/features/auth/authSlice.ts
import { UserResponseDTO } from '@/app/interfaces/api';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface AuthState {
    user: UserResponseDTO | null;
    isLoggedIn: boolean;
    hasCheckedAuth: boolean;
    isLoggingOut: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoggedIn: false, 
    hasCheckedAuth: false,
    isLoggingOut: false,
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
            state.hasCheckedAuth = false
        },
        
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
            state.hasCheckedAuth = true
            state.isLoggingOut = false;
        },

        startLogout: (state) => {
            state.isLoggingOut = true; // Set flag to prevent auth checks
        },
        
        setAuthStatus: (
            state,
            action: PayloadAction<{ isLoggedIn: boolean; user?: UserResponseDTO }>
        ) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.user = action.payload.user || null;
            state.hasCheckedAuth = true
        },
    },
});

export const { setCredentials, logout, setAuthStatus, startLogout } = authSlice.actions;

export default authSlice.reducer;

// Updated selectors
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLoggedIn;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const selectUserEmail = (state: { auth: AuthState }) => state.auth.user?.email;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.userType;
export const selectHasCheckedAuth = (state: { auth: AuthState }) => state.auth.hasCheckedAuth;
export const selectIsLoggingOut = (state: { auth: AuthState }) => state.auth.isLoggingOut;