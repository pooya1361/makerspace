//webapp/src/app/components/AuthStatusWatcher.tsx
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectHasCheckedAuth, selectIsLoggedIn } from '../lib/features/auth/authSlice';

export default function AuthStatusWatcher() {
    const router = useRouter();
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const hasCheckedAuth = useSelector(selectHasCheckedAuth);
    
    useEffect(() => {
        if (hasCheckedAuth && !isLoggedIn && window.location.pathname !== '/login') {
            router.push('/login');
        }
    }, [isLoggedIn, hasCheckedAuth, router]);

    return null;
}