import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireRole, getAuthStatusCode } from "@/lib/auth-session"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: collectionId } = await params

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        category: {
          select: { id: true, name: true, color: true, icon: true }
        },
        collectionVideos: {
          include: {
            video: true
          },
          orderBy: { orderIndex: 'asc' }
        },
        _count: {
          select: { collectionVideos: true }
        }
      }
    })

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 })
    }

    return NextResponse.json({ collection })
  } catch (error: unknown) {
    console.error("Error fetching collection:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: collectionId } = await params
    const body = await req.json()

    const { name, description, categoryId, ageRating, isPublic, isPlatform, isMandatory } = body

    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        ageRating: ageRating !== undefined ? ageRating : undefined,
        isPublic: isPublic !== undefined ? isPublic : undefined,
        isPlatform: isPlatform !== undefined ? isPlatform : undefined,
        isMandatory: isMandatory !== undefined ? isMandatory : undefined,
      }
    })

    return NextResponse.json({ collection })
  } catch (error: unknown) {
    console.error("Error updating collection:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN') // ADMIN or SUPER_ADMIN can delete collections
    const { id: collectionId } = await params

    await prisma.collection.delete({
      where: { id: collectionId }
    })

    return NextResponse.json({ message: "Collection deleted successfully" })
  } catch (error: unknown) {
    console.error("Error deleting collection:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: getAuthStatusCode(error) }
    )
  }
}
