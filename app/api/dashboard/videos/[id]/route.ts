import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - Get a single video by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const videoId = params.id

    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        collection: {
          OR: [
            { createdBy: user.id },
            { isPublic: true }
          ]
        }
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
            creator: {
              select: {
                id: true,
                name: true
              }
            }
          }
        },
        watchHistory: {
          take: 10,
          orderBy: { watchedAt: 'desc' },
          include: {
            childProfile: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        },
        favorites: {
          include: {
            childProfile: {
              select: {
                id: true,
                name: true,
                avatarUrl: true
              }
            }
          }
        }
      }
    })

    if (!video) {
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ video })
  } catch (error) {
    console.error("Error fetching video:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update a video
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const videoId = params.id
    const body = await req.json()

    // Check if user owns this video's collection
    const existingVideo = await prisma.video.findFirst({
      where: {
        id: videoId,
        collection: {
          createdBy: user.id
        }
      }
    })

    if (!existingVideo) {
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      )
    }

    // Validate input
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length < 2)) {
      return NextResponse.json(
        { error: "Video title must be at least 2 characters long" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (body.title) updateData.title = body.title.trim()
    if (body.description !== undefined) updateData.description = body.description?.trim() || null
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl
    if (body.duration !== undefined) updateData.duration = body.duration
    if (body.order !== undefined) updateData.order = body.order
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.isRestricted !== undefined) updateData.isRestricted = body.isRestricted
    if (body.ageRating !== undefined) updateData.ageRating = body.ageRating
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.category !== undefined) updateData.category = body.category

    // Update video
    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: updateData,
      include: {
        collection: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ video: updatedVideo })
  } catch (error) {
    console.error("Error updating video:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a video
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const videoId = params.id

    // Check if user owns this video's collection
    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        collection: {
          createdBy: user.id
        }
      }
    })

    if (!video) {
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      )
    }

    // Delete video (cascade will handle related records)
    await prisma.video.delete({
      where: { id: videoId }
    })

    return NextResponse.json({ message: "Video deleted successfully" })
  } catch (error) {
    console.error("Error deleting video:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

