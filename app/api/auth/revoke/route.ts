import { NextRequest, NextResponse } from "next/server"
import { revokeToken, revokeAllUserTokens } from "@/lib/jwt-enhanced"
import { requireAuth } from "@/lib/auth-session"

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req)

    const { tokenId, revokeAll } = await req.json()

    if (revokeAll) {
      const success = await revokeAllUserTokens(user.id)
      if (success) {
        return NextResponse.json({ message: "All tokens revoked successfully" })
      } else {
        return NextResponse.json(
          { error: "Failed to revoke tokens" },
          { status: 500 }
        )
      }
    }

    if (!tokenId) {
      return NextResponse.json(
        { error: "Token ID is required" },
        { status: 400 }
      )
    }

    const success = await revokeToken(tokenId)
    if (success) {
      return NextResponse.json({ message: "Token revoked successfully" })
    } else {
      return NextResponse.json(
        { error: "Failed to revoke token" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Token revocation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
