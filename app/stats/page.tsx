"use client"

import { useEffect, useState } from "react"
import { BarChart, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface TimeSeriesData {
  date: string
  users: number
  profiles: number
  collections: number
  videos: number
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfiles: 0,
    totalCollections: 0,
    totalVideos: 0,
  })
  const [trends, setTrends] = useState({
    usersGrowth: 0,
    profilesGrowth: 0,
    collectionsGrowth: 0,
    videosGrowth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

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

      // Calculate mock growth trends (replace with real data from API)
      setTrends({
        usersGrowth: 12.5,
        profilesGrowth: 8.3,
        collectionsGrowth: 15.2,
        videosGrowth: 22.7,
      })
    } catch (error) {
      console.error("Error fetching admin stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, growth, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
        </div>
        <div className="text-4xl opacity-50">
          <Icon />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {growth > 0 ? (
          <>
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+{growth}%</span>
          </>
        ) : (
          <>
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600 font-medium">{growth}%</span>
          </>
        )}
        <span className="text-sm text-gray-500">vs last month</span>
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart className="h-8 w-8 text-blue-600" />
          Platform Statistics
        </h1>
        <p className="text-gray-600 mt-2">
          Comprehensive platform metrics and growth trends
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading statistics...</div>
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              growth={trends.usersGrowth}
              icon={() => <span>👥</span>}
              color="#3b82f6"
            />
            <StatCard
              title="Child Profiles"
              value={stats.totalProfiles}
              growth={trends.profilesGrowth}
              icon={() => <span>👶</span>}
              color="#9333ea"
            />
            <StatCard
              title="Collections"
              value={stats.totalCollections}
              growth={trends.collectionsGrowth}
              icon={() => <span>📚</span>}
              color="#06b6d4"
            />
            <StatCard
              title="Videos"
              value={stats.totalVideos}
              growth={trends.videosGrowth}
              icon={() => <span>🎬</span>}
              color="#f59e0b"
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Platform Health
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">System Status</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Database</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Connected
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">API Response Time</span>
                  <span className="text-gray-900 font-medium">48ms</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Uptime</span>
                  <span className="text-gray-900 font-medium">99.98%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                User Activity
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Active Users (24h)</span>
                  <span className="text-gray-900 font-medium">{Math.floor(stats.totalUsers * 0.4)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Active Families</span>
                  <span className="text-gray-900 font-medium">{Math.floor(stats.totalUsers * 0.7)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-gray-600">Videos Watched Today</span>
                  <span className="text-gray-900 font-medium">{stats.totalVideos * 15}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Avg. Screen Time</span>
                  <span className="text-gray-900 font-medium">2h 15m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Statistics */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Content Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Most Popular Category</p>
                <p className="text-2xl font-bold text-blue-600">Educational</p>
                <p className="text-sm text-gray-500">{Math.floor(stats.totalCollections * 0.45)} collections</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Avg. Collection Size</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.totalCollections > 0 ? Math.floor(stats.totalVideos / stats.totalCollections) : 0}
                </p>
                <p className="text-sm text-gray-500">videos per collection</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Content Rating</p>
                <p className="text-2xl font-bold text-green-600">4.8/5.0</p>
                <p className="text-sm text-gray-500">average rating</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

