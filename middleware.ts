import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { adminAuthMiddleware } from "./lib/middleware/admin-auth"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle admin routes
  if (pathname.startsWith("/my-management-office")) {
    return adminAuthMiddleware(request)
  }

  // Handle dashboard routes (require authentication)
  if (pathname.startsWith("/dashboard")) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return res
  }

  // Allow all other routes
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/my-management-office/:path*", "/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
