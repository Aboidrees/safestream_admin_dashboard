import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Skip middleware for login and register pages to prevent redirect loops
  if (req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })

    // Check if user is authenticated
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    // If there's an error or no session, redirect to login
    if (error || !session) {
      const url = new URL("/login", req.url)
      url.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // For admin routes, check if user is an admin
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const { data: adminData } = await supabase.from("admins").select("*").eq("user_id", session.user.id).single()

      if (!adminData) {
        // Not an admin, redirect to dashboard
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    // If there's an error with Supabase, redirect to login
    const url = new URL("/login", req.url)
    url.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
