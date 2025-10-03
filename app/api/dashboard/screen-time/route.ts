import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// GET - Get screen time data for child profiles
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { searchParams } = new URL(req.url)
    const childId = searchParams.get('childId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const days = parseInt(searchParams.get('days') || '7')

    // Validate child access
    if (childId) {
      const child = await prisma.childProfile.findFirst({
        where: {
          id: childId,
          family: {
            OR: [
              { createdBy: user.id },
              { familyMembers: { some: { userId: user.id } } }
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
    }

    // Build date range
    const end = endDate ? new Date(endDate) : new Date()
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - days * 24 * 60 * 60 * 1000)

    // Build where clause
    const where: any = {
      date: {
        gte: start,
        lte: end
      }
    }

    if (childId) {
      where.childProfileId = childId
    } else {
      // Get all children for this user
      where.childProfile = {
        family: {
          OR: [
            { createdBy: user.id },
            { familyMembers: { some: { userId: user.id } } }
          ]
        }
      }
    }

    const screenTimeData = await prisma.screenTime.findMany({
      where,
      include: {
        childProfile: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            screenTimeLimits: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Calculate aggregated data
    const totalMinutes = screenTimeData.reduce((sum, record) => sum + record.minutesUsed, 0)
    const averageMinutes = screenTimeData.length > 0 ? totalMinutes / screenTimeData.length : 0

    return NextResponse.json({
      screenTime: screenTimeData,
      summary: {
        totalMinutes,
        averageMinutes: Math.round(averageMinutes),
        totalRecords: screenTimeData.length,
        dateRange: {
          start: start.toISOString(),
          end: end.toISOString()
        }
      }
    })
  } catch (error) {
    console.error("Error fetching screen time:", error)
    
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

// POST - Record screen time usage
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

    if (body.minutesUsed === undefined || typeof body.minutesUsed !== 'number' || body.minutesUsed < 0) {
      return NextResponse.json(
        { error: "Valid minutes used is required" },
        { status: 400 }
      )
    }

    // Verify user has access to this child
    const child = await prisma.childProfile.findFirst({
      where: {
        id: body.childId,
        family: {
          OR: [
            { createdBy: user.id },
            { familyMembers: { some: { userId: user.id } } }
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

    const date = body.date ? new Date(body.date) : new Date()
    date.setHours(0, 0, 0, 0) // Normalize to start of day

    // Check if record exists for this date
    const existingRecord = await prisma.screenTime.findFirst({
      where: {
        childProfileId: body.childId,
        date
      }
    })

    let screenTime
    if (existingRecord) {
      // Update existing record
      screenTime = await prisma.screenTime.update({
        where: { id: existingRecord.id },
        data: {
          minutesUsed: body.replace ? body.minutesUsed : existingRecord.minutesUsed + body.minutesUsed
        },
        include: {
          childProfile: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              screenTimeLimits: true
            }
          }
        }
      })
    } else {
      // Create new record
      screenTime = await prisma.screenTime.create({
        data: {
          childProfileId: body.childId,
          date,
          minutesUsed: body.minutesUsed
        },
        include: {
          childProfile: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              screenTimeLimits: true
            }
          }
        }
      })
    }

    // Check if limit exceeded
    const limits = child.screenTimeLimits as any
    const dailyLimit = limits?.dailyLimit || null
    const exceedsLimit = dailyLimit && screenTime.minutesUsed > dailyLimit

    return NextResponse.json({
      screenTime,
      alert: exceedsLimit ? {
        type: 'limit_exceeded',
        message: `Screen time limit exceeded. Used ${screenTime.minutesUsed} minutes of ${dailyLimit} minutes allowed.`,
        dailyLimit,
        used: screenTime.minutesUsed
      } : null
    })
  } catch (error) {
    console.error("Error recording screen time:", error)
    
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

