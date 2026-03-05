import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireRole, getAuthStatusCode } from "@/lib/auth-session"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: videoId } = await params

    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include: {
        collectionVideos: {
          include: {
            collection: {
              select: { id: true, name: true }
            }
          }
        }
      }
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json({ video })
  } catch (error: unknown) {
    console.error("Error fetching video:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: getAuthStatusCode(error) }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: videoId } = await params
    const body = await req.json()

    const { title, description, thumbnailUrl, channelName, ageRating, tags } = body

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        thumbnailUrl: thumbnailUrl !== undefined ? thumbnailUrl : undefined,
        channelName: channelName !== undefined ? channelName : undefined,
        ageRating: ageRating !== undefined ? ageRating : undefined,
        tags: tags !== undefined ? tags : undefined,
      }
    })

    return NextResponse.json({ video })
  } catch (error: unknown) {
    console.error("Error updating video:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: getAuthStatusCode(error) }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN') // ADMIN or SUPER_ADMIN can delete videos
    const { id: videoId } = await params

    await prisma.video.delete({
      where: { id: videoId }
    })

    return NextResponse.json({ message: "Video deleted successfully" })
  } catch (error: unknown) {
    console.error("Error deleting video:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: getAuthStatusCode(error) }
    )
  }
}
