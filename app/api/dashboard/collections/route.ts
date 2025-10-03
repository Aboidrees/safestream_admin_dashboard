import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - List all collections for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { searchParams } = new URL(req.url)
    const childId = searchParams.get('childId')

    // Build where clause
    const where: any = {
      createdBy: user.id
    }

    const collections = await prisma.collection.findMany({
      where,
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
          select: {
            id: true,
            title: true,
            description: true,
            thumbnailUrl: true,
            duration: true,
            youtubeId: true,
            isActive: true
          },
          where: {
            isActive: true
          },
          take: 10
        },
        _count: {
          select: {
            videos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ collections })
  } catch (error) {
    console.error("Error fetching collections:", error)
    
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

// POST - Create a new collection
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    // Validate input
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 }
      )
    }

    if (body.name.trim().length < 2) {
      return NextResponse.json(
        { error: "Collection name must be at least 2 characters long" },
        { status: 400 }
      )
    }

    // Create collection
    const collection = await prisma.collection.create({
      data: {
        name: body.name.trim(),
        description: body.description?.trim() || null,
        createdBy: user.id,
        thumbnailUrl: body.thumbnailUrl || null,
        isPublic: body.isPublic ?? false,
        isMandatory: body.isMandatory ?? false,
        tags: body.tags || [],
        ageRating: body.ageRating || null,
        category: body.category || null
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
            videos: true
          }
        }
      }
    })

    return NextResponse.json({ collection }, { status: 201 })
  } catch (error) {
    console.error("Error creating collection:", error)
    
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

