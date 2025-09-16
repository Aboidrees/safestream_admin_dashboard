"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Menu,
  Home,
  Users,
  FolderOpen,
  Clock,
  BarChart3,
  Settings,
  CreditCard,
  QrCode,
  Database,
  LogOut,
} from "lucide-react"
import { useSupabase } from "@/lib/supabase/provider"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Child Profiles", href: "/dashboard/profiles", icon: Users },
  { name: "Content Library", href: "/dashboard/collections", icon: FolderOpen },
  { name: "Time Controls", href: "/dashboard/time-controls", icon: Clock },
  { name: "Watch History", href: "/dashboard/history", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Database", href: "/dashboard/database", icon: Database },
]

interface MobileDashboardShellProps {
  children: React.ReactNode
}

export function MobileDashboardShell({ children }: MobileDashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useSupabase()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between bg-white px-4 py-3 shadow-sm border-b">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="touch-target">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex h-full flex-col">
                {/* Mobile sidebar header */}
                <div className="flex items-center gap-3 px-4 py-4 border-b">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.user_metadata?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Mobile navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          group flex items-center px-3 py-3 text-sm font-medium rounded-md touch-target
                          ${
                            isActive
                              ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }
                        `}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 flex-shrink-0 ${
                            isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </nav>

                {/* Mobile sidebar footer */}
                <div className="border-t p-4">
                  <Button
                    variant="ghost"
                    onClick={signOut}
                    className="w-full justify-start touch-target text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-lg font-semibold text-gray-900">
            {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>

          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback>{user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r border-gray-200">
          {/* Desktop sidebar header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.user_metadata?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Desktop sidebar footer */}
          <div className="border-t p-4">
            <Button variant="ghost" onClick={signOut} className="w-full justify-start text-gray-700 hover:bg-gray-50">
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="mobile-padding py-6 lg:py-8">
          <div className="mobile-container">{children}</div>
        </main>
      </div>
    </div>
  )
}
