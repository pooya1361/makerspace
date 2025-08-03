// webapp/src/app/components/AdminOnly.tsx
'use client';

import { selectIsAdmin } from '@/app/lib/features/auth/authSlice';
import { useSelector } from 'react-redux';

interface AdminOnlyProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
    const isAdmin = useSelector(selectIsAdmin);

    return isAdmin ? <>{children}</> : <>{fallback}</>;
}