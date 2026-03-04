import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, getAuthStatusCode } from "@/lib/auth-session"
import { AdminRole } from "../../../../prisma/generated/prisma/client"

export const runtime = 'nodejs'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentAdmin = await requireRole('SUPER_ADMIN') // only SUPER_ADMINs can update admin accounts
    const { id: adminId } = await params
    const body = await req.json()

    const { name, role, isActive, password } = body

    // Validate role if provided
    if (role !== undefined) {
      const normalizedRole = (role as string).toUpperCase() as AdminRole
      if (!Object.values(AdminRole).includes(normalizedRole)) {
        return NextResponse.json(
          { error: `Invalid role. Must be one of: ${Object.values(AdminRole).join(', ')}` },
          { status: 400 }
        )
      }
    }

    const updateData: Record<string, unknown> = {}
    if (name !== undefined) updateData.name = name.trim()
    if (role !== undefined) updateData.role = (role as string).toUpperCase() as AdminRole
    if (isActive !== undefined) updateData.isActive = isActive

    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        )
      }
      const bcrypt = await import('bcryptjs')
      updateData.password = await bcrypt.hash(password, 12)
    }

    const admin = await prisma.admin.update({
      where: { id: adminId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true
      }
    })

    return NextResponse.json({
      admin: {
        ...admin,
        createdAt: admin.createdAt.toISOString(),
        lastLogin: admin.lastLogin?.toISOString() || null
      }
    })
  } catch (error: unknown) {
    console.error("Error updating admin:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: getAuthStatusCode(error) }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentAdmin = await requireRole('SUPER_ADMIN') // only SUPER_ADMINs can deactivate admins
    const { id: adminId } = await params

    // Prevent self-deactivation
    if (currentAdmin.id === adminId) {
      return NextResponse.json(
        { error: "You cannot deactivate your own account" },
        { status: 400 }
      )
    }

    // Soft-delete: set isActive = false to preserve audit history
    await prisma.admin.update({
      where: { id: adminId },
      data: { isActive: false }
    })

    return NextResponse.json({ message: "Admin account deactivated successfully" })
  } catch (error: unknown) {
    console.error("Error deactivating admin:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: getAuthStatusCode(error) }
    )
  }
}
