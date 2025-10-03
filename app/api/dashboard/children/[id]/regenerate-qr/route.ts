import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { randomBytes } from 'crypto'

// POST - Regenerate QR code for a child profile
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(req)
    const childId = params.id

    // Check if user has access to this child's family
    const child = await prisma.childProfile.findFirst({
      where: {
        id: childId,
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

    // Generate new QR code
    const qrCode = `QR_${randomBytes(8).toString('hex').toUpperCase()}`
    const qrCodeExpiresAt = new Date()
    qrCodeExpiresAt.setDate(qrCodeExpiresAt.getDate() + 30) // 30 days expiration

    // Update child profile with new QR code
    const updatedChild = await prisma.childProfile.update({
      where: { id: childId },
      data: {
        qrCode,
        qrCodeExpiresAt
      },
      select: {
        id: true,
        name: true,
        qrCode: true,
        qrCodeExpiresAt: true
      }
    })

    return NextResponse.json({ 
      message: "QR code regenerated successfully",
      child: updatedChild
    })
  } catch (error) {
    console.error("Error regenerating QR code:", error)
    
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

