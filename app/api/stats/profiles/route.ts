import {  NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth-session"

export async function GET() {
  try {
    // Require admin authentication
    await requireAdmin()

    // Get total child profile count
    const count = await prisma.childProfile.count()

    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error fetching profile stats:", error)
    
    if (error instanceof Error && error.message === "Admin access required") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

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

