import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/register", "/about", "/contact"]
  const isPublicRoute = publicRoutes.some(
    (route) => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(route),
  )

  if (isPublicRoute) {
    return res
  }

  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session and trying to access protected route, redirect to login
    if (!session) {
      const url = new URL("/login", req.url)
      url.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Check if user is trying to access admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const { data: adminData } = await supabase.from("admins").select("role").eq("user_id", session.user.id).single()

      if (!adminData) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return res
  } catch (error) {
    console.error("Middleware error:", error)
    return res
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
