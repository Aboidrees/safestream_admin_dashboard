"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import type React from "react"
import type { AdminShellProps } from "@/lib/types"

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname()

  const isAuthPage = pathname === "/login"

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-[#ef4e50] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              SafeStream Admin
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-white hover:text-gray-200 transition-colors"
              >
                View Website
              </Link>
              <button 
                onClick={handleSignOut}
                className="bg-white text-[#ef4e50] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-lg min-h-screen border-r border-gray-200">
          <nav className="p-4">
            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                Dashboard
              </div>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    📊 Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/stats" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    📈 Statistics
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                User Management
              </div>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/users" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    👥 All Users
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/families" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    👨‍👩‍👧‍👦 Family Management
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                Admin Management
              </div>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/admins" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    🛡️ Admin Accounts
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                Content Management
              </div>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/content/collections" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    📚 Collections
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/content/videos" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    🎬 Videos
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/content/moderation" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    ⚠️ Moderation
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                System
              </div>
              <ul className="space-y-1">
                <li>
                  <Link 
                    href="/reports" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    📋 Reports
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/settings" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-[#ef4e50] rounded-lg transition-colors"
                  >
                    ⚙️ Settings
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}


