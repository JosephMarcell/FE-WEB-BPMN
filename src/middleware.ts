import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const authToken = request.cookies.get('authToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Definisikan path yang dapat diakses publik
  const publicPaths = [
    '/',
    '/landing-page',
    '/multiformat-parser',
    '/auth/verify-account',
    '/auth/reset-password',
  ];

  // Abaikan asset statis
  if (
    url.pathname.startsWith('/_next') ||
    url.pathname.startsWith('/static') ||
    url.pathname.startsWith('/assets/images') ||
    url.pathname.includes('.') ||
    url.pathname.includes('favicon')
  ) {
    return NextResponse.next();
  }

  // Izinkan akses ke path publik tanpa login
  if (publicPaths.includes(url.pathname)) {
    return NextResponse.next();
  }

  // Jika mengakses halaman auth
  if (url.pathname.startsWith('/auth')) {
    // Jika sudah login, redirect ke home kecuali verify-account
    if (authToken && url.pathname !== '/auth/verify-account') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Jika belum login, izinkan akses ke halaman auth
    return NextResponse.next();
  }

  // Semua path non-auth & non-publik wajib login
  if (!authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Kontrol akses berdasarkan role
  if (
    url.pathname === '/users/user_log' &&
    userRole !== 'SUPERADMIN' &&
    userRole !== 'ADMIN'
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Add this condition in the existing middleware
  if (url.pathname.startsWith('/users/user_list') && userRole === 'USER') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Add this condition to the middleware function
  if (url.pathname.startsWith('/tenants') && userRole !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Pengguna sudah login dan memiliki izin untuk mengakses
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
