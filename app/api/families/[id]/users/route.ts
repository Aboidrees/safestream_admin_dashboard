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

    // Get family members (users associated with this family, excluding deleted users)
    const familyMembers = await prisma.familyMember.findMany({
      where: {
        familyId: familyId,
        user: {
          isDeleted: false // Only include non-deleted users
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            avatar: true,
            isActive: true,
            isDeleted: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const formattedUsers = familyMembers.map((fm) => ({
      id: fm.user.id,
      name: fm.user.name || 'Unknown',
      email: fm.user.email,
      role: fm.role,
      createdAt: fm.user.createdAt.toISOString(),
      isActive: fm.user.isActive,
      isDeleted: fm.user.isDeleted,
      familyRole: fm.role,
      familyCount: 1 // This user is part of this family
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching family users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
