import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireRole, getAuthStatusCode } from "@/lib/auth-session"

export const runtime = 'nodejs'

// GET - Get a single remote command
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin()
    const { id: commandId } = await params

    const command = await prisma.remoteCommand.findUnique({
      where: { id: commandId },
      include: {
        deviceSession: {
          select: {
            id: true,
            deviceName: true,
            platform: true,
            childProfile: { select: { id: true, name: true } }
          }
        }
      }
    })

    if (!command) {
      return NextResponse.json({ error: "Remote command not found" }, { status: 404 })
    }

    return NextResponse.json({ command })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}

// PATCH - Cancel (expire) a pending command (ADMIN+)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireRole('ADMIN')
    const { id: commandId } = await params
    const body = await req.json()

    const command = await prisma.remoteCommand.findUnique({
      where: { id: commandId },
      select: { id: true, status: true }
    })

    if (!command) {
      return NextResponse.json({ error: "Remote command not found" }, { status: 404 })
    }

    // Only PENDING commands can be cancelled
    if (command.status !== 'PENDING') {
      return NextResponse.json(
        { error: `Cannot cancel a command with status ${command.status}` },
        { status: 400 }
      )
    }

    const updated = await prisma.remoteCommand.update({
      where: { id: commandId },
      data: {
        status: 'EXPIRED',
        ...(body.payload !== undefined ? { payload: body.payload } : {})
      }
    })

    return NextResponse.json({ command: updated })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}
