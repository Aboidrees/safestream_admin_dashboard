import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)

    // Get all users with their admin status and family count
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        avatar: true,
        admins: {
          select: {
            role: true,
            isActive: true,
          },
        },
        _count: {
          select: {
            createdFamilies: true,
            familyMembers: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const formattedUsers = users.map(u => ({
      id: u.id,
      name: u.name || 'Unknown',
      email: u.email,
      role: u.admins?.[0]?.role || 'user',
      createdAt: u.createdAt.toISOString(),
      isActive: u.admins?.[0]?.isActive ?? true,
      familyCount: u._count.createdFamilies + u._count.familyMembers
    }))

    return NextResponse.json({ users: formattedUsers })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
