# NextAuth Migration - Admin Dashboard

## Overview
This document outlines the migration of the admin dashboard to use NextAuth.js for authentication instead of custom authentication solutions.

## Changes Made

### 1. Authentication Configuration
- **File**: `lib/auth.ts`
- **Status**: ✅ Already using NextAuth with `CredentialsProvider`
- **Details**: Configured with admin-specific authentication, JWT strategy, and proper callbacks

### 2. API Authentication
- **File**: `lib/auth-session.ts`
- **Status**: ✅ Already using NextAuth's `getToken` from `next-auth/jwt`
- **Functions**:
  - `getAuthenticatedAdmin()`: Gets admin from NextAuth token
  - `requireAdmin()`: Ensures admin authentication
  - `requireRole()`: Ensures specific admin role

### 3. API Routes
- **Status**: ✅ All API routes use `requireAdmin` from `lib/auth-session.ts`
- **Examples**:
  - `app/api/users/route.ts`
  - `app/api/families/route.ts`
  - `app/api/admins/route.ts`
  - All other protected routes

### 4. NextAuth Handler
- **File**: `app/api/auth/[...nextauth]/route.ts`
- **Status**: ✅ Properly configured
- **Details**: Uses `authOptions` from `lib/auth.ts`

### 5. Components
- **File**: `components/mobile-dashboard-shell.tsx`
- **Status**: ✅ Updated to use NextAuth
- **Changes**:
  - Replaced `useSupabase` with `useSession` from `next-auth/react`
  - Replaced custom `signOut` with `signOut` from `next-auth/react`
  - Updated user metadata references to use NextAuth's user object structure
  - Changed `user.user_metadata.avatar_url` to `user.image`
  - Changed `user.user_metadata.name` to `user.name`

### 6. Login Page
- **File**: `app/login/page.tsx`
- **Status**: ✅ Using NextAuth's `signIn` function
- **Details**: Uses `signIn("admin-credentials", { ... })` for authentication

### 7. Middleware
- **File**: `middleware.ts`
- **Status**: ✅ Using NextAuth's `getToken` from `next-auth/jwt`
- **Details**: Validates admin authentication for protected routes

### 8. Removed Files
- **File**: `app/api/auth/login/route.ts`
- **Reason**: Unnecessary - NextAuth handles login via `signIn()` client-side function
- **Status**: ✅ Deleted

### 9. Registration Route
- **File**: `app/api/auth/register/route.ts`
- **Status**: ⚠️ Kept for admin registration
- **Note**: This route is kept because it handles admin user registration, which is not part of the standard NextAuth flow

## NextAuth Configuration

### Provider
```typescript
CredentialsProvider({
  id: "admin-credentials",
  name: "Admin Credentials",
  // ... authentication logic
})
```

### Session Strategy
- **Type**: JWT
- **Max Age**: 24 hours
- **Update Age**: 1 hour

### Callbacks
- **JWT**: Adds admin-specific fields (`id`, `role`, `isAdmin`, `adminId`)
- **Session**: Passes admin data to client
- **Redirect**: Handles post-login redirects

### Pages
- **Sign In**: `/login`
- **Error**: `/login`

## Environment Variables Required

```env
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000" # or your production URL
DATABASE_URL="your-database-url"
NODE_ENV="development" # or "production"
```

## Usage Examples

### In API Routes
```typescript
import { requireAdmin } from "@/lib/auth-session"

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req)
  // admin is now typed and authenticated
}
```

### In Client Components
```typescript
import { useSession, signOut } from "next-auth/react"

function Component() {
  const { data: session } = useSession()
  const user = session?.user
  
  // user.name, user.email, user.role, user.isAdmin, user.adminId
}
```

### In Middleware
```typescript
import { getToken } from "next-auth/jwt"

const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
// token contains JWT claims
```

## Migration Checklist

- [x] Configure NextAuth with admin authentication
- [x] Update API routes to use NextAuth authentication
- [x] Update client components to use `useSession`
- [x] Update middleware to use NextAuth token validation
- [x] Remove custom authentication code
- [x] Update user metadata references
- [x] Test authentication flow
- [ ] **TODO**: Fix middleware token reading issue (tokens not being read properly)

## Known Issues

### Middleware Token Reading
- **Issue**: `getToken()` returns `null` even though session cookie is present
- **Status**: 🔴 In Progress
- **Details**: The JWT token is being created correctly, but the middleware cannot read it
- **Debug Logs Added**: Yes
- **Next Steps**: 
  1. Verify `NEXTAUTH_SECRET` is loaded in middleware
  2. Check if JWE decryption is working
  3. Test with explicit cookie name configuration

## Benefits of NextAuth

1. **Industry Standard**: Well-tested and widely used
2. **Security**: Built-in CSRF protection, secure session handling
3. **Type Safety**: Full TypeScript support
4. **Flexibility**: Easy to extend and customize
5. **Documentation**: Extensive documentation and community support

## References

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js JWT](https://next-auth.js.org/configuration/options#jwt)
- [NextAuth.js Callbacks](https://next-auth.js.org/configuration/callbacks)
- [NextAuth.js Middleware](https://next-auth.js.org/configuration/nextjs#middleware)

