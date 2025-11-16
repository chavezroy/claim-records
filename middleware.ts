import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = (token as any)?.role === 'admin';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

    // Redirect non-admin users trying to access admin routes
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
        
        // Allow access to login page without auth
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }

        // Require auth for admin routes
        if (isAdminRoute) {
          return !!token && (token as any)?.role === 'admin';
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};

