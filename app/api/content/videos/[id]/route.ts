import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req)
    const { id: videoId } = await params
    const body = await req.json()

    const { title, description, channelName, ageRating, tags } = body

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        title: title || undefined,
        description: description !== undefined ? description : undefined,
        channelName: channelName !== undefined ? channelName : undefined,
        ageRating: ageRating !== undefined ? ageRating : undefined,
        tags: tags !== undefined ? tags : undefined,
      }
    })

    return NextResponse.json({ video })
  } catch (error: unknown) {
    console.error("Error updating video:", error)
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
    await requireAdmin(req)
    const { id: videoId } = await params

    await prisma.video.delete({
      where: { id: videoId }
    })

    return NextResponse.json({ message: "Video deleted successfully" })
  } catch (error: unknown) {
    console.error("Error deleting video:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}
