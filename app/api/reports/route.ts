import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await requireAdmin()

    const now = new Date()
    const today = new Date(now)
    today.setHours(0, 0, 0, 0)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    const [
      // User Activity
      totalUsers,
      newUsersThisPeriod,
      newUsersPrevPeriod,
      activeSessions,
      // Content Performance
      totalVideos,
      approvedVideos,
      pendingVideos,
      rejectedVideos,
      videosWatchedThisPeriod,
      topCollections,
      // Family Analytics
      totalFamilies,
      newFamiliesThisPeriod,
      newFamiliesPrevPeriod,
      avgChildrenResult,
      // Screen Time
      screenTimeThisPeriod,
      screenTimeCompletedProfiles,
      // Safety / Moderation
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
      prisma.video.count({ where: { moderationStatus: 'REJECTED' } }),
      prisma.watchHistory.count({ where: { watchedAt: { gte: thirtyDaysAgo } } }),
      prisma.collection.findMany({
        take: 5,
        orderBy: { collectionVideos: { _count: 'desc' } },
        select: {
          id: true,
          name: true,
          _count: { select: { collectionVideos: true } }
        }
      }),
      prisma.family.count(),
      prisma.family.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.family.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
      prisma.childProfile.aggregate({ _avg: { age: true } }),
      prisma.screenTime.aggregate({
        where: { date: { gte: thirtyDaysAgo } },
        _avg: { totalMinutes: true },
        _sum: { totalMinutes: true },
        _count: { id: true }
      }),
      prisma.screenTime.count({
        where: {
          date: { gte: thirtyDaysAgo },
          totalMinutes: { gt: 0 }
        }
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

    return NextResponse.json({
      userActivity: {
        totalUsers,
        newUsersThisPeriod,
        userGrowth: calcGrowth(newUsersThisPeriod, newUsersPrevPeriod),
        activeSessions24h: activeSessions,
        period: '30 days'
      },
      contentPerformance: {
        totalVideos,
        approvedVideos,
        pendingVideos,
        rejectedVideos,
        videosWatchedThisPeriod,
        approvalRate: totalVideos > 0 ? Math.round((approvedVideos / totalVideos) * 100) : 0,
        topCollections: topCollections.map(c => ({
          id: c.id,
          name: c.name,
          videoCount: c._count.collectionVideos
        })),
        period: '30 days'
      },
      familyAnalytics: {
        totalFamilies,
        newFamiliesThisPeriod,
        familyGrowth: calcGrowth(newFamiliesThisPeriod, newFamiliesPrevPeriod),
        avgChildAge: Math.round(avgChildrenResult._avg.age || 0),
        period: '30 days'
      },
      screenTime: {
        avgDailyMinutes: Math.round(screenTimeThisPeriod._avg.totalMinutes || 0),
        totalMinutesThisPeriod: screenTimeThisPeriod._sum.totalMinutes || 0,
        activeProfiles: screenTimeCompletedProfiles,
        period: '30 days'
      },
      safety: {
        flaggedVideos,
        moderatedThisPeriod,
        pendingReview: pendingVideos,
        period: '30 days'
      }
    })
  } catch (error) {
    console.error("Error fetching reports:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
