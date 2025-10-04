import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Define admin routes that require authentication
const adminRoutes = [
  '/',
  '/users',
  '/admins',
  '/families',
  '/children',
  '/collections',
  '/videos',
  '/content',
  '/moderation',
  '/reports',
  '/settings',
  '/stats'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/api/auth',
  '/_next',
  '/favicon.ico'
]

// Security headers configuration
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Add security headers to all responses
  const response = NextResponse.next()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Skip middleware for public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return response
  }

  // Check if the route requires admin authentication
  const isAdminRoute = adminRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  if (!isAdminRoute) {
    return response
  }

  try {
    // Check for session token cookie
    const sessionToken = request.cookies.get('next-auth.session-token')?.value
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url)
      if (pathname !== "/login") {
        loginUrl.searchParams.set("callbackUrl", pathname)
      }
      return NextResponse.redirect(loginUrl)
    }
    
    // Session token exists, allow request to proceed
    // Full authentication validation happens in page components
    return response
  } catch (error) {
    console.error('Middleware error:', error)
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("error", "AuthenticationError")
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth.js API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}