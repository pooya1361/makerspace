"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../lib/features/auth/authSlice';

export default function AuthStatusWatcher() {
    const router = useRouter();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    useEffect(() => {
        if (!isLoggedIn && window.location.pathname !== '/login') {
            router.push('/login');
        }
    }, [isLoggedIn, router]);

    return null;
}