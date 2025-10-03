import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"
import { revokeAllUserTokens } from "@/lib/jwt-enhanced"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req)

    const { id: userId } = await params
    const { action } = await req.json() // 'ban' or 'unban'

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        admins: {
          select: { role: true, isActive: true }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent banning super admin users
    const isSuperAdmin = targetUser.admins.some(admin => admin.role === 'SUPER_ADMIN')
    if (isSuperAdmin) {
      return NextResponse.json(
        { error: "Cannot ban super admin users" },
        { status: 403 }
      )
    }

    if (action === 'ban') {
      // Revoke all user tokens
      await revokeAllUserTokens(userId)

      // Deactivate admin status if user is an admin
      if (targetUser.admins.length > 0) {
        await prisma.admin.updateMany({
          where: { userId: userId },
          data: { isActive: false }
        })
      }

      return NextResponse.json({ 
        message: "User banned successfully",
        action: "banned"
      })
    } else if (action === 'unban') {
      // Reactivate admin status if user was an admin
      if (targetUser.admins.length > 0) {
        await prisma.admin.updateMany({
          where: { userId: userId },
          data: { isActive: true }
        })
      }

      return NextResponse.json({ 
        message: "User unbanned successfully",
        action: "unbanned"
      })
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'ban' or 'unban'" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error managing user ban status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
