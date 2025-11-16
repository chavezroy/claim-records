import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = (token as any)?.role === 'admin';
    const isLoginPage = req.nextUrl.pathname === '/admin/login';

    // Allow access to login page
    if (isLoginPage) {
      return NextResponse.next();
    }

    // Redirect non-admin users trying to access admin routes
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without auth
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }

        // Require admin role for other admin routes
        return !!token && (token as any)?.role === 'admin';
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};

