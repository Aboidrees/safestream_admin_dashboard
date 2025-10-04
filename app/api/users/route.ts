import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)

    // Get all users with their family count (excluding deleted users)
    const users = await prisma.user.findMany({
      where: {
        isDeleted: false // Only show non-deleted users
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        avatar: true,
        isActive: true,
        isDeleted: true,
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
      role: 'user', // All users in this table are regular users
      createdAt: u.createdAt.toISOString(),
      isActive: u.isActive,
      isDeleted: u.isDeleted,
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
