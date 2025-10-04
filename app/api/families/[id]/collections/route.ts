import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: familyId } = await params

    // Get collections that are either public or created by family members
    const familyMembers = await prisma.familyMember.findMany({
      where: { familyId: familyId },
      select: { userId: true }
    })

    const familyMemberIds = familyMembers.map(fm => fm.userId)

    // Get collections that are public or created by family members
    const collections = await prisma.collection.findMany({
      where: {
        OR: [
          { isPublic: true },
          { createdBy: { in: familyMemberIds } }
        ]
      },
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
    console.error("Error fetching family collections:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
