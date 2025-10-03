import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth } from "@/lib/auth-utils"
import { randomBytes } from 'crypto'

// GET - List all child profiles for authenticated user's families
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const { searchParams } = new URL(req.url)
    const familyId = searchParams.get('familyId')

    const where = familyId
      ? {
          familyId,
          family: {
            OR: [
              { createdBy: user.id },
              { familyMembers: { some: { userId: user.id } } }
            ]
          }
        }
      : {
          family: {
            OR: [
              { createdBy: user.id },
              { familyMembers: { some: { userId: user.id } } }
            ]
          }
        }

    const children = await prisma.childProfile.findMany({
      where,
      include: {
        family: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            watchHistory: true,
            favorites: true,
            screenTime: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ children })
  } catch (error) {
    console.error("Error fetching children:", error)
    
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

// POST - Create a new child profile
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)
    const body = await req.json()

    // Validate required fields
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: "Child name is required" },
        { status: 400 }
      )
    }

    if (!body.familyId) {
      return NextResponse.json(
        { error: "Family ID is required" },
        { status: 400 }
      )
    }

    // Verify user has access to this family
    const family = await prisma.family.findFirst({
      where: {
        id: body.familyId,
        OR: [
          { createdBy: user.id },
          { familyMembers: { some: { userId: user.id } } }
        ]
      }
    })

    if (!family) {
      return NextResponse.json(
        { error: "Family not found or access denied" },
        { status: 404 }
      )
    }

    // Validate age if provided
    if (body.age !== undefined && (typeof body.age !== 'number' || body.age < 0 || body.age > 18)) {
      return NextResponse.json(
        { error: "Age must be between 0 and 18" },
        { status: 400 }
      )
    }

    // Generate QR code
    const qrCode = `QR_${randomBytes(8).toString('hex').toUpperCase()}`
    const qrCodeExpiresAt = new Date()
    qrCodeExpiresAt.setDate(qrCodeExpiresAt.getDate() + 30) // 30 days expiration

    // Create child profile
    const child = await prisma.childProfile.create({
      data: {
        familyId: body.familyId,
        name: body.name.trim(),
        age: body.age || null,
        avatarUrl: body.avatarUrl || null,
        qrCode,
        qrCodeExpiresAt,
        isActive: true,
        contentRestrictions: body.contentRestrictions || {},
        screenTimeLimits: body.screenTimeLimits || {},
        theme: body.theme || 'default',
        language: body.language || 'en'
      },
      include: {
        family: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ child }, { status: 201 })
  } catch (error) {
    console.error("Error creating child profile:", error)
    
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

