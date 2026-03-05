import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, getAuthStatusCode } from "@/lib/auth-session"

const VALID_ACTIONS = ['approve', 'reject', 'flag', 'review', 'pending'] as const
type ModerationAction = typeof VALID_ACTIONS[number]

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin()
    const { id: videoId } = await params
    const body = await req.json()

    const { action, notes, rejectionReason, assignTo } = body

    if (!action || !VALID_ACTIONS.includes(action as ModerationAction)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}` },
        { status: 400 }
      )
    }

    const statusMap: Record<ModerationAction, 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'UNDER_REVIEW' | 'PENDING'> = {
      approve: 'APPROVED',
      reject:  'REJECTED',
      flag:    'FLAGGED',
      review:  'UNDER_REVIEW',
      pending: 'PENDING',
    }

    const moderationStatus = statusMap[action as ModerationAction]
    const isApproved = action === 'approve'

    const video = await prisma.video.update({
      where: { id: videoId },
      data: {
        moderationStatus,
        isApproved,
        moderatedBy: assignTo ?? user.id,
        moderatedAt: new Date(),
        moderationNotes: notes || null,
        rejectionReason: action === 'reject' ? (rejectionReason || null) : null,
      }
    })

    return NextResponse.json({
      message: `Video ${action === 'pending' ? 'sent back to queue' : action + 'd'} successfully`,
      video
    })
  } catch (error: unknown) {
    console.error("Error moderating video:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: getAuthStatusCode(error) }
    )
  }
}
