# SafeStream Middleware Documentation

## 📍 Location & Structure

### **Correct Location**
```
safestream_platform/
├── middleware.ts          ✅ CORRECT - Root level
└── app/
    └── ...
```

**❌ INCORRECT:** `app/dashboard/middleware.ts` or any nested location
**✅ CORRECT:** `middleware.ts` at project root

### **Why Root Level?**
Next.js middleware **must** be at the project root to:
- Run on every request before routing
- Apply security headers globally
- Handle authentication across all routes
- Protect both `/app` and `/pages` directories

## 🔒 Security Features

### **1. Rate Limiting**
```typescript
// Development: Disabled (unlimited requests)
// Production: Active with limits
- General requests: 1000 requests per 15 minutes
- Auth requests: 50 requests per 15 minutes
- IP-based tracking
- Automatic cleanup of expired entries
```

**Purpose:**
- Prevent brute force attacks
- Mitigate DDoS attempts
- Protect authentication endpoints
- Fair resource distribution

### **2. Security Headers**
```typescript
'X-Frame-Options': 'DENY'                    // Prevents clickjacking
'X-Content-Type-Options': 'nosniff'          // Prevents MIME sniffing
'Referrer-Policy': 'strict-origin-when-cross-origin'
'X-XSS-Protection': '1; mode=block'          // XSS protection
'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
'Content-Security-Policy': "default-src 'self'; ..."
'Permissions-Policy': 'camera=(), microphone=(), ...'
```

**Protection Against:**
- ✅ Clickjacking attacks
- ✅ Cross-site scripting (XSS)
- ✅ MIME type confusion
- ✅ Man-in-the-middle attacks
- ✅ Unauthorized feature access

### **3. Authentication & Authorization**
```typescript
// JWT Token Validation
- Validates tokens using `jose` library
- Checks both Authorization header and cookies
- Supports both API and web requests
- Secure token verification

// Admin Route Protection
- Separate validation for admin endpoints
- Role-based access control
- Permission checking
- Audit trail logging
```

**Protected Routes:**
- `/dashboard/*` (except login/register)
- `/api/auth/admin-check`
- Admin routes: `/dashboard/admin`, `/dashboard/my-management-office`

### **4. Public Routes**
```typescript
// Website routes (no authentication required)
"/", "/about", "/blog", "/community", "/contact-us", 
"/faq", "/help-center", "/privacy-policy", "/terms-of-service"

// Dashboard public routes
"/dashboard/login", "/dashboard/register", "/dashboard/admin-setup"

// Auth API routes
"/api/auth/*"
```

## 🎯 Best Practices Implemented

### **1. Route Configuration**
✅ **Correct matcher pattern:**
```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
```

**Why this pattern?**
- Excludes static files (performance)
- Excludes image optimization
- Excludes public assets
- Includes all dynamic routes

### **2. Error Handling**
```typescript
// ✅ NO information leakage
// ✅ Proper HTTP status codes
// ✅ Generic error messages
// ✅ Detailed server logging
```

**Examples:**
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 429: Too Many Requests (rate limit exceeded)
- 500: Internal Server Error (generic error)

### **3. CORS Handling**
```typescript
// API routes only
Access-Control-Allow-Origin: Same origin
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
```

### **4. Performance Optimization**
```typescript
// Early returns
if (isExcludedRoute(pathname)) return createSecurityResponse(req)
if (isPublicRoute(pathname)) return createSecurityResponse(req)

// Efficient route matching
- Use .startsWith() instead of regex
- Cache token validation results
- Minimal header processing
```

## 🔧 Configuration

### **Environment Variables**
```bash
# Required
NODE_ENV="development" | "production"
JWT_SECRET="your-secret-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional (for production)
REDIS_URL="redis://..."  # For distributed rate limiting
```

### **Rate Limit Customization**
```typescript
// In middleware.ts
const RATE_LIMIT_WINDOW = 15 * 60 * 1000        // Adjust window
const RATE_LIMIT_MAX_REQUESTS = 1000            // Adjust limit
const RATE_LIMIT_MAX_AUTH_REQUESTS = 50         // Adjust auth limit
```

## 🚀 Development vs Production

### **Development Mode**
```typescript
NODE_ENV=development
- Rate limiting: DISABLED
- Detailed error logging: YES
- Security headers: ENABLED
- Authentication: ENABLED
```

### **Production Mode**
```typescript
NODE_ENV=production
- Rate limiting: ENABLED (1000/15min, 50 auth/15min)
- Detailed error logging: NO (generic errors only)
- Security headers: ENABLED
- Authentication: ENABLED
- Consider using Redis for rate limiting
```

## 📊 Monitoring & Logging

### **Security Events Logged**
```typescript
console.warn() // Rate limit violations
console.error() // Authentication failures, middleware errors
```

### **Recommended Monitoring**
- Rate limit hit rate
- Authentication failure rate
- 401/403 response rate
- Response time metrics
- IP address patterns

### **Production Recommendations**
1. **Use Redis for rate limiting** (distributed systems)
2. **Set up alert thresholds**
   - Rate limit violations > 100/hour
   - Auth failures > 50/hour
   - 500 errors > 1%
3. **Log aggregation** (Datadog, LogRocket, Sentry)
4. **Security monitoring** (WAF, DDoS protection)

## 🛡️ Security Checklist

- [x] Middleware at root level
- [x] Rate limiting implemented
- [x] Security headers configured
- [x] CORS protection enabled
- [x] JWT validation secure
- [x] Admin route protection
- [x] Error handling secure (no leaks)
- [x] Public routes properly defined
- [x] Static files excluded
- [x] Development mode handling
- [x] Performance optimized

## 🔄 Maintenance

### **Regular Updates**
- Security headers (quarterly review)
- Rate limit thresholds (based on traffic)
- Public route list (as features added)
- Token validation logic (as auth changes)

### **Testing**
```bash
# Test public routes
curl http://localhost:3000/              # Should work
curl http://localhost:3000/about          # Should work

# Test protected routes
curl http://localhost:3000/dashboard      # Should redirect to login

# Test API routes
curl http://localhost:3000/api/auth/admin-check  # Should return 401

# Test rate limiting (production only)
# Send 1001 requests in 15 minutes
# 1001st request should return 429
```

## 📚 Related Documentation

- **SETUP-GUIDE.md** - Environment setup and database configuration
- **MIGRATION-GUIDE.md** - Migration from Supabase to Prisma
- **SCHEMA-MAPPING.md** - Database schema and models
- **docs/prd.md** - Product requirements and features

## ✅ Status: PRODUCTION READY

The middleware is properly configured and follows Next.js and security best practices. It's ready for production deployment with appropriate monitoring and maintenance procedures.

---

**Last Updated:** October 3, 2025
**Location:** `middleware.ts` (project root) ✅

