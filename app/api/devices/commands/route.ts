import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, getAuthStatusCode } from "@/lib/auth-session"

export const runtime = 'nodejs'

// GET - List remote commands with optional filters
export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const deviceSessionId = searchParams.get('deviceSessionId') || undefined
    const status          = searchParams.get('status')           || undefined
    const commandType     = searchParams.get('commandType')      || undefined
    const limit           = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const page            = Math.max(parseInt(searchParams.get('page')  || '1'), 1)
    const skip            = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (deviceSessionId) where.deviceSessionId = deviceSessionId
    if (status)          where.status          = status
    if (commandType)     where.commandType     = commandType

    const [commands, total] = await Promise.all([
      prisma.remoteCommand.findMany({
        where,
        include: {
          deviceSession: {
            select: {
              id: true,
              deviceName: true,
              platform: true,
              childProfile: { select: { id: true, name: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.remoteCommand.count({ where })
    ])

    return NextResponse.json({
      commands,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}
