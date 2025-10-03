import { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import type { AdminRole } from "@prisma/client"

// Custom error classes for better error handling
export class AuthenticationError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string, public code: string) {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export interface AuthenticatedAdmin {
  id: string
  email: string
  name: string
  role: AdminRole
  isAdmin: boolean
  adminId: string
}

/**
 * Get authenticated admin from NextAuth session
 */
export async function getAuthenticatedAdmin(req: NextRequest): Promise<AuthenticatedAdmin | null> {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET
    })

    if (!token || !token.isAdmin) {
      return null
    }

    return {
      id: token.id as string,
      email: token.email as string,
      name: token.name as string,
      role: token.role as AdminRole,
      isAdmin: token.isAdmin as boolean,
      adminId: token.adminId as string,
    }
  } catch (error) {
    console.error("Failed to get authenticated admin:", error)
    return null
  }
}

/**
 * Require admin authentication - throws error if not authenticated
 */
export async function requireAdmin(req: NextRequest): Promise<AuthenticatedAdmin> {
  const admin = await getAuthenticatedAdmin(req)
  
  if (!admin) {
    throw new AuthenticationError("Admin authentication required", "AUTH_REQUIRED")
  }
  
  return admin
}

/**
 * Require specific admin role - throws error if insufficient permissions
 */
export async function requireRole(req: NextRequest, requiredRole: AdminRole): Promise<AuthenticatedAdmin> {
  const admin = await requireAdmin(req)
  
  // Define role hierarchy (higher number = more permissions)
  const roleHierarchy: Record<AdminRole, number> = {
    MODERATOR: 1,
    ADMIN: 2,
    SUPER_ADMIN: 3
  }
  
  if (roleHierarchy[admin.role] < roleHierarchy[requiredRole]) {
    throw new AuthorizationError(
      `Insufficient permissions. Required: ${requiredRole}, Current: ${admin.role}`,
      "INSUFFICIENT_PERMISSIONS"
    )
  }
  
  return admin
}