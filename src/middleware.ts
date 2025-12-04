import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // Allow access to login page, auth API, and static assets (images, etc.)
    if (
        pathname === '/login' ||
        pathname.startsWith('/api/auth') ||
        pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)
    ) {
        return NextResponse.next();
    }

    // If authenticated, allow access
    if (authToken === 'authenticated') {
        return NextResponse.next();
    }

    // Otherwise, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
