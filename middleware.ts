import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protect Interviews and Events routes
    if (
        pathname.startsWith('/interviews') ||
        pathname.startsWith('/events') ||
        pathname.startsWith('/articles/interviews') ||
        pathname.startsWith('/cms/interviews') ||
        pathname.startsWith('/cms/events')
    ) {
        return NextResponse.rewrite(new URL('/404', request.url));
    }

    return NextResponse.next();
}

// Optional: Configure which paths the middleware runs on
export const config = {
    matcher: [
        '/interviews/:path*',
        '/events/:path*',
        '/articles/interviews/:path*',
        '/cms/interviews/:path*',
        '/cms/events/:path*',
    ],
};
