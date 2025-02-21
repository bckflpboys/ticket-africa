import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    }

    // For protected routes
    if (!isAuth) {
      const from = req.nextUrl.pathname + req.nextUrl.search;
      return NextResponse.redirect(
        new URL(`/auth/signin?callbackUrl=${encodeURIComponent(from)}`, req.url)
      );
    }

    // Handle role-based access
    if (req.nextUrl.pathname.startsWith('/events/create')) {
      if (!['organizer', 'admin', 'staff', 'user'].includes(token.role)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        return pathname.startsWith('/auth') || !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/events/create',
    '/profile',
    '/orders',
    '/settings',
    '/auth/:path*'
  ],
};
