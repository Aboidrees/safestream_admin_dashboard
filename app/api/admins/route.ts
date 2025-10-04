import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req)

    // Get all admins
    const admins = await prisma.admin.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
        _count: {
          select: {
            createdCollections: true,
            moderatedVideos: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match the expected format
    const formattedAdmins = admins.map(admin => ({
      id: admin.id,
      name: admin.name || 'Unknown',
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
      createdAt: admin.createdAt.toISOString(),
      lastLogin: admin.lastLogin?.toISOString() || null,
      collectionsCount: admin._count.createdCollections,
      moderatedVideosCount: admin._count.moderatedVideos
    }))

    return NextResponse.json({ admins: formattedAdmins })
  } catch (error) {
    console.error("Error fetching admins:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req)

    const body = await req.json()
    const { name, email, password, role = 'admin' } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      )
    }

    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new admin
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role as 'SUPER_ADMIN' | 'ADMIN' | 'MODERATOR',
        isActive: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    return NextResponse.json({ 
      admin: {
        ...newAdmin,
        createdAt: newAdmin.createdAt.toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    console.error("Error creating admin:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}