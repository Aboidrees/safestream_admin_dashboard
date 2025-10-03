import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)

    // Get videos that need moderation (not approved)
    const videos = await prisma.video.findMany({
      where: {
        moderationStatus: {
          in: ['PENDING', 'UNDER_REVIEW', 'FLAGGED']
        }
      },
      include: {
        moderator: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: [
        { moderationStatus: 'asc' }, // PENDING first, then UNDER_REVIEW, then FLAGGED
        { createdAt: 'asc' } // Oldest first within each status
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
      moderatedBy: v.moderator?.name || null,
      moderatedAt: v.moderatedAt?.toISOString() || null,
      moderationNotes: v.moderationNotes || null,
      rejectionReason: v.rejectionReason || null,
      createdAt: v.createdAt.toISOString()
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error: unknown) {
    console.error("Error fetching videos for moderation:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}
