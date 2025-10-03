import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { verifyAccessToken } from "./jwt-enhanced"
import type { AuthenticatedUser } from "./types"

/**
 * Get authenticated user from either NextAuth session or custom JWT token
 * This function handles both authentication methods used in the application
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // First, try to get NextAuth session token
    const nextAuthToken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (nextAuthToken) {
      // Convert NextAuth token to our AuthenticatedUser format
      return {
        id: nextAuthToken.id as string,
        email: nextAuthToken.email as string,
        name: nextAuthToken.name as string,
        role: nextAuthToken.role as string || "user",
        isAdmin: nextAuthToken.isAdmin as boolean || false,
        adminId: nextAuthToken.adminId as string | undefined,
      }
    }

    // If no NextAuth token, try custom JWT from Authorization header
    const authHeader = req.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const payload = await verifyAccessToken(token)
      
      if (payload) {
        return {
          id: payload.id,
          email: payload.email,
          name: payload.name || "",
          role: payload.role || "user",
          isAdmin: payload.isAdmin || false,
          adminId: payload.adminId,
        }
      }
    }

    return null
  } catch (error) {
    console.error("Failed to get authenticated user:", error)
    return null
  }
}

/**
 * Require authentication - throws error if user is not authenticated
 */
export async function requireAuth(req: NextRequest): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(req)
  
  if (!user) {
    throw new Error("Authentication required")
  }
  
  return user
}

/**
 * Require admin access - throws error if user is not admin
 */
export async function requireAdmin(req: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireAuth(req)
  
  if (!user.isAdmin) {
    throw new Error("Admin access required")
  }
  
  return user
}
