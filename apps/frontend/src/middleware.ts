import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/checkout', '/profile', '/admin'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const token = request.cookies.get('access_token')?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }
    if (isAuthRoute && token) {
        const redirectParam = request.nextUrl.searchParams.get('redirect');
        const destination = redirectParam ? redirectParam : '/';
        return NextResponse.redirect(new URL(destination, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/checkout/:path*',
        '/profile/:path*',
        '/admin/:path*',
        '/login',
        '/register',
    ],
};
