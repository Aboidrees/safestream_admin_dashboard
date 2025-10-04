import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

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
    console.log("🔍 Middleware - Pathname:", pathname)
    console.log("🔍 Middleware - Request URL:", request.url)
    console.log("🔍 Middleware - Cookies:", request.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 20)}...`))
    console.log("🔍 Middleware - NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "Set" : "Not set")
    
    // Get the JWT token
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    }).catch((error) => {
      console.error("🔍 Middleware - Error getting token:", error)
      return null
    })

    console.log("🔍 Middleware - Token:", token ? "Present" : "Missing")
    if (token) {
      console.log("🔍 Middleware - Token Details:", {
        name: token.name,
        email: token.email,
        isAdmin: token.isAdmin,
        adminId: token.adminId,
        role: token.role
      })
    } else {
      console.log("🔍 Middleware - Token Details: No token")
      console.log("🔍 Middleware - Raw session token:", request.cookies.get('next-auth.session-token')?.value.substring(0, 50))
    }

    // If no token, redirect to login
    if (!token) {
      console.log("❌ No token found, redirecting to login")
      const loginUrl = new URL("/login", request.url)
      // Only set callbackUrl if it's not already the login page
      if (pathname !== "/login") {
        loginUrl.searchParams.set("callbackUrl", pathname)
      }
      return NextResponse.redirect(loginUrl)
    }

    // Verify admin status
    if (!token.isAdmin) {
      console.log("❌ Not an admin, redirecting to login")
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("error", "AccessDenied")
      return NextResponse.redirect(loginUrl)
    }

    console.log("✅ Admin authenticated, allowing access to:", pathname)

    // Add admin info to headers for API routes
    if (pathname.startsWith('/api/')) {
      response.headers.set('x-admin-id', token.adminId)
      response.headers.set('x-admin-role', token.role)
    }

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

