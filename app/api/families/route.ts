import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)

    // Get all families with related data
    const families = await prisma.family.findMany({
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const formattedFamilies = families.map(f => ({
      id: f.id,
      name: f.name,
      createdAt: f.createdAt.toISOString(),
      parentName: f.creator.name || 'Unknown',
      parentEmail: f.creator.email,
      childrenCount: f._count.childProfiles,
      membersCount: f._count.familyMembers
    }))

    return NextResponse.json({ families: formattedFamilies })
  } catch (error) {
    console.error("Error fetching families:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

