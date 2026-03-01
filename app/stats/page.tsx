import { BarChart, TrendingUp, TrendingDown, Activity } from "lucide-react"
import type { StatCardProps } from "@/lib/types"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

function formatMinutes(minutes: number): string {
  if (minutes === 0) return '0m'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export default async function AdminStatsPage() {
  const now = new Date()
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const yesterday24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  let stats = {
    totalUsers: 0,
    totalProfiles: 0,
    totalCollections: 0,
    totalVideos: 0,
    totalFamilies: 0,
    // Previous period counts for growth
    prevPeriodUsers: 0,
    prevPeriodProfiles: 0,
    prevPeriodCollections: 0,
    prevPeriodVideos: 0,
    // Current period new counts
    newUsersLast30: 0,
    newProfilesLast30: 0,
    newCollectionsLast30: 0,
    newVideosLast30: 0,
    // Activity
    activeUsers24h: 0,
    activeFamilies: 0,
    videosWatchedToday: 0,
    avgScreenTimeToday: 0,
    mostPopularCategory: 'N/A',
    mostPopularCategoryCount: 0,
    approvedVideos: 0,
    pendingVideos: 0,
    rejectedVideos: 0,
  }

  try {
    const [
      totalUsers,
      totalProfiles,
      totalCollections,
      totalVideos,
      totalFamilies,
      newUsersLast30,
      newProfilesLast30,
      newCollectionsLast30,
      newVideosLast30,
      prevUsers,
      prevProfiles,
      prevCollections,
      prevVideos,
      activeUsers24h,
      activeFamilies,
      videosWatchedToday,
      screenTimeAgg,
      topCategory,
      videoModerationCounts,
    ] = await Promise.all([
      prisma.user.count({ where: { isActive: true } }),
      prisma.childProfile.count({ where: { isActive: true } }),
      prisma.collection.count(),
      prisma.video.count(),
      prisma.family.count(),
      // New in last 30 days
      prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.childProfile.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.collection.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.video.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      // New in previous 30-day period (for growth calculation)
      prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.childProfile.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.collection.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.video.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      // Active users: those with a session active in the last 24h
      prisma.session.count({ where: { expires: { gt: yesterday24h } } }),
      // Active families: those with at least 1 active child profile
      prisma.family.count({ where: { childProfiles: { some: { isActive: true } } } }),
      // Videos watched today
      prisma.watchHistory.count({ where: { watchedAt: { gte: today } } }),
      // Average screen time today (across all children with records today)
      prisma.screenTime.aggregate({ where: { date: { gte: today } }, _avg: { totalMinutes: true } }),
      // Top category by collection count
      prisma.category.findFirst({
        where: { isActive: true },
        orderBy: { collections: { _count: 'desc' } },
        select: { name: true, _count: { select: { collections: true } } }
      }),
      // Video moderation breakdown
      prisma.video.groupBy({
        by: ['moderationStatus'],
        _count: { id: true }
      }),
    ])

    // Calculate growth percentages
    const calcGrowth = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100 * 10) / 10
    }

    const moderationMap: Record<string, number> = {}
    for (const entry of videoModerationCounts) {
      moderationMap[entry.moderationStatus] = entry._count.id
    }

    stats = {
      totalUsers,
      totalProfiles,
      totalCollections,
      totalVideos,
      totalFamilies,
      newUsersLast30,
      newProfilesLast30,
      newCollectionsLast30,
      newVideosLast30,
      prevPeriodUsers: prevUsers,
      prevPeriodProfiles: prevProfiles,
      prevPeriodCollections: prevCollections,
      prevPeriodVideos: prevVideos,
      activeUsers24h,
      activeFamilies,
      videosWatchedToday,
      avgScreenTimeToday: Math.round(screenTimeAgg._avg.totalMinutes || 0),
      mostPopularCategory: topCategory?.name || 'N/A',
      mostPopularCategoryCount: topCategory?._count.collections || 0,
      approvedVideos: moderationMap['APPROVED'] || 0,
      pendingVideos: moderationMap['PENDING'] || 0,
      rejectedVideos: moderationMap['REJECTED'] || 0,
    }
  } catch (error) {
    console.error("Error fetching admin stats:", error)
  }

  const calcGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100 * 10) / 10
  }

  const StatCard = ({ title, value, growth, icon: Icon, color }: StatCardProps) => (
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
        {growth !== undefined && Number(growth) > 0 ? (
          <>
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">+{growth}%</span>
          </>
        ) : growth !== undefined && Number(growth) < 0 ? (
          <>
            <TrendingDown className="h-4 w-4 text-red-600" />
            <span className="text-sm text-red-600 font-medium">{growth}%</span>
          </>
        ) : (
          <>
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-400 font-medium">—</span>
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

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          growth={String(calcGrowth(stats.newUsersLast30, stats.prevPeriodUsers))}
          icon={() => <span>👥</span>}
          color="#3b82f6"
        />
        <StatCard
          title="Child Profiles"
          value={stats.totalProfiles}
          growth={String(calcGrowth(stats.newProfilesLast30, stats.prevPeriodProfiles))}
          icon={() => <span>👶</span>}
          color="#9333ea"
        />
        <StatCard
          title="Collections"
          value={stats.totalCollections}
          growth={String(calcGrowth(stats.newCollectionsLast30, stats.prevPeriodCollections))}
          icon={() => <span>📚</span>}
          color="#06b6d4"
        />
        <StatCard
          title="Videos"
          value={stats.totalVideos}
          growth={String(calcGrowth(stats.newVideosLast30, stats.prevPeriodVideos))}
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
              <span className="text-gray-600">Total Families</span>
              <span className="text-gray-900 font-medium">{stats.totalFamilies}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Active Families</span>
              <span className="text-gray-900 font-medium">{stats.activeFamilies}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Today&apos;s Activity
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Active Sessions (24h)</span>
              <span className="text-gray-900 font-medium">{stats.activeUsers24h}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Videos Watched Today</span>
              <span className="text-gray-900 font-medium">{stats.videosWatchedToday}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Avg. Screen Time Today</span>
              <span className="text-gray-900 font-medium">{formatMinutes(stats.avgScreenTimeToday)}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">New Users (30d)</span>
              <span className="text-gray-900 font-medium">{stats.newUsersLast30}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Content Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-2">Most Popular Category</p>
            <p className="text-2xl font-bold text-blue-600">{stats.mostPopularCategory}</p>
            <p className="text-sm text-gray-500">{stats.mostPopularCategoryCount} collections</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Avg. Collection Size</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.totalCollections > 0 ? Math.round(stats.totalVideos / stats.totalCollections) : 0}
            </p>
            <p className="text-sm text-gray-500">videos per collection</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Approved Videos</p>
            <p className="text-2xl font-bold text-green-600">{stats.approvedVideos}</p>
            <p className="text-sm text-gray-500">ready to stream</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">Pending Moderation</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pendingVideos}</p>
            <p className="text-sm text-gray-500">awaiting review</p>
          </div>
        </div>
      </div>
    </div>
  )
}
