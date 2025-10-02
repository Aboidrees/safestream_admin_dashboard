import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function adminAuthMiddleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  try {
    // Get the current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("Admin middleware: No authenticated user")
      return NextResponse.redirect(new URL("/login", request.url))
    }

    // Check if user is an admin
    const { data: adminData, error: adminError } = await supabase
      .from("admins")
      .select("role, is_active, token_expires_at, last_login")
      .eq("user_id", user.id)
      .single()

    if (adminError || !adminData) {
      console.log("Admin middleware: User is not an admin")
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Check if admin account is active
    if (!adminData.is_active) {
      console.log("Admin middleware: Admin account is inactive")
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Check token expiry if exists
    if (adminData.token_expires_at) {
      const expiryDate = new Date(adminData.token_expires_at)
      if (expiryDate < new Date()) {
        console.log("Admin middleware: Admin token has expired")
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    // Check for suspicious activity (optional)
    const lastLogin = adminData.last_login ? new Date(adminData.last_login) : null
    const now = new Date()
    const daysSinceLastLogin = lastLogin ? (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24) : 0

    if (daysSinceLastLogin > 90) {
      console.log("Admin middleware: Admin account inactive for too long")
      // Could redirect to reactivation page instead of blocking
    }

    // Admin verification successful
    console.log(`Admin middleware: Access granted for ${adminData.role}`)
    return res
  } catch (error) {
    console.error("Admin middleware error:", error)
    return NextResponse.redirect(new URL("/", request.url))
  }
}
