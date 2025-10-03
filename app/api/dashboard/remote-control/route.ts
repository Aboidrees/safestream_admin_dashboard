import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - Get remote commands for child profiles
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { searchParams } = new URL(req.url)
    const childId = searchParams.get('childId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Build where clause
    const where: any = {
      childProfile: {
        family: {
          OR: [
            { createdBy: user.id },
            { familyMembers: { some: { userId: user.id } } }
          ]
        }
      }
    }

    if (childId) {
      where.childProfileId = childId
    }

    if (status) {
      where.status = status
    }

    const commands = await prisma.remoteCommand.findMany({
      where,
      include: {
        childProfile: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            family: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json({ commands })
  } catch (error) {
    console.error("Error fetching remote commands:", error)
    
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

// POST - Send a remote command
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    // Validate required fields
    if (!body.childId) {
      return NextResponse.json(
        { error: "Child ID is required" },
        { status: 400 }
      )
    }

    if (!body.commandType || !['PAUSE', 'RESUME', 'LOCK_DEVICE', 'UNLOCK_DEVICE', 'LOGOUT', 'SWITCH_PROFILE', 'LIMIT_CONTENT', 'EMERGENCY_MESSAGE'].includes(body.commandType)) {
      return NextResponse.json(
        { error: "Valid command type is required" },
        { status: 400 }
      )
    }

    // Verify user has access to this child (must be parent or creator)
    const child = await prisma.childProfile.findFirst({
      where: {
        id: body.childId,
        family: {
          OR: [
            { createdBy: user.id },
            { familyMembers: { some: { userId: user.id, role: 'PARENT' } } }
          ]
        }
      }
    })

    if (!child) {
      return NextResponse.json(
        { error: "Child profile not found or access denied" },
        { status: 404 }
      )
    }

    // Create remote command
    const command = await prisma.remoteCommand.create({
      data: {
        childProfileId: body.childId,
        commandType: body.commandType,
        payload: body.payload || {},
        status: 'PENDING',
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : new Date(Date.now() + 5 * 60 * 1000) // 5 minutes default
      },
      include: {
        childProfile: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            family: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    })

    // TODO: Send real-time notification to child device via WebSocket/Push Notification
    // This will be implemented in the WebSocket server

    return NextResponse.json({
      command,
      message: `${body.commandType} command sent to ${child.name}`
    }, { status: 201 })
  } catch (error) {
    console.error("Error sending remote command:", error)
    
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

