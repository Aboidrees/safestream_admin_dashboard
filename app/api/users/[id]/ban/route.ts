import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

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
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if user is an admin (separate table)
    const adminRecord = await prisma.admin.findFirst({
      where: { email: targetUser.email }
    })

    // Prevent banning super admin users
    if (adminRecord && adminRecord.role === 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: "Cannot ban super admin users" },
        { status: 403 }
      )
    }

    if (action === 'ban') {
      // Update user status to inactive
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: false }
      })

      // Deactivate admin status if user is an admin
      if (adminRecord) {
        await prisma.admin.update({
          where: { id: adminRecord.id },
          data: { isActive: false }
        })
      }

      return NextResponse.json({ 
        message: "User banned successfully",
        action: "banned"
      })
    } else if (action === 'unban') {
      // Update user status to active
      await prisma.user.update({
        where: { id: userId },
        data: { isActive: true }
      })

      // Reactivate admin status if user was an admin
      if (adminRecord) {
        await prisma.admin.update({
          where: { id: adminRecord.id },
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
