import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/questions',
  '/tests',
  '/reports',
  '/profile',
  '/logout',
];

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get the token from cookies
  const token = request.cookies.get('accessToken')?.value;
  
  // If it's a protected route
  if (isProtectedRoute) {
    // If no token exists, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // If token exists, validate it using /auth/me endpoint
    const isTokenValid = await validateToken(token);
    if (!isTokenValid) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('expired', 'true');
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // If it's a public route and user is authenticated, redirect to dashboard
  if (isPublicRoute && token) {
    const isTokenValid = await validateToken(token);
    if (isTokenValid) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 