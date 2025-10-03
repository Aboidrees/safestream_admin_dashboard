import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - List all videos for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { searchParams } = new URL(req.url)
    const collectionId = searchParams.get('collectionId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      collection: {
        createdBy: user.id
      }
    }

    if (collectionId) {
      where.collectionId = collectionId
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { hasSome: [search] } }
      ]
    }

    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        include: {
          collection: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              watchHistory: true,
              favorites: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.video.count({ where })
    ])

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error("Error fetching videos:", error)
    
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

// POST - Create a new video
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: "Video title is required" },
        { status: 400 }
      )
    }

    if (!body.collectionId) {
      return NextResponse.json(
        { error: "Collection ID is required" },
        { status: 400 }
      )
    }

    if (!body.youtubeId || !body.videoUrl) {
      return NextResponse.json(
        { error: "YouTube ID and video URL are required" },
        { status: 400 }
      )
    }

    // Verify user owns the collection
    const collection = await prisma.collection.findFirst({
      where: {
        id: body.collectionId,
        createdBy: user.id
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found or access denied" },
        { status: 404 }
      )
    }

    // Check if video with same YouTube ID already exists in collection
    const existingVideo = await prisma.video.findFirst({
      where: {
        collectionId: body.collectionId,
        youtubeId: body.youtubeId
      }
    })

    if (existingVideo) {
      return NextResponse.json(
        { error: "Video already exists in this collection" },
        { status: 400 }
      )
    }

    // Get the highest order number in the collection
    const lastVideo = await prisma.video.findFirst({
      where: { collectionId: body.collectionId },
      orderBy: { order: 'desc' }
    })

    const order = lastVideo ? lastVideo.order + 1 : 0

    // Create video
    const video = await prisma.video.create({
      data: {
        collectionId: body.collectionId,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        youtubeId: body.youtubeId,
        videoUrl: body.videoUrl,
        thumbnailUrl: body.thumbnailUrl || `https://img.youtube.com/vi/${body.youtubeId}/hqdefault.jpg`,
        duration: body.duration || 0,
        order,
        isActive: body.isActive ?? true,
        isRestricted: body.isRestricted ?? false,
        ageRating: body.ageRating || null,
        tags: body.tags || [],
        category: body.category || null
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ video }, { status: 201 })
  } catch (error) {
    console.error("Error creating video:", error)
    
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

