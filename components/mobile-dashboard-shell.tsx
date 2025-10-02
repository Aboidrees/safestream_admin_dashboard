"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Users, Video, Settings, LogOut, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function MobileDashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/children", label: "Children", icon: Users },
    { href: "/dashboard/collections", label: "Collections", icon: Video },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
        <div className="flex h-16 items-center px-4">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="flex flex-col h-full">
                <div className="flex items-center space-x-2 px-2 py-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <span className="text-xl font-bold">SafeStream</span>
                </div>
                <nav className="flex-1 space-y-1 px-2 py-4">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive ? "bg-blue-100 text-blue-900" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>
                <div className="border-t p-4">
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center space-x-2 ml-4">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">SafeStream</span>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r bg-white overflow-y-auto">
          <div className="flex items-center space-x-2 px-6 py-4 border-b">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">SafeStream</span>
          </div>
          <nav className="flex-1 space-y-1 px-4 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-blue-100 text-blue-900" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
          <div className="border-t p-4">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="py-6 px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
