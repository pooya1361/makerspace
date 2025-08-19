// middleware.ts - Updated for Next.js 15+ async cookies
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch {
        return null;
    }
}

function isTokenExpired(token: string): boolean {
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
}

export async function middleware(request: NextRequest) {
    // ✅ Use request.cookies (synchronous) instead of cookies() function
    const accessToken = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that don't need authentication
    const publicRoutes = ['/login', '/register', '/api/auth/login', '/api/auth/register'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

    console.log(`🔍 Middleware: ${pathname}, Token: ${accessToken ? 'Present' : 'Missing'}`);

    // If accessing a public route, allow it
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // Check if user has valid token
    if (!accessToken || isTokenExpired(accessToken)) {
        console.log('❌ Middleware: No valid token, redirecting to login');

        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Parse token to get user info
    const payload = parseJwt(accessToken);
    const userType = payload?.userType;

    // Role-based access control
    if (pathname.startsWith('/admin') && !['ADMIN', 'SUPERADMIN'].includes(userType)) {
        console.log('❌ Middleware: Insufficient permissions');
        return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Add user info to headers for SSR pages
    const response = NextResponse.next();
    response.headers.set('x-user-email', payload?.sub || '');
    response.headers.set('x-user-type', userType || '');
    response.headers.set('x-user-authorities', JSON.stringify(payload?.authorities || []));
    response.headers.set('x-authenticated', 'true');

    console.log('✅ Middleware: Authentication passed');
    return response;
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
    ],
};