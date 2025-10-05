import {  NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function GET() {
  try {
    await requireAdmin()

    // Get all collections with related data
    const collections = await prisma.collection.findMany({
      include: {
        creator: {
          select: {
            name: true,
            email: true
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

    // Transform the data to match the expected format
    const formattedCollections = collections.map(c => ({
      id: c.id,
      name: c.name,
      category: c.description || 'General',
      ageRating: 0, // Default age rating
      videoCount: c._count.collectionVideos,
      isPublic: c.isPublic,
      isMandatory: false, // Default value
      creatorName: c.creator.name || 'Unknown',
      createdAt: c.createdAt.toISOString()
    }))

    return NextResponse.json({ collections: formattedCollections })
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

