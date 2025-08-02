// components/SimpleAuthChecker.tsx
'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectHasCheckedAuth, selectIsLoggingOut, setAuthStatus } from '../lib/features/auth/authSlice';

export function SimpleAuthChecker({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const isLoggingOut = useSelector(selectIsLoggingOut);
    const hasCheckedAuth = useSelector(selectHasCheckedAuth); // From Redux state
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            // Skip if we're logging out or already checked
            if (isLoggingOut || hasCheckedAuth) {
                return;
            }

            setIsChecking(true);

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}/api/auth/me`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    dispatch(setAuthStatus({ isLoggedIn: true, user: data.user }));
                } else {
                    dispatch(setAuthStatus({ isLoggedIn: false }));
                }
            } catch (error) {
                console.error('❌ Auth check failed:', error);
                dispatch(setAuthStatus({ isLoggedIn: false }));
            } finally {
                setIsChecking(false);
            }
        };

        // Check auth on every component mount if we haven't checked yet
        checkAuth();
    }, [dispatch, isLoggingOut, hasCheckedAuth]);

    // Show loading while checking auth
    if (isChecking || (!hasCheckedAuth && !isLoggingOut)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div>Checking authentication...</div>
            </div>
        );
    }

    return <>{children}</>;
}