import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
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
export async function getAuthenticatedAdmin(): Promise<AuthenticatedAdmin | null> {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.isAdmin) {
      return null
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role,
      isAdmin: session.user.isAdmin,
      adminId: session.user.adminId,
    }
  } catch (error) {
    console.error("Failed to get authenticated admin:", error)
    return null
  }
}

/**
 * Require admin authentication - throws error if not authenticated
 */
export async function requireAdmin(): Promise<AuthenticatedAdmin> {
  const admin = await getAuthenticatedAdmin()
  
  if (!admin) {
    throw new AuthenticationError("Admin authentication required", "AUTH_REQUIRED")
  }
  
  return admin
}

/**
 * Require specific admin role - throws error if insufficient permissions
 */
export async function requireRole(requiredRole: AdminRole): Promise<AuthenticatedAdmin> {
  const admin = await requireAdmin()
  
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