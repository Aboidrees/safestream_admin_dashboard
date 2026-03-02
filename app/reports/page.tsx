import { BarChart3, TrendingUp, TrendingDown, FileText, Users, Film, Clock, Shield, Download } from "lucide-react"
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

export default async function AdminReportsPage() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const [
    totalUsers,
    newUsersThisPeriod,
    newUsersPrevPeriod,
    activeSessions,
    totalVideos,
    approvedVideos,
    pendingVideos,
    videosWatchedThisPeriod,
    topCollections,
    totalFamilies,
    newFamiliesThisPeriod,
    newFamiliesPrevPeriod,
    screenTimeAgg,
    flaggedVideos,
    moderatedThisPeriod,
  ] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.session.count({ where: { expires: { gt: new Date(now.getTime() - 24 * 60 * 60 * 1000) } } }),
    prisma.video.count(),
    prisma.video.count({ where: { moderationStatus: 'APPROVED' } }),
    prisma.video.count({ where: { moderationStatus: 'PENDING' } }),
    prisma.watchHistory.count({ where: { watchedAt: { gte: thirtyDaysAgo } } }),
    prisma.collection.findMany({
      take: 5,
      orderBy: { collectionVideos: { _count: 'desc' } },
      select: { id: true, name: true, _count: { select: { collectionVideos: true } } }
    }),
    prisma.family.count(),
    prisma.family.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.family.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.screenTime.aggregate({
      where: { date: { gte: thirtyDaysAgo } },
      _avg: { totalMinutes: true },
      _sum: { totalMinutes: true },
    }),
    prisma.video.count({ where: { moderationStatus: 'FLAGGED' } }),
    prisma.video.count({
      where: {
        moderatedAt: { gte: thirtyDaysAgo },
        moderationStatus: { in: ['APPROVED', 'REJECTED', 'FLAGGED'] }
      }
    }),
  ])

  const calcGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return Math.round(((current - previous) / previous) * 100 * 10) / 10
  }

  const userGrowth = calcGrowth(newUsersThisPeriod, newUsersPrevPeriod)
  const familyGrowth = calcGrowth(newFamiliesThisPeriod, newFamiliesPrevPeriod)
  const approvalRate = totalVideos > 0 ? Math.round((approvedVideos / totalVideos) * 100) : 0
  const avgScreenTime = Math.round(screenTimeAgg._avg.totalMinutes || 0)

  const GrowthBadge = ({ value }: { value: number }) => (
    <div className={`flex items-center text-sm font-medium ${value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-500'}`}>
      {value > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
      {value > 0 ? `+${value}%` : `${value}%`} vs last period
    </div>
  )

  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-[#ef4e50]" />
            Platform Reports
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive platform analytics for the last 30 days
          </p>
        </div>
        <button className="px-4 py-2 bg-[#ef4e50] text-white rounded-lg hover:bg-[#c03233] transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Reports
        </button>
      </div>

      {/* Report Cards with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

        {/* User Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Users className="h-6 w-6 text-[#ef4e50]" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">User Activity Report</h3>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Users</span>
              <span className="font-semibold">{totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">New This Period</span>
              <span className="font-semibold text-[#ef4e50]">+{newUsersThisPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Sessions (24h)</span>
              <span className="font-semibold">{activeSessions}</span>
            </div>
          </div>
          <GrowthBadge value={userGrowth} />
        </div>

        {/* Content Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Film className="h-6 w-6 text-[#ef4e50]" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Content Performance</h3>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Videos Watched</span>
              <span className="font-semibold">{videosWatchedThisPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approval Rate</span>
              <span className="font-semibold text-green-600">{approvalRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Review</span>
              <span className={`font-semibold ${pendingVideos > 0 ? 'text-orange-600' : ''}`}>{pendingVideos}</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Top: {topCollections[0]?.name || 'N/A'} ({topCollections[0]?._count.collectionVideos || 0} videos)
          </div>
        </div>

        {/* Family Analytics */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Family Analytics</h3>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Families</span>
              <span className="font-semibold">{totalFamilies}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">New This Period</span>
              <span className="font-semibold text-green-600">+{newFamiliesThisPeriod}</span>
            </div>
          </div>
          <GrowthBadge value={familyGrowth} />
        </div>

        {/* Screen Time */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Screen Time Report</h3>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Avg. Daily Per Child</span>
              <span className="font-semibold">{formatMinutes(avgScreenTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Minutes Logged</span>
              <span className="font-semibold">{(screenTimeAgg._sum.totalMinutes || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Safety & Moderation */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Safety &amp; Moderation</h3>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Flagged Videos</span>
              <span className={`font-semibold ${flaggedVideos > 0 ? 'text-red-600' : 'text-gray-900'}`}>{flaggedVideos}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Moderated This Period</span>
              <span className="font-semibold">{moderatedThisPeriod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Review</span>
              <span className={`font-semibold ${pendingVideos > 0 ? 'text-orange-600' : ''}`}>{pendingVideos}</span>
            </div>
          </div>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <FileText className="h-6 w-6 text-cyan-600" />
            </div>
            <span className="text-xs text-gray-500">Current</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">System Performance</h3>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Database</span>
              <span className="font-semibold text-green-600">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold text-green-600">Operational</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            All systems normal
          </div>
        </div>
      </div>

      {/* Top Collections Table */}
      {topCollections.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Collections by Video Count</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-600 font-medium">#</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Collection</th>
                  <th className="text-right py-2 text-gray-600 font-medium">Videos</th>
                </tr>
              </thead>
              <tbody>
                {topCollections.map((col, i) => (
                  <tr key={col.id} className="border-b last:border-0">
                    <td className="py-3 text-gray-500">{i + 1}</td>
                    <td className="py-3 font-medium text-gray-900">{col.name}</td>
                    <td className="py-3 text-right font-semibold text-[#ef4e50]">{col._count.collectionVideos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Custom Report Builder */}
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Report Builder</h3>
        <p className="text-gray-600 mb-4">
          Create custom reports with specific metrics, date ranges, and filters
        </p>
        <button className="px-6 py-3 bg-[#ef4e50] text-white rounded-lg hover:bg-[#c03233] transition-colors font-medium">
          Build Custom Report
        </button>
      </div>
    </div>
  )
}
