import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"

// PATCH - Update screen time limits for a child
export async function PATCH(req: NextRequest) {
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

    // Build screen time limits object
    const limits: any = {}
    
    if (body.dailyLimit !== undefined) {
      if (typeof body.dailyLimit !== 'number' || body.dailyLimit < 0 || body.dailyLimit > 1440) {
        return NextResponse.json(
          { error: "Daily limit must be between 0 and 1440 minutes (24 hours)" },
          { status: 400 }
        )
      }
      limits.dailyLimit = body.dailyLimit
    }

    if (body.weeklyLimit !== undefined) {
      if (typeof body.weeklyLimit !== 'number' || body.weeklyLimit < 0) {
        return NextResponse.json(
          { error: "Weekly limit must be a positive number" },
          { status: 400 }
        )
      }
      limits.weeklyLimit = body.weeklyLimit
    }

    if (body.scheduleRestrictions !== undefined) {
      limits.scheduleRestrictions = body.scheduleRestrictions
    }

    if (body.enabled !== undefined) {
      limits.enabled = body.enabled
    }

    // Merge with existing limits
    const existingLimits = (child.screenTimeLimits as any) || {}
    const updatedLimits = { ...existingLimits, ...limits }

    // Update child profile
    const updatedChild = await prisma.childProfile.update({
      where: { id: body.childId },
      data: {
        screenTimeLimits: updatedLimits
      },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        screenTimeLimits: true
      }
    })

    return NextResponse.json({
      message: "Screen time limits updated successfully",
      child: updatedChild
    })
  } catch (error) {
    console.error("Error updating screen time limits:", error)
    
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

// POST - Reset screen time for a child
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

    const date = body.date ? new Date(body.date) : new Date()
    date.setHours(0, 0, 0, 0) // Normalize to start of day

    // Find and reset the screen time record for this date
    const screenTimeRecord = await prisma.screenTime.findFirst({
      where: {
        childProfileId: body.childId,
        date
      }
    })

    if (screenTimeRecord) {
      await prisma.screenTime.update({
        where: { id: screenTimeRecord.id },
        data: { minutesUsed: 0 }
      })
    }

    return NextResponse.json({
      message: "Screen time reset successfully",
      date: date.toISOString()
    })
  } catch (error) {
    console.error("Error resetting screen time:", error)
    
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

