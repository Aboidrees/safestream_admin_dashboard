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

    // Get family details
    const family = await prisma.family.findUnique({
      where: { id: familyId },
      include: {
        creator: {
          select: {
            name: true,
            email: true
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

    if (!family) {
      return NextResponse.json(
        { error: "Family not found" },
        { status: 404 }
      )
    }

    // Transform the data
    const formattedFamily = {
      id: family.id,
      name: family.name,
      createdAt: family.createdAt.toISOString(),
      parentName: family.creator.name || 'Unknown',
      parentEmail: family.creator.email,
      childrenCount: family._count.childProfiles,
      membersCount: family._count.familyMembers
    }

    return NextResponse.json({ family: formattedFamily })
  } catch (error) {
    console.error("Error fetching family:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
