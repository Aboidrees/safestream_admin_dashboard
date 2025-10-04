# SafeStream Platform - Implementation Roadmap

**Current Status:** Admin Dashboard Complete ✅  
**Next Phase:** Parent Dashboard Implementation  
**Target:** Full Platform Completion

---

## 🎯 Implementation Phases

### **Phase 1: Admin Dashboard** ✅ **COMPLETE**
- [x] Authentication system
- [x] JWT token management
- [x] Database schema & migrations
- [x] Admin API endpoints (7/7)
- [x] Admin UI pages (5/5)
- [x] Security middleware
- [x] Type safety
- [x] Documentation

### **Phase 2: Parent Dashboard** 🚧 **IN PROGRESS**
- [ ] Parent authentication flow
- [ ] Parent API endpoints
- [ ] Parent UI components
- [ ] Family management features
- [ ] Screen time controls
- [ ] Content management

### **Phase 3: Mobile Apps** 📱 **PLANNED**
- [ ] React Native parent app
- [ ] React Native child app
- [ ] Mobile authentication
- [ ] Offline capabilities
- [ ] Push notifications

### **Phase 4: Advanced Features** 🔮 **FUTURE**
- [ ] Real-time notifications
- [ ] WebSocket integration
- [ ] AI content moderation
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 🚀 Parent Dashboard Implementation Plan

### **Step 1: Authentication & Authorization**

#### **1.1 Update Middleware for Parent Routes**
```typescript
// middleware.ts - Add parent route handling
const parentRoutes = [
  "/",
  "/children",
  "/screen-time", 
  "/collections",
  "/settings",
  "/profile"
]

function isParentRoute(pathname: string): boolean {
  return parentRoutes.some(route => {
    if (route === "/") return pathname === "/"
    return pathname.startsWith(route)
  })
}

// In middleware function
if (isParentRoute(pathname)) {
  const user = await getAuthenticatedUser(req)
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  // Check if user has family access
  const hasFamilyAccess = await checkFamilyAccess(user.id)
  if (!hasFamilyAccess) {
    return NextResponse.redirect(new URL('/unauthorized', req.url))
  }
  
  return createSecurityResponse(req)
}
```

#### **1.2 Create Family Access Utilities**
```typescript
// lib/family-utils.ts
import { prisma } from './prisma'

export async function checkFamilyAccess(userId: string): Promise<boolean> {
  try {
    const familyMember = await prisma.familyMember.findFirst({
      where: {
        userId: userId,
        role: 'PARENT',
        isActive: true
      }
    })
    
    return !!familyMember
  } catch (error) {
    console.error("Error checking family access:", error)
    return false
  }
}

export async function getParentFamilies(userId: string) {
  return await prisma.familyMember.findMany({
    where: {
      userId: userId,
      role: 'PARENT',
      isActive: true
    },
    include: {
      family: {
        include: {
          childProfiles: true,
          _count: {
            select: { childProfiles: true }
          }
        }
      }
    }
  })
}

export async function getParentChildren(userId: string) {
  const parentFamilies = await getParentFamilies(userId)
  const familyIds = parentFamilies.map(f => f.family.id)
  
  return await prisma.childProfile.findMany({
    where: {
      familyId: { in: familyIds }
    },
    include: {
      family: {
        select: {
          name: true,
          id: true
        }
      }
    }
  })
}
```

### **Step 2: Parent API Endpoints**

