import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

// GET - List videos in a collection
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: collectionId } = await params

    const collectionVideos = await prisma.collectionVideo.findMany({
      where: { collectionId },
      include: {
        video: true
      },
      orderBy: { orderIndex: 'asc' }
    })

    return NextResponse.json({ videos: collectionVideos.map(cv => ({ ...cv.video, orderIndex: cv.orderIndex })) })
  } catch (error: unknown) {
    console.error("Error fetching collection videos:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

// POST - Add a video to a collection
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: collectionId } = await params
    const body = await req.json()

    const { videoId, orderIndex } = body

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 })
    }

    // Check video exists
    const video = await prisma.video.findUnique({ where: { id: videoId } })
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Check collection exists
    const collection = await prisma.collection.findUnique({ where: { id: collectionId } })
    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    // Check not already in collection
    const existing = await prisma.collectionVideo.findUnique({
      where: { collectionId_videoId: { collectionId, videoId } }
    })
    if (existing) {
      return NextResponse.json({ error: "Video is already in this collection" }, { status: 409 })
    }

    // Determine orderIndex if not provided
    let finalOrderIndex = orderIndex
    if (finalOrderIndex === undefined || finalOrderIndex === null) {
      const maxOrder = await prisma.collectionVideo.aggregate({
        where: { collectionId },
        _max: { orderIndex: true }
      })
      finalOrderIndex = (maxOrder._max.orderIndex ?? -1) + 1
    }

    const collectionVideo = await prisma.collectionVideo.create({
      data: { collectionId, videoId, orderIndex: finalOrderIndex },
      include: { video: true }
    })

    return NextResponse.json({ collectionVideo }, { status: 201 })
  } catch (error: unknown) {
    console.error("Error adding video to collection:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

// DELETE - Remove a video from a collection (pass videoId in body or query)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: collectionId } = await params
    const { searchParams } = new URL(req.url)
    let videoId = searchParams.get('videoId')

    if (!videoId) {
      const body = await req.json().catch(() => ({}))
      videoId = body.videoId
    }

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 })
    }

    await prisma.collectionVideo.delete({
      where: { collectionId_videoId: { collectionId, videoId } }
    })

    return NextResponse.json({ message: "Video removed from collection successfully" })
  } catch (error: unknown) {
    console.error("Error removing video from collection:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}
