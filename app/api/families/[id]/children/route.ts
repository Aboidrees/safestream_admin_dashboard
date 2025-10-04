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

    // Get child profiles for this family
    const children = await prisma.childProfile.findMany({
      where: { familyId: familyId },
      include: {
        family: {
          include: {
            creator: {
              select: {
                name: true
              }
            }
          }
        },
        screenTime: {
          select: {
            dailyLimit: true
          },
          orderBy: {
            date: 'desc'
          },
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const formattedChildren = children.map(child => ({
      id: child.id,
      name: child.name,
      age: child.age || 0,
      familyName: child.family.name,
      parentName: child.family.creator.name || 'Unknown',
      createdAt: child.createdAt.toISOString(),
      screenTimeLimit: child.screenTime[0]?.dailyLimit || 60,
      qrCode: child.qrCode || 'N/A',
      isActive: child.isActive,
      avatarUrl: child.avatarUrl
    }))

    return NextResponse.json({ children: formattedChildren })
  } catch (error) {
    console.error("Error fetching family children:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
