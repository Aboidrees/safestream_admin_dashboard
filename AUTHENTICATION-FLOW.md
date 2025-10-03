# SafeStream Authentication Flow

## 📋 Overview

This document details the complete authentication flow for SafeStream, covering both parent/user authentication and admin authentication.

---

## 🔐 Authentication Architecture

### **Technology Stack**
- **NextAuth.js**: Authentication library
- **Prisma**: Database ORM
- **Jose**: JWT token creation and verification
- **bcryptjs**: Password hashing

### **Session Strategy**
- **Type**: JWT-based sessions
- **Duration**: 7 days
- **Storage**: HTTP-only cookies (secure)

---

## 🌊 Authentication Flows

### **1. Parent/User Login Flow**

#### **Route**: `/dashboard/login`

**Step 1: User submits credentials**
```typescript
// app/dashboard/login/page.tsx
const result = await signIn("credentials", {
  email: formData.email,
  password: formData.password,
  redirect: false,
})
```

**Step 2: NextAuth validates credentials**
```typescript
// lib/auth.ts - authorize()
1. Check if user exists in database
2. Verify password with bcrypt.compare()
3. Return user object if valid
```

**Step 3: Create JWT session**
```typescript
// lib/auth.ts - jwt callback
1. Create custom JWT with jose (createSessionToken)
2. Include user details and role
3. Store in session token
```

**Step 4: Session callback**
```typescript
// lib/auth.ts - session callback
1. Add user details to session object
2. Make available to client via useSession()
```

**Step 5: Redirect to dashboard**
```typescript
// After successful login
router.push("/dashboard")
```

---

### **2. Admin Login Flow**

#### **Route**: `/admin/login`

**Step 1: Admin submits credentials**
```typescript
// app/admin/login/page.tsx
const result = await signIn("credentials", {
  email: formData.email,
  password: formData.password,
  redirect: false,
})
```

**Step 2: Verify admin role**
```typescript
// After NextAuth authentication
const response = await fetch("/api/auth/admin-check")
const data = await response.json()

if (!data.isAdmin) {
  // Deny access, redirect to login
}
```

**Step 3: Redirect to admin dashboard**
```typescript
router.push("/admin")
```

---

## 🛡️ Middleware Protection

### **Route Protection Logic**

```typescript
// middleware.ts

1. Public Routes (No Auth Required):
   - Website pages (/, /about, /blog, etc.)
   - /dashboard/login, /dashboard/register
   - /admin/login, /admin/setup
   - NextAuth API routes

2. Parent Dashboard Routes (User Auth Required):
   - /dashboard/*
   - /api/dashboard/*

3. Admin Routes (Admin Auth + Role Check):
   - /admin/*
   - /api/admin/*
```

### **Middleware Flow**

```
Request → Middleware
    ↓
Is route excluded? (static files, images)
    ↓ NO
Is route public?
    ↓ NO
Check authentication token
    ↓
Token valid?
    ↓ YES
Is admin route?
    ↓ YES
Check admin role
    ↓
Role valid?
    ↓ YES
Allow access → Response
```

---

## 🔑 JWT Token Structure

### **Custom JWT Payload**

```typescript
interface SafeStreamJWTPayload {
  id: string              // User ID
  email: string           // User email
  name: string | null     // User name
  role: string            // User role ("user" or "admin")
  isAdmin: boolean        // Admin flag
  adminId?: string | null // Admin ID if user is admin
  iat: number             // Issued at
  exp: number             // Expiration
}
```

### **Token Creation**

```typescript
// lib/jwt.ts - createSessionToken()
1. Fetch user from database
2. Check if user has admin role
3. Create JWT with 7-day expiration
4. Sign with secret key (JWT_SECRET)
```

### **Token Verification**

```typescript
// lib/jwt.ts - verifyJWT()
1. Parse JWT token
2. Verify signature with JWT_SECRET
3. Check expiration
4. Return payload if valid
```

---

## 🔒 Password Security

### **Password Hashing**
```typescript
// Registration/Admin Setup
const hashedPassword = await bcrypt.hash(password, 12)
// Salt rounds: 12 (recommended for security)
```

### **Password Verification**
```typescript
// Login
const isValid = await bcrypt.compare(plainPassword, hashedPassword)
```

### **Password Requirements**
- Minimum 8 characters
- No maximum limit
- Mixed case recommended (enforced in UI)
- Special characters recommended

---

## 📝 User Registration Flow

### **Route**: `/dashboard/register`

**Step 1: User submits registration**
```typescript
POST /api/auth/register
{
  name: string
  email: string
  password: string
}
```

**Step 2: Create user in database**
```typescript
// app/api/auth/register/route.ts
1. Check if email already exists
2. Hash password with bcrypt
3. Create user in database
4. Return success response
```

**Step 3: Redirect to login**
```typescript
router.push("/dashboard/login")
// User must login with new credentials
```

---

## 👑 Admin Setup Flow

### **Route**: `/admin/setup`

**Step 1: Admin submits setup form**
```typescript
POST /api/auth/register
{
  name: string
  email: string
  password: string
  role: "admin"  // Special admin flag
}
```

**Step 2: Create admin user**
```typescript
// app/api/auth/register/route.ts
1. Hash password
2. Create user with email/password
3. Create linked Admin record
4. Return success response
```

**Step 3: Redirect to admin login**
```typescript
router.push("/admin/login")
```

---

## 🔐 Session Management

### **Client-Side Access**

```typescript
// Using useSession hook
import { useSession } from "next-auth/react"

const { data: session, status } = useSession()

if (status === "loading") {
  return <Loading />
}

if (!session) {
  router.push("/dashboard/login")
  return null
}

// Access user data
console.log(session.user.email)
console.log(session.user.name)
```

