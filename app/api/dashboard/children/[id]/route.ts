import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { randomBytes } from 'crypto'

// GET - Get a single child profile
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const childId = params.id

    const child = await prisma.childProfile.findFirst({
      where: {
        id: childId,
        family: {
          OR: [
            { createdBy: user.id },
            { familyMembers: { some: { userId: user.id } } }
          ]
        }
      },
      include: {
        family: {
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
            video: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                duration: true
              }
            }
          }
        },
        favorites: {
          include: {
            video: {
              select: {
                id: true,
                title: true,
                thumbnailUrl: true,
                duration: true
              }
            }
          }
        },
        screenTime: {
          take: 30,
          orderBy: { date: 'desc' }
        }
      }
    })

    if (!child) {
      return NextResponse.json(
        { error: "Child profile not found or access denied" },
        { status: 404 }
      )
    }

    return NextResponse.json({ child })
  } catch (error) {
    console.error("Error fetching child profile:", error)
    
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

// PATCH - Update a child profile
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const childId = params.id
    const body = await req.json()

    // Check if user has access to this child's family
    const existingChild = await prisma.childProfile.findFirst({
      where: {
        id: childId,
        family: {
          OR: [
            { createdBy: user.id },
            { familyMembers: { some: { userId: user.id, role: 'PARENT' } } }
          ]
        }
      }
    })

    if (!existingChild) {
      return NextResponse.json(
        { error: "Child profile not found or access denied" },
        { status: 404 }
      )
    }

    // Validate input
    if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length < 2)) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long" },
        { status: 400 }
      )
    }

    if (body.age !== undefined && (typeof body.age !== 'number' || body.age < 0 || body.age > 18)) {
      return NextResponse.json(
        { error: "Age must be between 0 and 18" },
        { status: 400 }
      )
    }

    // Build update data
    const updateData: any = {}
    if (body.name) updateData.name = body.name.trim()
    if (body.age !== undefined) updateData.age = body.age
    if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl
    if (body.isActive !== undefined) updateData.isActive = body.isActive
    if (body.contentRestrictions) updateData.contentRestrictions = body.contentRestrictions
    if (body.screenTimeLimits) updateData.screenTimeLimits = body.screenTimeLimits
    if (body.theme) updateData.theme = body.theme
    if (body.language) updateData.language = body.language

    // Update child profile
    const updatedChild = await prisma.childProfile.update({
      where: { id: childId },
      data: updateData,
      include: {
        family: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ child: updatedChild })
  } catch (error) {
    console.error("Error updating child profile:", error)
    
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

// DELETE - Delete a child profile
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const childId = params.id

    // Check if user is the family creator
    const child = await prisma.childProfile.findFirst({
      where: {
        id: childId,
        family: {
          createdBy: user.id
        }
      }
    })

    if (!child) {
      return NextResponse.json(
        { error: "Child profile not found or access denied" },
        { status: 404 }
      )
    }

    // Delete child profile (cascade will handle related records)
    await prisma.childProfile.delete({
      where: { id: childId }
    })

    return NextResponse.json({ message: "Child profile deleted successfully" })
  } catch (error) {
    console.error("Error deleting child profile:", error)
    
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

