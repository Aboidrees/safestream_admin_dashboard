"use client"

import { useEffect, useState } from "react"

export default function AdminHomePage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfiles: 0,
    totalCollections: 0,
    totalVideos: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Fetch stats from API endpoints
        const [usersRes, profilesRes, collectionsRes, videosRes] = await Promise.all([
          fetch('/api/admin/stats/users'),
          fetch('/api/admin/stats/profiles'),
          fetch('/api/admin/stats/collections'),
          fetch('/api/admin/stats/videos')
        ])

        const [usersData, profilesData, collectionsData, videosData] = await Promise.all([
          usersRes.json(),
          profilesRes.json(),
          collectionsRes.json(),
          videosRes.json()
        ])

        setStats({
          totalUsers: usersData.count || 0,
          totalProfiles: profilesData.count || 0,
          totalCollections: collectionsData.count || 0,
          totalVideos: videosData.count || 0,
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome to the SafeStream admin dashboard. Monitor platform statistics and manage users, content, and system settings.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading statistics...</div>
        </div>
      ) : (
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
      )}

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

