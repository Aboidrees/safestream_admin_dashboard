import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { prisma } from './prisma'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')

export interface SafeStreamJWTPayload extends JWTPayload {
  id: string
  email: string
  name?: string
  role?: string
  isAdmin?: boolean
  adminId?: string
}

export async function createJWT(payload: SafeStreamJWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .setIssuer('safestream')
    .setAudience('safestream-users')
    .sign(secret)

  return jwt
}

export async function verifyJWT(token: string): Promise<SafeStreamJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'safestream',
      audience: 'safestream-users',
    })

    return payload as SafeStreamJWTPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

export async function createSessionToken(userId: string): Promise<string> {
  try {
    // Get user data from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        admins: {
          where: { isActive: true },
          select: { role: true, id: true }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    const admin = user.admins[0]
    const payload: SafeStreamJWTPayload = {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: admin?.role || 'user',
      isAdmin: !!admin,
      adminId: admin?.id,
    }

    return await createJWT(payload)
  } catch (error) {
    console.error('Failed to create session token:', error)
    throw error
  }
}

export async function refreshSessionToken(token: string): Promise<string | null> {
  try {
    const payload = await verifyJWT(token)
    if (!payload) {
      return null
    }

    // Create a new token with the same payload but fresh expiration
    return await createJWT(payload)
  } catch (error) {
    console.error('Failed to refresh session token:', error)
    return null
  }
}

export async function validateAdminToken(token: string): Promise<{ isValid: boolean; adminId?: string; role?: string }> {
  try {
    const payload = await verifyJWT(token)
    
    if (!payload || !payload.isAdmin) {
      return { isValid: false }
    }

    // Verify admin still exists and is active
    const admin = await prisma.admin.findUnique({
      where: { 
        id: payload.adminId!,
        isActive: true 
      }
    })

    if (!admin) {
      return { isValid: false }
    }

    return { 
      isValid: true, 
      adminId: admin.id, 
      role: admin.role 
    }
  } catch (error) {
    console.error('Admin token validation failed:', error)
    return { isValid: false }
  }
}
