import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - List all families for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)

    const families = await prisma.family.findMany({
      where: {
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
          select: {
            id: true,
            name: true,
            age: true,
            avatarUrl: true,
            isActive: true
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
        },
        _count: {
          select: {
            childProfiles: true,
            familyMembers: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ families })
  } catch (error) {
    console.error("Error fetching families:", error)
    
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

// POST - Create a new family
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    // Validate input
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: "Family name is required" },
        { status: 400 }
      )
    }

    if (body.name.trim().length < 2) {
      return NextResponse.json(
        { error: "Family name must be at least 2 characters long" },
        { status: 400 }
      )
    }

    // Create family
    const family = await prisma.family.create({
      data: {
        name: body.name.trim(),
        createdBy: user.id,
        settings: body.settings || {}
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({ family }, { status: 201 })
  } catch (error) {
    console.error("Error creating family:", error)
    
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

