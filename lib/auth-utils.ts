import { NextRequest } from "next/server"
import { verifyAccessToken, validateAdminToken } from "./jwt-enhanced"
import type { AuthenticatedUser } from "./types"

export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get token from Authorization header or cookie
    let token: string | null = null
    
    // Check Authorization header first
    const authHeader = req.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7)
    }
    
    // If no header, check cookies
    if (!token) {
      const sessionToken = req.cookies.get("next-auth.session-token")?.value
      if (sessionToken) {
        token = sessionToken
      }
    }

    if (!token) {
      return null
    }

    // Verify the JWT using jose
        const payload = await verifyAccessToken(token)
    
    if (!payload) {
      return null
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role || "user",
      isAdmin: payload.isAdmin || false,
      adminId: payload.adminId
    }
  } catch (error) {
    console.error("Failed to get authenticated user:", error)
    return null
  }
}

export async function requireAuth(req: NextRequest): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(req)
  
  if (!user) {
    throw new Error("Authentication required")
  }
  
  return user
}

export async function requireAdmin(req: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireAuth(req)
  
  if (!user.isAdmin) {
    throw new Error("Admin access required")
  }
  
  return user
}

export async function getAdminFromToken(token: string): Promise<{ isValid: boolean; adminId?: string; role?: string }> {
  return await validateAdminToken(token)
}

export function createAuthResponse(message: string, status: number = 401) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  })
}
