import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()
    // Get all platform collections
    const collections = await prisma.collection.findMany({
      where: {
        isPlatform: true
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            color: true,
            icon: true
          }
        },
        _count: {
          select: {
            collectionVideos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedCollections = collections.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      category: c.category ? {
        id: c.category.id,
        name: c.category.name,
        color: c.category.color,
        icon: c.category.icon
      } : null,
      ageRating: c.ageRating,
      videoCount: c._count.collectionVideos,
      isPublic: c.isPublic,
      isPlatform: c.isPlatform,
      isMandatory: c.isMandatory,
      creatorName: c.creator.name || 'Unknown',
      createdAt: c.createdAt.toISOString()
    }))

    return NextResponse.json({ collections: formattedCollections })
  } catch (error: unknown) {
    console.error("Error fetching collections:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await req.json()

    const { name, description, categoryId, ageRating, isPublic, isPlatform, isMandatory } = body

    if (!name) {
      return NextResponse.json(
        { error: "Collection name is required" },
        { status: 400 }
      )
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        description: description || null,
        categoryId: categoryId || null,
        ageRating: ageRating || 0,
        isPublic: isPublic !== undefined ? isPublic : true,
        isPlatform: isPlatform !== undefined ? isPlatform : true,
        isMandatory: isMandatory !== undefined ? isMandatory : false,
        createdBy: user.id
      }
    })

    return NextResponse.json({ collection }, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating collection:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}
