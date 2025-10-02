import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function adminMiddleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!session) {
    const url = new URL("/login", req.url)
    url.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Check if user is an admin
  const { data: adminData } = await supabase.from("admins").select("*").eq("user_id", session.user.id).single()

  if (!adminData) {
    // Not an admin, redirect to secure admin setup page
    return NextResponse.redirect(new URL("/my-management-office/setup", req.url))
  }

  return res
}
