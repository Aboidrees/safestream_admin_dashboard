import type React from "react"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/admin" className="text-2xl font-bold text-white">
              SafeStream Admin
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-white hover:text-gray-200 transition-colors"
              >
                View Website
              </Link>
              <form action="/api/auth/signout" method="post">
                <button 
                  type="submit"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Logout
                </button>
              </form>
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
                    href="/admin" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    📊 Overview
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/stats" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
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
                    href="/admin/users" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    👥 All Users
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/families" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    👨‍👩‍👧‍👦 Families
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/children" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    👶 Child Profiles
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
                    href="/admin/collections" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    📚 Collections
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/videos" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    🎬 Videos
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/content-moderation" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
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
                    href="/admin/reports" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    📋 Reports
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/settings" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    ⚙️ Settings
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/admin/setup" 
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  >
                    🔧 Admin Setup
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

