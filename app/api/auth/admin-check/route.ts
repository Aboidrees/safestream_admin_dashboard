import { NextRequest, NextResponse } from "next/server"
import { getAuthenticatedUser } from "@/lib/auth-utils"

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    if (!user) {
      return NextResponse.json({ isAdmin: false })
    }

    return NextResponse.json({ 
      isAdmin: user.isAdmin,
      role: user.role,
      adminId: user.adminId
    })
  } catch (error) {
    console.error("Admin check error:", error)
    return NextResponse.json({ isAdmin: false })
  }
}
