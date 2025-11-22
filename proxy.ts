import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Protected routes that require authentication
const protectedRoutes = ['/client-portal'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get token from cookie or localStorage (check Authorization header)
    const token = request.cookies.get('token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      // Allow access to show login form
      return NextResponse.next();
    }

    try {
      // Verify JWT token
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production-min-32-characters'
      );
      
      await jwtVerify(token, secret);
      
      // Token is valid, allow access
      return NextResponse.next();
    } catch (error) {
      // Invalid token, clear it and allow access to show login form
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

// Configure which routes to run proxy on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
