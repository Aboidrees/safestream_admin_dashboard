import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - Get a single collection by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const collectionId = params.id

    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        OR: [
          { createdBy: user.id },
          { isPublic: true }
        ]
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        videos: {
          include: {
            _count: {
              select: {
                watchHistory: true,
                favorites: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ collection })
  } catch (error) {
    console.error("Error fetching collection:", error)
    
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

// PATCH - Update a collection
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const collectionId = params.id
    const body = await req.json()

    // Check if user owns this collection
    const existingCollection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        createdBy: user.id
      }
    })

    if (!existingCollection) {
      return NextResponse.json(
        { error: "Collection not found or access denied" },
        { status: 404 }
      )
    }

    // Validate input
    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length < 2)) {
      return NextResponse.json(
        { error: "Collection name must be at least 2 characters long" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (body.name) updateData.name = body.name.trim()
    if (body.description !== undefined) updateData.description = body.description?.trim() || null
    if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl
    if (body.isPublic !== undefined) updateData.isPublic = body.isPublic
    if (body.isMandatory !== undefined) updateData.isMandatory = body.isMandatory
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.ageRating !== undefined) updateData.ageRating = body.ageRating
    if (body.category !== undefined) updateData.category = body.category

    // Update collection
    const updatedCollection = await prisma.collection.update({
      where: { id: collectionId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        _count: {
          select: {
            videos: true
          }
        }
      }
    })

    return NextResponse.json({ collection: updatedCollection })
  } catch (error) {
    console.error("Error updating collection:", error)
    
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

// DELETE - Delete a collection
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const collectionId = params.id

    // Check if user owns this collection
    const collection = await prisma.collection.findFirst({
      where: {
        id: collectionId,
        createdBy: user.id
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found or access denied" },
        { status: 404 }
      )
    }

    // Delete collection (cascade will handle related records)
    await prisma.collection.delete({
      where: { id: collectionId }
    })

    return NextResponse.json({ message: "Collection deleted successfully" })
  } catch (error) {
    console.error("Error deleting collection:", error)
    
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

