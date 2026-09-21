import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-for-local-dev-only";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export async function proxy(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const { pathname } = request.nextUrl;

  // If user is already logged in, redirect them away from auth pages
  if (session && (pathname === '/login' || pathname === '/register' || pathname === '/forgot-password')) {
    // Quick verify to ensure it's a valid session before redirecting
    try {
      await jwtVerify(session, encodedKey, { algorithms: ["HS256"] });
      return NextResponse.redirect(new URL('/profile', request.url));
    } catch (err) {
      // Invalid session, let them access the login page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/forgot-password'],
};
