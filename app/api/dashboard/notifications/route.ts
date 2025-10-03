import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - Get notifications for authenticated user
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { searchParams } = new URL(req.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      userId: user.id
    }

    if (unreadOnly) {
      where.isRead = false
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: {
          userId: user.id,
          isRead: false
        }
      })
    ])

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      unreadCount
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new notification
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    // Validate required fields
    if (!body.type || !['SCREEN_TIME_LIMIT', 'CONTENT_RESTRICTION', 'DEVICE_PAIRING', 'FAMILY_INVITE', 'SYSTEM_UPDATE', 'CUSTOM'].includes(body.type)) {
      return NextResponse.json(
        { error: "Valid notification type is required" },
        { status: 400 }
      )
    }

    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: "Notification title is required" },
        { status: 400 }
      )
    }

    if (!body.message || typeof body.message !== 'string') {
      return NextResponse.json(
        { error: "Notification message is required" },
        { status: 400 }
      )
    }

    // Create notification
    const notification = await prisma.notification.create({
      data: {
        userId: user.id,
        type: body.type,
        title: body.title.trim(),
        message: body.message.trim(),
        metadata: body.metadata || {},
        isRead: false
      }
    })

    // TODO: Send real-time notification via WebSocket
    // TODO: Send push notification to user's devices

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error("Error creating notification:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Mark all notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth(req)

    // Mark all unread notifications as read
    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false
      },
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return NextResponse.json({
      message: "All notifications marked as read"
    })
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

