import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: categoryId } = await params
    const body = await req.json()

    const { name, description, color, icon, isActive } = body

    if (name !== undefined && (!name || typeof name !== 'string' || name.trim().length < 2)) {
      return NextResponse.json(
        { error: "Category name must be at least 2 characters" },
        { status: 400 }
      )
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: name?.trim() || undefined,
        description: description !== undefined ? description : undefined,
        color: color !== undefined ? color : undefined,
        icon: icon !== undefined ? icon : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      }
    })

    return NextResponse.json({ category })
  } catch (error: unknown) {
    console.error("Error updating category:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: categoryId } = await params

    // Soft-delete: set isActive = false so existing collections keep their category reference
    await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: false }
    })

    return NextResponse.json({ message: "Category deactivated successfully" })
  } catch (error: unknown) {
    console.error("Error deleting category:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}
