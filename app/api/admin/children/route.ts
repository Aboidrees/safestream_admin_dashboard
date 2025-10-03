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

    // Get all child profiles with related data
    const children = await prisma.childProfile.findMany({
      include: {
        family: {
          include: {
            creator: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const formattedChildren = children.map(c => {
      const screenTimeLimits = c.screenTimeLimits as { daily?: number } || {}
      
      return {
        id: c.id,
        name: c.name,
        age: c.age,
        familyName: c.family.name,
        parentName: c.family.creator.name || 'Unknown',
        createdAt: c.createdAt.toISOString(),
        screenTimeLimit: screenTimeLimits.daily || 0,
        qrCode: c.qrCode
      }
    })

    return NextResponse.json({ children: formattedChildren })
  } catch (error) {
    console.error("Error fetching children:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

