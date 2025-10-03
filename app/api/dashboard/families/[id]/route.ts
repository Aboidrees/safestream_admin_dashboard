import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - Get a single family by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const familyId = params.id

    const family = await prisma.family.findFirst({
      where: {
        id: familyId,
        OR: [
          { createdBy: user.id },
          { familyMembers: { some: { userId: user.id } } }
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
        childProfiles: {
          include: {
            watchHistory: {
              take: 5,
              orderBy: { watchedAt: 'desc' }
            },
            screenTime: {
              take: 7,
              orderBy: { date: 'desc' }
            }
          }
        },
        familyMembers: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!family) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ family })
  } catch (error) {
    console.error("Error fetching family:", error)
    
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

// PATCH - Update a family
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const familyId = params.id
    const body = await req.json()

    // Check if user has access to this family
    const existingFamily = await prisma.family.findFirst({
      where: {
        id: familyId,
        createdBy: user.id  // Only creator can update
      }
    })

    if (!existingFamily) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      )
    }

    // Validate input
    if (body.name !== undefined) {
      if (typeof body.name !== 'string' || body.name.trim().length < 2) {
        return NextResponse.json(
          { error: "Family name must be at least 2 characters long" },
          { status: 400 }
        )
      }
    }

    // Update family
    const updatedFamily = await prisma.family.update({
      where: { id: familyId },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.settings && { settings: body.settings })
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
        _count: {
          select: {
            childProfiles: true,
            familyMembers: true
          }
        }
      }
    })

    return NextResponse.json({ family: updatedFamily })
  } catch (error) {
    console.error("Error updating family:", error)
    
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

// DELETE - Delete a family
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const familyId = params.id

    // Check if user is the creator
    const family = await prisma.family.findFirst({
      where: {
        id: familyId,
        createdBy: user.id
      }
    })

    if (!family) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      )
    }

    // Delete family (cascade will handle related records)
    await prisma.family.delete({
      where: { id: familyId }
    })

    return NextResponse.json({ message: "Family deleted successfully" })
  } catch (error) {
    console.error("Error deleting family:", error)
    
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

