import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyAccessToken } from "./lib/jwt-enhanced"
import type { SafeStreamJWTPayload } from "./lib/types"
import { getToken } from "next-auth/jwt"

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

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000 // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 1000 // 1000 requests per window (increased for development)
const RATE_LIMIT_MAX_AUTH_REQUESTS = 50 // 50 auth requests per window (increased for development)
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

// Public routes that don't require authentication
const publicRoutes = [
  "/login",
  "/dashboard/login",
  "/dashboard/register",
  "/api/auth/signin",
  "/api/auth/signout",
  "/api/auth/csrf",
  "/api/auth/providers",
  "/api/auth/session",
  "/api/auth/callback",
  "/api/auth/register",
  "/api/auth/admin-check",
  "/_next",
  "/favicon.ico"
]

// Admin routes that require admin privileges (root-admin layout)
const adminRoutes = [
  "/",
  "/users",
  "/families",
  "/children",
  "/collections",
  "/videos",
  "/content-moderation",
  "/reports",
  "/settings",
  "/stats",
  "/api/admin"
]

// Routes that should be excluded from middleware
const excludedRoutes = [
  "/_next/static",
  "/_next/image",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml"
]

// Check if route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => {
    if (route === "/") return pathname === "/"
    return pathname.startsWith(route)
  })
}

// Check if route is admin route
function isAdminRoute(pathname: string): boolean {
  return adminRoutes.some(route => pathname.startsWith(route))
}

// Check if route should be excluded
function isExcludedRoute(pathname: string): boolean {
  return excludedRoutes.some(route => pathname.startsWith(route))
}

// Rate limiting function
function checkRateLimit(ip: string, isAuthRequest: boolean = false): boolean {
  // Skip rate limiting in development
  if (IS_DEVELOPMENT) {
    return true
  }
  
  const now = Date.now()
  const key = `${ip}:${isAuthRequest ? 'auth' : 'general'}`
  const limit = isAuthRequest ? RATE_LIMIT_MAX_AUTH_REQUESTS : RATE_LIMIT_MAX_REQUESTS
  
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  rateLimitStore.set(key, current)
  return true
}

// Get client IP address
function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for")
  const realIP = req.headers.get("x-real-ip")
  const cfConnectingIP = req.headers.get("cf-connecting-ip")
  
  if (cfConnectingIP) return cfConnectingIP
  if (realIP) return realIP
  if (forwarded) return forwarded.split(",")[0].trim()
  
  return "unknown"
}

// Validate token and extract user info
async function validateToken(req: NextRequest): Promise<{ payload: SafeStreamJWTPayload; token: string } | null> {
  // Check Authorization header first (for API requests with custom JWT)
  const authHeader = req.headers.get("authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7)
    try {
      const payload = await verifyAccessToken(token)
      if (payload) {
        return { payload, token }
      }
    } catch (error) {
      console.error("Bearer token validation error:", error)
    }
  }
  
  // Check NextAuth session for web requests
  try {
    const token = await getToken({ 
      req,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return null
    }
    
    // Convert NextAuth token to our payload format
    const now = Math.floor(Date.now() / 1000)
    const payload: SafeStreamJWTPayload = {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as string,
      isAdmin: token.isAdmin as boolean,
      adminId: token.adminId as string | undefined,
      jti: '', // Not needed for NextAuth tokens
      type: 'access',
      iat: now,
      exp: now + 900, // 15 minutes from now
      iss: 'safestream',
      aud: 'safestream-users',
    }
    
    return { payload, token: token.accessToken as string || '' }
  } catch (error) {
    console.error("NextAuth token validation error:", error)
    return null
  }
}

// Create security response
function createSecurityResponse(req: NextRequest): NextResponse {
  const response = NextResponse.next()
  
  // Add security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  
  // Add CORS headers for API routes
  if (req.nextUrl.pathname.startsWith("/api/")) {
    response.headers.set("Access-Control-Allow-Origin", req.nextUrl.origin)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.set("Access-Control-Max-Age", "86400")
  }
  
  return response
}

// Create error response
function createErrorResponse(message: string, status: number): NextResponse {
  const response = new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...securityHeaders
    }
  })
  
  return response
}

// Main middleware function
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const clientIP = getClientIP(req)
  
  // Skip middleware for excluded routes
  if (isExcludedRoute(pathname)) {
    return createSecurityResponse(req)
  }
  
  // Handle OPTIONS requests for CORS
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 200 })
  }
  
  // Rate limiting
  const isAuthRequest = pathname.includes("/login") || pathname.includes("/register") || pathname.includes("/api/auth")
  if (!checkRateLimit(clientIP, isAuthRequest)) {
    console.warn(`Rate limit exceeded for IP: ${clientIP}`)
    return createErrorResponse("Too many requests", 429)
  }
  
  // Public routes - add security headers and continue
  if (isPublicRoute(pathname)) {
    return createSecurityResponse(req)
  }
  
  // Protected routes - require authentication
  try {
    const tokenData = await validateToken(req)
    
    if (!tokenData) {
      // Redirect to login for web routes, return 401 for API routes
      if (pathname.startsWith("/api/")) {
        return createErrorResponse("Unauthorized", 401)
      }
      
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("redirect", pathname)
      return NextResponse.redirect(loginUrl)
    }
    
    const { payload } = tokenData
    
    // Check admin routes
    if (isAdminRoute(pathname)) {
      // Validate admin status from payload
      if (!payload.isAdmin || !payload.adminId) {
        if (pathname.startsWith("/api/")) {
          return createErrorResponse("Admin access required", 403)
        }
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("redirect", pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      // Add admin info to headers
      const response = createSecurityResponse(req)
      response.headers.set("x-admin-id", payload.adminId || "")
      response.headers.set("x-admin-role", payload.role || "")
      response.headers.set("x-user-id", payload.id)
      response.headers.set("x-user-email", payload.email)
      
      return response
    }
    
    // Add user info to headers for all authenticated requests
    const response = createSecurityResponse(req)
    response.headers.set("x-user-id", payload.id)
    response.headers.set("x-user-email", payload.email)
    response.headers.set("x-user-role", payload.role || "user")
    
    return response
    
  } catch (error) {
    console.error("Middleware error:", error)
    
    // Don't expose internal errors
    if (pathname.startsWith("/api/")) {
      return createErrorResponse("Internal server error", 500)
    }
    
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }
}

// Middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

