import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin(req)
    const { id: videoId } = await params
    const body = await req.json()

    const { action, notes, rejectionReason } = body

    if (!action || !['approve', 'reject', 'flag', 'review'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve', 'reject', 'flag', or 'review'" },
        { status: 400 }
      )
    }

    let moderationStatus: 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'UNDER_REVIEW' | 'PENDING'
    let isApproved: boolean

    switch (action) {
      case 'approve':
        moderationStatus = 'APPROVED'
        isApproved = true
        break
      case 'reject':
        moderationStatus = 'REJECTED'
        isApproved = false
        break
      case 'flag':
        moderationStatus = 'FLAGGED'
        isApproved = false
        break
      case 'review':
        moderationStatus = 'UNDER_REVIEW'
        isApproved = false
        break
    }

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        moderationStatus,
        isApproved,
        moderatedBy: user.id,
        moderatedAt: new Date(),
        moderationNotes: notes || null,
        rejectionReason: action === 'reject' ? rejectionReason : null
      }
    })

    return NextResponse.json({ 
      message: `Video ${action}d successfully`,
      video 
    })
  } catch (error: unknown) {
    console.error("Error moderating video:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: errorMessage === "Admin access required" ? 403 : 500 }
    )
  }
}
