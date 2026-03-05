import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, getAuthStatusCode } from "@/lib/auth-session"

export async function GET() {
  try {
    await requireAdmin()

    const videos = await prisma.video.findMany({
      where: {
        moderationStatus: { in: ['PENDING', 'UNDER_REVIEW', 'FLAGGED'] }
      },
      include: {
        moderator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: [
        { moderationStatus: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    const formattedVideos = videos.map(v => ({
      id: v.id,
      youtubeId: v.youtubeId,
      title: v.title,
      description: v.description || '',
      thumbnailUrl: v.thumbnailUrl || '',
      duration: v.duration || 0,
      channelName: v.channelName || '',
      ageRating: v.ageRating || '',
      tags: v.tags,
      moderationStatus: v.moderationStatus,
      moderatedById: v.moderator?.id || null,
      moderatedByName: v.moderator?.name || null,
      moderatedAt: v.moderatedAt?.toISOString() || null,
      moderationNotes: v.moderationNotes || null,
      rejectionReason: v.rejectionReason || null,
      createdAt: v.createdAt.toISOString()
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error: unknown) {
    console.error("Error fetching videos for moderation:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: getAuthStatusCode(error) }
    )
  }
}
