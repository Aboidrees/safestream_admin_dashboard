import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, getAuthStatusCode } from "@/lib/auth-session"

export const runtime = 'nodejs'

const VALID_ACTIONS = ['approve', 'reject', 'flag', 'review', 'pending'] as const
type BulkAction = typeof VALID_ACTIONS[number]

/**
 * POST /api/content/moderation/videos/bulk
 * Body: { action, videoIds, notes?, rejectionReason?, assignTo? }
 * Requires: admin authentication
 *
 * Applies a single moderation action to multiple videos atomically.
 * Returns { updated, errors[] }
 */
export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()
    const body = await req.json()
    const { action, videoIds, notes, rejectionReason, assignTo } = body

    if (!action || !VALID_ACTIONS.includes(action as BulkAction)) {
      return NextResponse.json(
        { error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(', ')}` },
        { status: 400 }
      )
    }

    if (!Array.isArray(videoIds) || videoIds.length === 0) {
      return NextResponse.json(
        { error: "videoIds must be a non-empty array" },
        { status: 400 }
      )
    }

    // Cap bulk operations at 100 to avoid timeouts
    if (videoIds.length > 100) {
      return NextResponse.json(
        { error: "Cannot bulk-moderate more than 100 videos at once" },
        { status: 400 }
      )
    }

    const statusMap: Record<BulkAction, 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'UNDER_REVIEW' | 'PENDING'> = {
      approve: 'APPROVED',
      reject:  'REJECTED',
      flag:    'FLAGGED',
      review:  'UNDER_REVIEW',
      pending: 'PENDING',
    }

    const moderationStatus = statusMap[action as BulkAction]
    const isApproved = action === 'approve'

    const result = await prisma.video.updateMany({
      where: { id: { in: videoIds } },
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
      message: `${result.count} video${result.count !== 1 ? 's' : ''} ${action}d successfully`,
      updated: result.count,
    })
  } catch (error: unknown) {
    console.error("Error bulk-moderating videos:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: getAuthStatusCode(error) }
    )
  }
}
