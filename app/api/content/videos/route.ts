import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    // Get all videos
    const videos = await prisma.video.findMany({
      include: {
        moderator: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
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
      isApproved: v.isApproved,
      moderationStatus: v.moderationStatus,
      moderatedBy: v.moderator?.name || null,
      moderatedAt: v.moderatedAt?.toISOString() || null,
      moderationNotes: v.moderationNotes || null,
      rejectionReason: v.rejectionReason || null,
      createdAt: v.createdAt.toISOString()
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error: unknown) {
    console.error("Error fetching videos:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()

    const { youtubeId, title, description, channelName, ageRating, tags } = body

    if (!youtubeId || !title) {
      return NextResponse.json(
        { error: "YouTube ID and title are required" },
        { status: 400 }
      )
    }

    // Check if video already exists
    const existingVideo = await prisma.video.findUnique({
      where: { youtubeId }
    })

    if (existingVideo) {
      return NextResponse.json(
        { error: "Video with this YouTube ID already exists" },
        { status: 400 }
      )
    }

    const video = await prisma.video.create({
      data: {
        youtubeId,
        title,
        description: description || null,
        channelName: channelName || null,
        ageRating: ageRating || null,
        tags: tags || [],
        moderationStatus: 'PENDING'
      }
    })

    return NextResponse.json({ video }, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating video:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}
