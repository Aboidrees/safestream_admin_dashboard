import type React from "react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-red-500">
              SafeStream Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900"
              >
                View Website
              </Link>
              <form action="/api/auth/signout" method="post">
                <button 
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/dashboard" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/families" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Families
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/children" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Children
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/collections" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Content Collections
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/screen-time" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Screen Time
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/remote-control" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Remote Control
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/notifications" 
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Notifications
                </Link>
              </li>
            </ul>
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
