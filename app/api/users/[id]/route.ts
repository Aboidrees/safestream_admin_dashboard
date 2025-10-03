import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

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
    })

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Prevent deleting super admin users
    const adminRecord = await prisma.admin.findFirst({
      where: { email: targetUser.email }
    })

    const isSuperAdmin = adminRecord && adminRecord.role === 'SUPER_ADMIN'
    if (isSuperAdmin) {
      return NextResponse.json(
        { error: "Cannot delete super admin users" },
        { status: 403 }
      )
    }

    // Soft delete user (set isDeleted to true)
    await prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true }
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
