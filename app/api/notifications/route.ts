import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireRole, getAuthStatusCode } from "@/lib/auth-session"

export const runtime = 'nodejs'

// GET - List all notifications with optional filters
export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const { searchParams } = new URL(req.url)
    const userId   = searchParams.get('userId')   || undefined
    const type     = searchParams.get('type')     || undefined
    const isRead   = searchParams.get('isRead')
    const limit    = Math.min(parseInt(searchParams.get('limit')  || '50'), 200)
    const page     = Math.max(parseInt(searchParams.get('page')   || '1'), 1)
    const skip     = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (userId)           where.userId = userId
    if (type)             where.type   = type
    if (isRead !== null && isRead !== undefined) where.isRead = isRead === 'true'

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { sentAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ])

    return NextResponse.json({
      notifications,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}

// POST - Create a platform notification for a specific user (ADMIN+)
export async function POST(req: NextRequest) {
  try {
    await requireRole('ADMIN')

    const body = await req.json()
    const { userId, type, title, message, data } = body

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "userId, type, title, and message are required" },
        { status: 400 }
      )
    }

    const validTypes = [
      'DEVICE_JOINED', 'TIME_LIMIT_EXCEEDED', 'CONTENT_COMPLETED', 'CONTENT_SKIPPED',
      'SCREEN_TIME_WARNING', 'NEW_COLLECTION_ADDED', 'REMOTE_COMMAND_RECEIVED', 'TIME_REQUEST'
    ]
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify the target user exists
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ error: "Target user not found" }, { status: 404 })
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title: title.trim(),
        message: message.trim(),
        data: data || {},
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json({ error: errorMessage }, { status: getAuthStatusCode(error) })
  }
}
