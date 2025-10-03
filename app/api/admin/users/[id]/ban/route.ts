import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthenticatedUser } from "@/lib/auth-utils"
import { revokeAllUserTokens } from "@/lib/jwt-enhanced"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getAuthenticatedUser(req)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const { id: userId } = params

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        admins: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent banning super admins
    if (targetUser.admins.length > 0 && targetUser.admins[0].role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: "Cannot ban super admin users" },
        { status: 403 }
      )
    }

    // Deactivate admin if exists
    if (targetUser.admins.length > 0) {
      await prisma.admin.update({
        where: { id: targetUser.admins[0].id },
        data: { isActive: false }
      })
    }

    // Revoke all user tokens
    await revokeAllUserTokens(userId)

    return NextResponse.json({ 
      message: "User banned successfully",
      userId 
    })
  } catch (error) {
    console.error("Error banning user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

