import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: collectionId } = await params

    // Get videos in this collection
    const collectionVideos = await prisma.collectionVideo.findMany({
      where: { collectionId: collectionId },
      include: {
        video: {
          select: {
            id: true,
            youtubeId: true,
            title: true,
            description: true,
            duration: true,
            thumbnailUrl: true,
            channelName: true,
            ageRating: true,
            tags: true,
            isApproved: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        orderIndex: 'asc'
      }
    })

    // Transform the data to match the expected format
    const formattedVideos = collectionVideos.map(cv => ({
      id: cv.video.id,
      youtubeId: cv.video.youtubeId,
      title: cv.video.title,
      description: cv.video.description,
      duration: cv.video.duration || 0,
      thumbnailUrl: cv.video.thumbnailUrl,
      channelName: cv.video.channelName,
      ageRating: cv.video.ageRating,
      tags: cv.video.tags,
      isApproved: cv.video.isApproved,
      createdAt: cv.video.createdAt.toISOString(),
      orderIndex: cv.orderIndex
    }))

    return NextResponse.json({ videos: formattedVideos })
  } catch (error) {
    console.error("Error fetching collection videos:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