#### **2.1 Children Management API**
```typescript
// app/api/children/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import { getParentChildren } from "@/lib/family-utils"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const children = await getParentChildren(user.id)
    
    const formattedChildren = children.map(child => {
      const screenTimeLimits = child.screenTimeLimits as { daily?: number } || {}
      
      return {
        id: child.id,
        name: child.name,
        age: child.age,
        familyName: child.family.name,
        familyId: child.family.id,
        screenTimeLimit: screenTimeLimits.daily || 0,
        qrCode: child.qrCode,
        createdAt: child.createdAt.toISOString(),
        isActive: child.isActive
      }
    })

    return NextResponse.json({ children: formattedChildren })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

#### **2.2 Screen Time API**
```typescript
// app/api/screen-time/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import { getParentChildren } from "@/lib/family-utils"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const childId = searchParams.get('childId')
    const days = parseInt(searchParams.get('days') || '7')

    const children = await getParentChildren(user.id)
    const childIds = children.map(c => c.id)

    const screenTimeData = await prisma.screenTime.findMany({
      where: {
        childProfileId: { in: childIds },
        ...(childId ? { childProfileId: childId } : {}),
        date: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        childProfile: {
          select: {
            name: true,
            screenTimeLimits: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    // Group by child
    const groupedData = children.map(child => {
      const childScreenTime = screenTimeData.filter(st => st.childProfileId === child.id)
      const totalMinutes = childScreenTime.reduce((sum, st) => sum + st.totalMinutes, 0)
      const screenTimeLimits = child.screenTimeLimits as { daily?: number } || {}
      const dailyLimit = screenTimeLimits.daily || 0

      return {
        childId: child.id,
        childName: child.name,
        dailyLimit,
        totalMinutes,
        days: childScreenTime.map(st => ({
          date: st.date.toISOString().split('T')[0],
          totalMinutes: st.totalMinutes,
          videoMinutes: st.videoMinutes,
          gameMinutes: st.gameMinutes,
          educationalMinutes: st.educationalMinutes
        }))
      }
    })

    return NextResponse.json({ screenTimeData: groupedData })
  } catch (error) {
    console.error("Error fetching screen time:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

#### **2.3 Collections API**
```typescript
// app/api/collections/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const collections = await prisma.collection.findMany({
      where: {
        isPublic: true
      },
      include: {
        creator: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            videos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedCollections = collections.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      category: c.category || 'General',
      ageRating: c.ageRating,
      videoCount: c._count.videos,
      isPublic: c.isPublic,
      isMandatory: c.isMandatory,
      creatorName: c.creator.name || 'Unknown',
      createdAt: c.createdAt.toISOString()
    }))

    return NextResponse.json({ collections: formattedCollections })
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### **Step 3: Parent UI Components**

#### **3.1 Root Layout with Parent Navigation**
```typescript
// app/layout.tsx
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'
import { AuthProvider } from '@/lib/auth-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="lg:pl-64">
              <Header />
              <main className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
```

#### **3.2 Parent Dashboard Home**
```typescript
// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Clock, BookOpen, TrendingUp } from 'lucide-react'

interface DashboardStats {
  totalChildren: number
  totalScreenTime: number
  totalCollections: number
  weeklyGrowth: number
}

export default function ParentDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      
      const [childrenRes, screenTimeRes, collectionsRes] = await Promise.all([
        fetch('/api/children'),
        fetch('/api/screen-time'),
        fetch('/api/collections')
      ])

      const [childrenData, screenTimeData, collectionsData] = await Promise.all([
        childrenRes.json(),
        screenTimeRes.json(),
        collectionsRes.json()
      ])

      const totalScreenTime = screenTimeData.screenTimeData?.reduce(
        (sum: number, child: any) => sum + child.totalMinutes, 0
      ) || 0

      setStats({
        totalChildren: childrenData.children?.length || 0,
        totalScreenTime,
        totalCollections: collectionsData.collections?.length || 0,
        weeklyGrowth: 12
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  if (loading) {
    return <div>Loading dashboard...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your family's SafeStream activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalChildren || 0}</div>
            <p className="text-xs text-muted-foreground">Active profiles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Screen Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats?.totalScreenTime || 0) / 60)}h
            </div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCollections || 0}</div>
            <p className="text-xs text-muted-foreground">Available content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.weeklyGrowth || 0}%</div>
            <p className="text-xs text-muted-foreground">From last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Recent activity items */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Screen Time Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Screen time chart */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

#### **3.3 Children Management Page**
```typescript
// app/children/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, QrCode, Settings } from 'lucide-react'
import type { ChildProfile } from '@/lib/types'

export default function ChildrenPage() {
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [loading, setLoading] = useState(true)

  const fetchChildren = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/children')
      const data = await response.json()
      
      if (response.ok && data.children) {
        setChildren(data.children)
      } else {
        console.error('Failed to fetch children:', data.error)
      }
    } catch (error) {
      console.error('Error fetching children:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChildren()
  }, [])

  if (loading) {
    return <div>Loading children...</div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Children</h1>
        <p className="text-gray-600 mt-2">
          Manage your children's profiles and settings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child) => (
          <Card key={child.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{child.name}</CardTitle>
                <Badge variant={child.isActive ? "default" : "secondary"}>
                  {child.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="font-medium">Age:</span>
                  <span className="ml-2">{child.age} years old</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Daily limit: {Math.round(child.screenTimeLimit / 60)}h</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <QrCode className="h-4 w-4 mr-2" />
                  <span className="font-mono text-xs">{child.qrCode}</span>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-4 w-4 mr-1" />
                      Settings
                    </Button>
                    <Button size="sm" className="flex-1">
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

### **Step 4: Navigation Components**

#### **4.1 Parent Sidebar**
```typescript
// components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  Users,
  Clock,
  BookOpen,
  Settings,
  User
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Children', href: '/children', icon: Users },
  { name: 'Screen Time', href: '/screen-time', icon: Clock },
  { name: 'Collections', href: '/collections', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Profile', href: '/profile', icon: User },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 shadow-sm">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-gray-900">SafeStream</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-gray-50 text-red-600'
                            : 'text-gray-700 hover:text-red-600 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-red-600',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
```

#### **4.2 Parent Header**
```typescript
// components/Header.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Bell, LogOut, Settings, User } from 'lucide-react'

export function Header() {
  const [notifications] = useState(3)

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                {notifications}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
```

---

## 🧪 Testing Strategy

### **Unit Tests**
```typescript
// __tests__/api/children.test.ts
import { GET } from '@/app/api/children/route'
import { NextRequest } from 'next/server'

describe('/api/children', () => {
  it('should return children for authenticated parent', async () => {
    const request = new NextRequest('http://localhost:3000/api/children')
    
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.children).toBeDefined()
    expect(Array.isArray(data.children)).toBe(true)
  })
})
```

### **Integration Tests**
```typescript
// __tests__/integration/parent-dashboard.test.ts
describe('Parent Dashboard Integration', () => {
  it('should complete parent login and dashboard flow', async () => {
    // 1. Login as parent
    const loginResponse = await fetch('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'parent@safestream.app',
        password: 'password123'
      })
    })
    
    expect(loginResponse.ok).toBe(true)
    
    // 2. Access dashboard
    const dashboardResponse = await fetch('/')
    expect(dashboardResponse.ok).toBe(true)
    
    // 3. Access children page
    const childrenResponse = await fetch('/children')
    expect(childrenResponse.ok).toBe(true)
  })
})
```

---

## 🚀 Deployment Checklist

### **Parent Dashboard Specific**
- [ ] Parent routes added to middleware
- [ ] Family access utilities created
- [ ] Parent API endpoints implemented
- [ ] Parent UI components built
- [ ] Parent navigation configured
- [ ] Parent authentication flow tested
- [ ] Parent data fetching tested
- [ ] Parent error handling implemented

### **Security Checklist**
- [ ] Parent routes require authentication
- [ ] Family access validation on all endpoints
- [ ] Input validation on all forms
- [ ] Error handling without data leakage
- [ ] Rate limiting on parent endpoints
- [ ] CORS configured for parent APIs

---

## 📊 Progress Tracking

### **Current Status**
- ✅ Admin Dashboard: 100% Complete
- 🚧 Parent Dashboard: 0% Complete
- 📱 Mobile Apps: 0% Complete
- 🔮 Advanced Features: 0% Complete

### **Next Milestones**
1. **Week 1**: Parent authentication & basic API endpoints
2. **Week 2**: Parent UI components & navigation
3. **Week 3**: Parent dashboard features & testing
4. **Week 4**: Mobile app planning & setup

---

## 🎯 Success Metrics

### **Technical Metrics**
- [ ] 100% API endpoint coverage
- [ ] 100% UI component coverage
- [ ] 0 ESLint errors
- [ ] 90%+ test coverage
- [ ] < 2s page load times

### **Feature Metrics**
- [ ] Parent can view children
- [ ] Parent can manage screen time
- [ ] Parent can browse collections
- [ ] Parent can update settings
- [ ] Parent can view profile

---

**This roadmap provides a clear path to complete the parent dashboard implementation using the same patterns and practices established in the admin dashboard.**


