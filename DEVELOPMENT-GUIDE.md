# SafeStream Platform - Development Guide

**Version:** 1.0  
**Last Updated:** October 3, 2025  
**Purpose:** Reference guide for implementing parent dashboard and other features using established best practices

---

## 📋 Table of Contents

1. [Database Best Practices](#database-best-practices)
2. [Authentication Patterns](#authentication-patterns)
3. [API Development Standards](#api-development-standards)
4. [Validation & Security](#validation--security)
5. [Frontend Integration](#frontend-integration)
6. [Error Handling](#error-handling)
7. [Type Safety](#type-safety)
8. [Testing Patterns](#testing-patterns)
9. [Code Organization](#code-organization)
10. [Performance Optimization](#performance-optimization)

---

## 🗄️ Database Best Practices

### **Prisma ORM Usage**

#### **1. Client Configuration**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### **2. Query Optimization**
```typescript
// ✅ GOOD: Use select to fetch only needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    createdAt: true,
    admins: {
      select: { role: true, isActive: true },
      take: 1
    },
    _count: {
      select: { createdFamilies: true }
    }
  }
})

// ❌ BAD: Fetching all fields
const users = await prisma.user.findMany()
```

#### **3. Relationship Handling**
```typescript
// ✅ GOOD: Include related data efficiently
const families = await prisma.family.findMany({
  include: {
    creator: {
      select: { name: true, email: true }
    },
    _count: {
      select: { childProfiles: true, collections: true }
    }
  }
})

// ✅ GOOD: Use take for single relations
const user = await prisma.user.findFirst({
  include: {
    admins: {
      where: { isActive: true },
      select: { role: true },
      take: 1
    }
  }
})
```

#### **4. Error Handling**
```typescript
// ✅ GOOD: Proper error handling with cleanup
try {
  const result = await prisma.user.create({
    data: userData
  })
  return result
} catch (error) {
  console.error("Database error:", error)
  throw new Error("Failed to create user")
} finally {
  await prisma.$disconnect()
}
```

### **Database Security**

#### **1. Input Sanitization**
```typescript
// ✅ GOOD: Prisma automatically sanitizes inputs
const user = await prisma.user.findFirst({
  where: {
    email: userEmail, // Prisma handles SQL injection prevention
    isActive: true
  }
})
```

#### **2. Cascade Deletes**
```prisma
// schema.prisma
model User {
  id            String    @id @default(uuid())
  // ... other fields
  createdFamilies Family[] @relation("FamilyCreator")
  admins         Admin[]   @relation("UserAdmin")
  
  @@map("users")
}

model Family {
  id        String   @id @default(uuid())
  createdBy String   @map("created_by") @db.Uuid
  creator   User     @relation("FamilyCreator", fields: [createdBy], references: [id], onDelete: Cascade)
  
  @@map("families")
}
```

---

## 🔐 Authentication Patterns

### **JWT Token Management**

#### **1. Token Creation**
```typescript
// lib/jwt-enhanced.ts
export async function createAccessToken(payload: AccessTokenPayload): Promise<string> {
  const jti = randomUUID()
  const now = Math.floor(Date.now() / 1000)
  
  const tokenPayload: AccessTokenPayload = {
    ...payload,
    jti,
    type: 'access',
    iat: now,
    exp: now + Math.floor(ACCESS_TOKEN_LIFETIME / 1000),
    iss: 'safestream',
    aud: 'safestream-users',
  }

  // Store in database for revocation
  await prisma.tokenSession.create({
    data: {
      jti,
      userId: payload.id,
      tokenType: 'access',
      expiresAt: new Date(tokenPayload.exp * 1000),
    }
  })

  return await new SignJWT(tokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_LIFETIME)
    .setIssuer('safestream')
    .setAudience('safestream-users')
    .setJti(jti)
    .sign(secret)
}
```

#### **2. Token Verification**
```typescript
export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'safestream',
      audience: 'safestream-users',
    })

    // Validate with Zod
    const validatedPayload = AccessTokenPayloadSchema.parse(payload)

    // Check revocation status
    const tokenSession = await prisma.tokenSession.findFirst({
      where: {
        jti: validatedPayload.jti,
        tokenType: 'access',
        revoked: false,
        expiresAt: { gt: new Date() }
      }
    })

    return tokenSession ? validatedPayload : null
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
```

#### **3. Token Refresh Pattern**
```typescript
export async function refreshTokens(refreshToken: string): Promise<TokenPair | null> {
  try {
    // Verify refresh token
    const refreshPayload = await verifyRefreshToken(refreshToken)
    if (!refreshPayload) return null

    // Get fresh user data
    const user = await prisma.user.findFirst({
      where: { id: refreshPayload.id },
      include: {
        admins: {
          where: { isActive: true },
          select: { id: true, role: true },
          take: 1
        }
      }
    })

    if (!user) return null

    // Revoke old refresh token
    await revokeToken(refreshPayload.jti)

    // Create new tokens
    const accessToken = await createAccessToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: user.admins[0]?.role || 'user',
      isAdmin: !!user.admins[0],
      adminId: user.admins[0]?.id,
    })

    const newRefreshToken = await createRefreshToken({
      id: user.id,
      email: user.email,
    })

    return { accessToken, refreshToken: newRefreshToken }
  } catch (error) {
    console.error("Token refresh failed:", error)
    return null
  }
}
```

### **Authentication Middleware**

#### **1. User Authentication**
```typescript
// lib/auth-utils.ts
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get token from Authorization header or cookie
    let token: string | null = null

    const authHeader = req.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    }

    if (!token) {
      const sessionToken = req.cookies.get("next-auth.session-token")?.value
      if (sessionToken) {
        token = sessionToken
      }
    }

    if (!token) return null

    // Verify token
    const payload = await verifyAccessToken(token)
    if (!payload) return null

    // Validate admin status if needed
    const isAdmin = payload.isAdmin || false
    let adminId: string | undefined
    let role: string = payload.role || "user"

    if (isAdmin) {
      const adminValidation = await validateAdminToken(token)
      if (!adminValidation.isValid) return null
      adminId = adminValidation.adminId
      role = adminValidation.role || role
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: role,
      isAdmin: isAdmin,
      adminId: adminId,
    }
  } catch (error) {
    console.error("Error getting authenticated user:", error)
    return null
  }
}
```

#### **2. Role-Based Access Control**
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  
  // Check if route requires authentication
  if (isProtectedRoute(pathname)) {
    const user = await getAuthenticatedUser(req)
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    
    // Check admin routes
    if (isAdminRoute(pathname) && !user.isAdmin) {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }
    
    // Add user info to headers
    const response = NextResponse.next()
    response.headers.set("x-user-id", user.id)
    response.headers.set("x-user-email", user.email)
    response.headers.set("x-user-role", user.role)
    
    return response
  }
  
  return NextResponse.next()
}
```

---

## 🔌 API Development Standards

### **API Route Structure**

#### **1. Standard API Route Template**
```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    // 2. Authorization (if needed)
    if (isAdminRoute && !user.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    // 3. Business Logic
    const data = await prisma.resource.findMany({
      // Optimized query
    })

    // 4. Response
    return NextResponse.json({ data })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

#### **2. Resource-Specific Routes**
```typescript
// app/api/[resource]/[id]/route.ts
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const resource = await prisma.resource.findUnique({
      where: { id },
      include: {
        // Related data
      }
    })

    if (!resource) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ resource })
  } catch (error) {
    console.error("Error fetching resource:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### **API Response Standards**

#### **1. Success Responses**
```typescript
// Single resource
return NextResponse.json({ 
  resource: data,
  message: "Resource fetched successfully" 
})

// Collection
return NextResponse.json({ 
  resources: data,
  pagination: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10
  }
})

// Action result
return NextResponse.json({ 
  message: "Action completed successfully",
  id: resourceId 
})
```

#### **2. Error Responses**
```typescript
// Validation error
return NextResponse.json(
  { error: "Invalid input data", details: validationErrors },
  { status: 400 }
)

// Not found
return NextResponse.json(
  { error: "Resource not found" },
  { status: 404 }
)

// Unauthorized
return NextResponse.json(
  { error: "Authentication required" },
  { status: 401 }
)

// Forbidden
return NextResponse.json(
  { error: "Insufficient permissions" },
  { status: 403 }
)

// Server error
return NextResponse.json(
  { error: "Internal server error" },
  { status: 500 }
)
```

---

## ✅ Validation & Security

### **Input Validation with Zod**

#### **1. Schema Definition**
```typescript
// lib/schemas.ts
import { z } from 'zod'

export const UserCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(['user', 'admin']).optional()
})

export const UserUpdateSchema = UserCreateSchema.partial()

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
})
```

#### **2. API Validation**
```typescript
// app/api/users/route.ts
import { UserCreateSchema } from "@/lib/schemas"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = UserCreateSchema.parse(body)
    
    // Process validated data
    const user = await prisma.user.create({
      data: validatedData
    })
    
    return NextResponse.json({ user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### **Security Headers**

#### **1. Middleware Security**
```typescript
// middleware.ts
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
}
```

#### **2. Rate Limiting**
```typescript
// middleware.ts
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string, isAuthRequest: boolean = false): boolean {
  const now = Date.now()
  const key = `${ip}:${isAuthRequest ? 'auth' : 'general'}`
  const limit = isAuthRequest ? 50 : 1000 // requests per window
  
  const current = rateLimitStore.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + 15 * 60 * 1000 })
    return true
  }
  
  if (current.count >= limit) {
    return false
  }
  
  current.count++
  rateLimitStore.set(key, current)
  return true
}
```

---

## 🎨 Frontend Integration

### **API Integration Pattern**

#### **1. Data Fetching Hook**
```typescript
// hooks/useApi.ts
import { useState, useEffect } from 'react'

export function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(url, {
          credentials: 'include',
          ...options
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Request failed')
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error, refetch: () => fetchData() }
}
```

#### **2. Page Component Pattern**
```typescript
// app/parent/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import type { Family, ChildProfile } from '@/lib/types'

export default function ParentDashboard() {
  const [families, setFamilies] = useState<Family[]>([])
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch families
      const familiesResponse = await fetch('/api/parent/families')
      if (familiesResponse.ok) {
        const familiesData = await familiesResponse.json()
        setFamilies(familiesData.families)
      }
      
      // Fetch children
      const childrenResponse = await fetch('/api/parent/children')
      if (childrenResponse.ok) {
        const childrenData = await childrenResponse.json()
        setChildren(childrenData.children)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {/* Render data */}
    </div>
  )
}
```

### **Form Handling**

#### **1. Form with Validation**
```typescript
// components/forms/UserForm.tsx
'use client'

import { useState } from 'react'
import { z } from 'zod'

const UserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password too short")
})

type UserFormData = z.infer<typeof UserFormSchema>

export function UserForm({ onSubmit }: { onSubmit: (data: UserFormData) => Promise<void> }) {
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate
      const validatedData = UserFormSchema.parse(formData)
      setErrors({})
      
      setLoading(true)
      await onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with error display */}
    </form>
  )
}
```

---

## 🚨 Error Handling

### **Global Error Handling**

#### **1. API Error Handler**
```typescript
// lib/api-error-handler.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.statusCode }
    )
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Validation failed", details: error.errors },
      { status: 400 }
    )
  }

  console.error("Unexpected error:", error)
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  )
}
```

#### **2. Frontend Error Boundary**
```typescript
// components/ErrorBoundary.tsx
'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-semibold">Something went wrong</h2>
          <p className="text-red-600">Please try refreshing the page</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

---

## 🎯 Type Safety

### **Type Definitions**

#### **1. Unified Types**
```typescript
// lib/types.ts
export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  isActive: boolean
  familyCount?: number
}

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  role: string
  isAdmin: boolean
  adminId?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

#### **2. Component Props**
```typescript
// components/UserCard.tsx
interface UserCardProps {
  user: User
  onEdit?: (user: User) => void
  onDelete?: (userId: string) => void
  showActions?: boolean
}

export function UserCard({ user, onEdit, onDelete, showActions = true }: UserCardProps) {
  // Component implementation
}
```

---

## 🧪 Testing Patterns

### **API Testing**

#### **1. Unit Test Example**
```typescript
// __tests__/api/users.test.ts
import { POST } from '@/app/api/users/route'
import { NextRequest } from 'next/server'

describe('/api/users', () => {
  it('should create a user with valid data', async () => {
    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.user).toBeDefined()
    expect(data.user.email).toBe('test@example.com')
  })

  it('should return 400 for invalid data', async () => {
    const request = new NextRequest('http://localhost:3000/api/users', {
      method: 'POST',
      body: JSON.stringify({
        name: '', // Invalid: empty name
        email: 'invalid-email',
        password: '123' // Invalid: too short
      })
    })

    const response = await POST(request)
    expect(response.status).toBe(400)
  })
})
```

### **Integration Testing**

#### **1. Authentication Flow Test**
```typescript
// __tests__/integration/auth.test.ts
describe('Authentication Flow', () => {
  it('should complete full login flow', async () => {
    // 1. Login
    const loginResponse = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@safestream.app',
        password: 'password123'
      })
    })
    
    expect(loginResponse.ok).toBe(true)
    const { accessToken, refreshToken } = await loginResponse.json()
    
    // 2. Access protected route
    const protectedResponse = await fetch('/api/users', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    
    expect(protectedResponse.ok).toBe(true)
    
    // 3. Refresh token
    const refreshResponse = await fetch('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    })
    
    expect(refreshResponse.ok).toBe(true)
  })
})
```

---

## 📁 Code Organization

### **Directory Structure**
```
safestream_platform/
├── app/
│   ├── api/
│   │   ├── admin/          # Admin-only APIs
│   │   ├── parent/         # Parent dashboard APIs
│   │   └── auth/           # Authentication APIs
│   ├── (website)/          # Public website
│   ├── dashboard/          # Admin dashboard
│   └── parent/             # Parent dashboard
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── auth-utils.ts      # Authentication utilities
│   ├── jwt-enhanced.ts    # JWT management
│   ├── prisma.ts          # Database client
│   ├── types.ts           # Type definitions
│   └── utils.ts           # Utility functions
├── components/
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── hooks/                 # Custom React hooks
├── middleware.ts          # Next.js middleware
└── prisma/
    ├── schema.prisma      # Database schema
    └── seed.ts           # Seed data
```

### **Import Organization**
```typescript
// 1. React imports
import React, { useState, useEffect } from 'react'

// 2. Next.js imports
import { NextRequest, NextResponse } from 'next/server'

// 3. Third-party imports
import { z } from 'zod'
import bcrypt from 'bcryptjs'

// 4. Internal imports
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUser } from '@/lib/auth-utils'
import type { User } from '@/lib/types'

// 5. Relative imports
import { UserCard } from './UserCard'
```

---

## ⚡ Performance Optimization

### **Database Optimization**

#### **1. Query Optimization**
```typescript
// ✅ GOOD: Use indexes and efficient queries
const users = await prisma.user.findMany({
  where: {
    isActive: true,
    createdAt: {
      gte: new Date('2024-01-01')
    }
  },
  select: {
    id: true,
    name: true,
    email: true
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 20
})

// ❌ BAD: Inefficient query
const users = await prisma.user.findMany({
  include: {
    admins: true,
    createdFamilies: {
      include: {
        childProfiles: true
      }
    }
  }
})
```

#### **2. Caching Strategy**
```typescript
// lib/cache.ts
const cache = new Map<string, { data: any; expires: number }>()

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.data
  }
  cache.delete(key)
  return null
}

export function setCache<T>(key: string, data: T, ttl: number = 300000) {
  cache.set(key, {
    data,
    expires: Date.now() + ttl
  })
}
```

### **Frontend Optimization**

#### **1. Lazy Loading**
```typescript
// components/LazyUserList.tsx
import { lazy, Suspense } from 'react'

const UserList = lazy(() => import('./UserList'))

export function LazyUserList() {
  return (
    <Suspense fallback={<div>Loading users...</div>}>
      <UserList />
    </Suspense>
  )
}
```

#### **2. Memoization**
```typescript
// components/UserCard.tsx
import { memo } from 'react'

export const UserCard = memo(function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div>
      {/* Component content */}
    </div>
  )
})
```

---

## 🚀 Deployment Checklist

### **Environment Variables**
```bash
# Required for production
JWT_SECRET="<strong-random-secret-32-chars>"
NEXTAUTH_SECRET="<strong-random-secret-32-chars>"
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV="production"

# Optional
NEXTAUTH_URL="https://yourdomain.com"
```

### **Database Setup**
```bash
# 1. Run migrations
npm run db:migrate

# 2. Generate Prisma client
npm run db:generate

# 3. Seed data (optional)
npm run db:seed
```

### **Security Checklist**
- [ ] All environment variables set
- [ ] Database credentials secure
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Authentication on protected routes
- [ ] Error handling without information leakage

---

## 📚 Additional Resources

### **Documentation**
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Jose JWT Library](https://github.com/panva/jose)

### **Best Practices**
- [OWASP Security Guidelines](https://owasp.org/www-project-top-ten/)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

---

## 🎯 Quick Reference

### **Common Patterns**

#### **API Route Template**
```typescript
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    
    const data = await prisma.resource.findMany()
    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

#### **Frontend Data Fetching**
```typescript
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch('/api/endpoint')
    .then(res => res.json())
    .then(data => setData(data))
    .finally(() => setLoading(false))
}, [])
```

#### **Form Validation**
```typescript
const schema = z.object({
  field: z.string().min(1, "Required")
})

const handleSubmit = (data) => {
  try {
    const validated = schema.parse(data)
    // Process validated data
  } catch (error) {
    // Handle validation errors
  }
}
```

---

**This guide provides all the patterns and practices used in the admin dashboard that should be replicated in the parent dashboard for consistency, security, and maintainability.**


