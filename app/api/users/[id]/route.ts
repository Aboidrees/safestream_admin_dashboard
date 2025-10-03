import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"
import { revokeAllUserTokens } from "@/lib/jwt-enhanced"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req)

    const { id: userId } = await params

    // Check if user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        admins: {
          select: { role: true }
        }
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent deleting super admin users
    const isSuperAdmin = targetUser.admins.some(admin => admin.role === 'SUPER_ADMIN')
    if (isSuperAdmin) {
      return NextResponse.json(
        { error: "Cannot delete super admin users" },
        { status: 403 }
      )
    }

    // Revoke all user tokens before deletion
    await revokeAllUserTokens(userId)

    // Delete user (this will cascade to related records)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ 
      message: "User deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
