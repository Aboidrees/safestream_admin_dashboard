import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireRole, getAuthStatusCode } from "@/lib/auth-session"

export const runtime = 'nodejs'

// GET - Get a device session by ID with its command history
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: sessionId } = await params

    const session = await prisma.deviceSession.findUnique({
      where: { id: sessionId },
      include: {
        childProfile: {
          select: {
            id: true,
            name: true,
            family: { select: { id: true, name: true } }
          }
        },
        remoteCommands: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    })

    if (!session) {
      return NextResponse.json({ error: "Device session not found" }, { status: 404 })
    }

    return NextResponse.json({ session })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}

// DELETE - Revoke (deactivate) a device session (ADMIN+)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN')
    const { id: sessionId } = await params

    const session = await prisma.deviceSession.findUnique({
      where: { id: sessionId },
      select: { id: true, isActive: true }
    })

    if (!session) {
      return NextResponse.json({ error: "Device session not found" }, { status: 404 })
    }

    // Soft-revoke: set isActive = false
    await prisma.deviceSession.update({
      where: { id: sessionId },
      data: { isActive: false }
    })

    // Expire any pending commands for this session
    await prisma.remoteCommand.updateMany({
      where: { deviceSessionId: sessionId, status: 'PENDING' },
      data: { status: 'EXPIRED' }
    })

    return NextResponse.json({ message: "Device session revoked successfully" })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}
