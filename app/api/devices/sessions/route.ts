import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, getAuthStatusCode } from "@/lib/auth-session"

export const runtime = 'nodejs'

// GET - List device sessions with optional filters
export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const childProfileId = searchParams.get('childProfileId') || undefined
    const isActive       = searchParams.get('isActive')
    const limit          = Math.min(parseInt(searchParams.get('limit') || '50'), 200)
    const page           = Math.max(parseInt(searchParams.get('page')  || '1'), 1)
    const skip           = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (childProfileId) where.childProfileId = childProfileId
    if (isActive !== null && isActive !== undefined) where.isActive = isActive === 'true'

    const [sessions, total] = await Promise.all([
      prisma.deviceSession.findMany({
        where,
        include: {
          childProfile: {
            select: {
              id: true,
              name: true,
              family: { select: { id: true, name: true } }
            }
          },
          _count: { select: { remoteCommands: true } }
        },
        orderBy: { lastSeenAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.deviceSession.count({ where })
    ])

    return NextResponse.json({
      sessions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}
