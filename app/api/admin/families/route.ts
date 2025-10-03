import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

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
            collections: true
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
      collectionsCount: f._count.collections
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

