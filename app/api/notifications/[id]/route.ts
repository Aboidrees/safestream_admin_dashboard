import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireRole, getAuthStatusCode } from "@/lib/auth-session"

export const runtime = 'nodejs'

// GET - Get a single notification by ID
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: notificationId } = await params

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    })

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    return NextResponse.json({ notification })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}

// PATCH - Mark a notification as read/unread (ADMIN+)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN')
    const { id: notificationId } = await params
    const body = await req.json()

    if (typeof body.isRead !== 'boolean') {
      return NextResponse.json(
        { error: "isRead (boolean) is required" },
        { status: 400 }
      )
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: body.isRead,
        readAt: body.isRead ? new Date() : null
      }
    })

    return NextResponse.json({ notification })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}

// DELETE - Delete a notification (ADMIN+)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN')
    const { id: notificationId } = await params

    await prisma.notification.delete({ where: { id: notificationId } })

    return NextResponse.json({ message: "Notification deleted successfully" })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}
