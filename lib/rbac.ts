import type { AdminRole } from "@prisma/client"

// Define permissions for each admin role
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    'users:read',
    'users:write',
    'users:delete',
    'families:read',
    'families:write',
    'families:delete',
    'collections:read',
    'collections:write',
    'collections:delete',
    'videos:read',
    'videos:write',
    'videos:delete',
    'moderation:read',
    'moderation:write',
    'settings:read',
    'settings:write',
    'reports:read',
    'analytics:read'
  ],
  ADMIN: [
    'users:read',
    'users:write',
    'families:read',
    'families:write',
    'collections:read',
    'collections:write',
    'videos:read',
    'videos:write',
    'moderation:read',
    'moderation:write',
    'reports:read'
  ],
  MODERATOR: [
    'collections:read',
    'videos:read',
    'videos:write',
    'moderation:read',
    'moderation:write'
  ]
} as const

export type Permission = typeof ROLE_PERMISSIONS.SUPER_ADMIN[number]

/**
 * Check if a user has a specific permission
 */
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return Array.isArray(ROLE_PERMISSIONS[role]) ? ROLE_PERMISSIONS[role]!.includes(permission) : false
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission))
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission))
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: AdminRole): Permission[] {
  return Array.isArray(ROLE_PERMISSIONS[role]) ? ROLE_PERMISSIONS[role] : []
}

/**
 * Check if a role can access a specific route
 */
export function canAccessRoute(role: AdminRole, route: string): boolean {
  const routePermissions: Record<string, Permission[]> = {
    '/users': ['users:read'],
    '/families': ['families:read'],
    '/collections': ['collections:read'],
    '/videos': ['videos:read'],
    '/moderation': ['moderation:read'],
    '/settings': ['settings:read'],
    '/reports': ['reports:read']
  }

  const requiredPermissions = routePermissions[route] ?? []
  return hasAllPermissions(role, requiredPermissions)
}