### **Server-Side Access**

```typescript
// API Routes
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Access user data
  const userId = session.user.id
}
```

### **Middleware Access**

```typescript
// middleware.ts
import { verifyJWT } from "@/lib/jwt"

const token = req.cookies.get("next-auth.session-token")?.value
const payload = await verifyJWT(token)

if (!payload) {
  // Redirect to login
}

// Check admin
if (payload.isAdmin) {
  // Allow admin access
}
```

---

## 🚪 Logout Flow

### **User Logout**
```typescript
// Any page
import { signOut } from "next-auth/react"

await signOut({ callbackUrl: "/dashboard/login" })
// Clears session, removes cookies, redirects
```

### **Automatic Logout**
- Session expires after 7 days
- User must re-authenticate
- Middleware automatically detects expired tokens

---

## 🧪 Test Credentials

### **Seeded Users** (After running `npm run db:seed`)

#### **Admin User**
```
Email: admin@safestream.app
Password: password123
Role: Admin
Access: Full platform access
```

#### **Parent User 1**
```
Email: parent1@example.com
Password: password123
Role: User
Family: The Smith Family
Children: 2
```

#### **Parent User 2**
```
Email: parent2@example.com
Password: password123
Role: User
Family: The Johnson Family
Children: 1
```

---

## 🔧 Environment Variables

### **Required Variables**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/safestream"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# JWT (Custom tokens)
JWT_SECRET="your-jwt-secret-key-here"
```

### **Generate Secrets**

```bash
# Generate random secret
openssl rand -base64 32

# Or in Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 🛡️ Security Features

### **1. Rate Limiting**
- **General Routes**: 1000 requests per 15 minutes
- **Auth Routes**: 50 requests per 15 minutes
- **IP-based tracking**
- **Disabled in development mode**

### **2. Security Headers**
```typescript
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: (configured)
```

### **3. CORS Protection**
- Only allows same-origin requests
- Validates origin for API calls
- Blocks cross-origin requests

### **4. SQL Injection Protection**
- Prisma ORM with parameterized queries
- No raw SQL queries
- Input validation

### **5. XSS Protection**
- Content Security Policy headers
- Input sanitization
- Output encoding

---

## 🧭 Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    User/Parent Login Flow                   │
└─────────────────────────────────────────────────────────────┘

    User → /dashboard/login
       ↓
    Enter credentials (email/password)
       ↓
    Submit to NextAuth
       ↓
    NextAuth validates with database
       ↓
    Password verified with bcrypt
       ↓
    Create JWT session token (jose)
       ↓
    Store in HTTP-only cookie
       ↓
    Redirect to /dashboard
       ↓
    Middleware checks token on each request
       ↓
    Access granted to /dashboard/*


┌─────────────────────────────────────────────────────────────┐
│                      Admin Login Flow                       │
└─────────────────────────────────────────────────────────────┘

    Admin → /admin/login
       ↓
    Enter credentials (email/password)
       ↓
    Submit to NextAuth
       ↓
    NextAuth validates with database
       ↓
    Check /api/auth/admin-check
       ↓
    Verify admin role in database
       ↓
    If admin: Redirect to /admin
    If not admin: Deny access
       ↓
    Middleware checks token + admin role
       ↓
    Access granted to /admin/*
```

---

## 🔍 Troubleshooting

### **Login Not Working**

1. **Check Database Connection**
   ```bash
   npm run db:studio
   # Verify users exist
   ```

2. **Check Environment Variables**
   ```bash
   echo $DATABASE_URL
   echo $NEXTAUTH_SECRET
   echo $JWT_SECRET
   ```

3. **Check Password Hash**
   - Passwords must be bcrypt hashed
   - Run seed script to reset test users

### **Session Not Persisting**

1. **Check NEXTAUTH_URL**
   - Must match your application URL
   - Include protocol (http:// or https://)

2. **Check Cookie Settings**
   - HTTP-only cookies enabled
   - Secure flag in production
   - SameSite attribute set

3. **Check JWT Secret**
   - JWT_SECRET must be set
   - Must be same across restarts

### **Admin Access Denied**

1. **Verify Admin Role**
   ```bash
   npm run db:studio
   # Check users table - verify user exists
   # Check admin table - verify admin record exists
   ```

2. **Check Admin Check API**
   ```bash
   curl -X GET http://localhost:3000/api/auth/admin-check \
     -H "Cookie: next-auth.session-token=YOUR_TOKEN"
   ```

---

## ✅ Testing Authentication

### **1. Setup Database**
```bash
npm run db:migrate
npm run db:seed
```

### **2. Test Parent Login**
```bash
# Navigate to http://localhost:3000/dashboard/login
# Email: parent1@example.com
# Password: password123
# Should redirect to /dashboard
```

### **3. Test Admin Login**
```bash
# Navigate to http://localhost:3000/admin/login
# Email: admin@safestream.app
# Password: password123
# Should redirect to /admin
```

### **4. Test Middleware Protection**
```bash
# Without login, try accessing:
http://localhost:3000/dashboard
# Should redirect to /dashboard/login

http://localhost:3000/admin
# Should redirect to /admin/login
```

---

## 📚 Related Documentation

- **SETUP-GUIDE.md**: Initial project setup
- **MIDDLEWARE.md**: Middleware configuration
- **PRISMA-INTEGRATION.md**: Database schema
- **DASHBOARD-FEATURES.md**: Dashboard API endpoints

---

## 🎯 Status

**✅ PRODUCTION READY**

- JWT-based authentication
- Role-based access control
- Secure password hashing
- Rate limiting
- Security headers
- CORS protection
- Comprehensive error handling

**Last Updated:** 2025-10-03

