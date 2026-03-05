import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, getAuthStatusCode } from "@/lib/auth-session"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: familyId } = await params

    const familyMembers = await prisma.familyMember.findMany({
      where: { familyId },
      select: { userId: true }
    })
    const familyMemberIds = familyMembers.map(fm => fm.userId)

    const collections = await prisma.collection.findMany({
      where: {
        OR: [
          { isPublic: true },
          { createdByUserId: { in: familyMemberIds } }
        ]
      },
      include: {
        creatorAdmin: { select: { name: true, email: true } },
        creatorUser: { select: { name: true, email: true } },
        _count: { select: { collectionVideos: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formattedCollections = collections.map(c => ({
      id: c.id,
      name: c.name,
      category: c.description || 'General',
      ageRating: c.ageRating,
      videoCount: c._count.collectionVideos,
      isPublic: c.isPublic,
      isMandatory: c.isMandatory,
      creatorName: c.creatorAdmin?.name ?? c.creatorUser?.name ?? 'Unknown',
      createdAt: c.createdAt.toISOString()
    }))

    return NextResponse.json({ collections: formattedCollections })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: getAuthStatusCode(error) }
    )
  }
}
