import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function AdminHomePage() {
  // Check authentication
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user?.isAdmin) {
    console.log("❌ No admin session found, redirecting to login")
    redirect("/login")
  }

  console.log("✅ Admin session found:", session.user.email)
  // Fetch stats directly from the database (server-side)
  let stats = {
    totalUsers: 0,
    totalProfiles: 0,
    totalCollections: 0,
    totalVideos: 0,
  }

  try {
    const [totalUsers, totalProfiles, totalCollections, totalVideos] = await Promise.all([
      prisma.user.count(),
      prisma.childProfile.count(),
      prisma.collection.count(),
      prisma.video.count(),
    ])

    stats = {
      totalUsers,
      totalProfiles,
      totalCollections,
      totalVideos,
    }
  } catch (error) {
    // Optionally log error
    console.error("Error fetching admin stats:", error)
    // stats remain as zeroes
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the SafeStream admin dashboard. Monitor platform statistics and manage users, content, and system settings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </div>
            <div className="text-4xl">👥</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Child Profiles</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalProfiles}</p>
            </div>
            <div className="text-4xl">👶</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Collections</p>
              <p className="text-3xl font-bold text-cyan-600">{stats.totalCollections}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Videos</p>
              <p className="text-3xl font-bold text-orange-600">{stats.totalVideos}</p>
            </div>
            <div className="text-4xl">🎬</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/users"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
            <p className="text-sm text-gray-600">View, edit, and manage user accounts</p>
          </a>

          <a
            href="/content-moderation"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="text-2xl mb-2">⚠️</div>
            <h3 className="font-semibold text-gray-900 mb-1">Content Moderation</h3>
            <p className="text-sm text-gray-600">Review and moderate platform content</p>
          </a>

          <a
            href="/reports"
            className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-gray-900 mb-1">View Reports</h3>
            <p className="text-sm text-gray-600">Platform analytics and reports</p>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <p className="text-gray-500 text-center py-8">No recent activity to display</p>
      </div>
    </div>
  )
}


