# Edge Middleware Authentication Fix

## Problem
The admin dashboard was experiencing a redirect loop in production where:
1. Users would successfully log in and receive a valid JWT token
2. The edge middleware would detect the session cookie but `getToken()` would return `null`
3. This caused a redirect back to `/login` even though the user was authenticated
4. The loop would continue indefinitely

## Root Cause
The issue was caused by using `getToken` from `next-auth/jwt` in the edge middleware. Edge middleware runs in Vercel's edge runtime, which has limitations when trying to decode JWT tokens created in the lambda runtime. This created a compatibility issue where:

- JWT tokens were created in the lambda runtime (via `getServerSession`)
- Edge middleware tried to decode them using `getToken` 
- The edge runtime couldn't properly decode the lambda-created tokens
- This resulted in `getToken()` returning `null` even when valid session cookies were present

## Solution
I implemented a two-tier authentication approach:

### 1. Simplified Edge Middleware
- **File**: `middleware.ts`
- **Change**: Removed `getToken` calls entirely
- **Behavior**: Only checks for the *presence* of the `next-auth.session-token` cookie
- **Result**: Fast edge middleware that doesn't attempt JWT decoding

### 2. Server-Side Authentication
- **File**: `lib/auth-session.ts`
- **Change**: Replaced `getToken` with `getServerSession`
- **Behavior**: Performs full JWT validation in the lambda runtime where it works reliably
- **Result**: Proper authentication validation without edge runtime limitations

### 3. Updated API Routes
- **Files**: All API routes in `app/api/`
- **Change**: Removed `req` parameter from `requireAdmin()` and `requireRole()` calls
- **Behavior**: Uses server-side session validation instead of edge middleware token decoding
- **Result**: Consistent authentication across all API endpoints

## How It Works Now

1. **Edge Middleware**: Quickly checks if session cookie exists
   - If no cookie → redirect to login
   - If cookie exists → allow request to proceed

2. **Page Components**: Use `getServerSession` for full validation
   - Validates JWT token in lambda runtime
   - Redirects to login if invalid or not admin
   - Allows access if valid admin session

3. **API Routes**: Use `requireAdmin()` for authentication
   - Calls `getServerSession` internally
   - Throws authentication errors if invalid
   - Returns admin data if valid

## Benefits

- ✅ **No more redirect loops**: Edge middleware doesn't attempt JWT decoding
- ✅ **Reliable authentication**: Server-side validation works consistently
- ✅ **Better performance**: Edge middleware is faster without JWT operations
- ✅ **Production stability**: Works correctly in Vercel's edge + lambda architecture

## Files Modified

- `middleware.ts` - Simplified to cookie presence check only
- `lib/auth-session.ts` - Replaced `getToken` with `getServerSession`
- All API routes - Updated `requireAdmin()` calls to remove `req` parameter

## Testing

The fix should resolve the production redirect loop issue. Users should now be able to:
1. Log in successfully
2. Stay authenticated without redirect loops
3. Access all admin dashboard features
4. Use API endpoints without authentication errors