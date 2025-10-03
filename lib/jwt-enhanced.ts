import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './prisma'
import { z } from 'zod'
import { randomUUID } from 'crypto'

// ============================================================================
// ZOD SCHEMAS FOR VALIDATION
// ============================================================================

const AccessTokenPayloadSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  role: z.string().optional(),
  isAdmin: z.boolean().optional(),
  adminId: z.string().uuid().optional(),
  jti: z.string().uuid(), // JWT ID for revocation
  type: z.literal('access'),
  iat: z.number(),
  exp: z.number(),
  iss: z.string(),
  aud: z.string(),
})

const RefreshTokenPayloadSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  jti: z.string().uuid(), // JWT ID for revocation
  type: z.literal('refresh'),
  iat: z.number(),
  exp: z.number(),
  iss: z.string(),
  aud: z.string(),
})

type AccessTokenPayload = z.infer<typeof AccessTokenPayloadSchema>
type RefreshTokenPayload = z.infer<typeof RefreshTokenPayloadSchema>

// ============================================================================
// CONFIGURATION
// ============================================================================

const JWT_SECRET = process.env.JWT_SECRET
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

if (!NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET environment variable is required')
}

const secret = new TextEncoder().encode(JWT_SECRET)

// Token lifetimes
const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000 // 15 minutes
const REFRESH_TOKEN_LIFETIME = 7 * 24 * 60 * 60 * 1000 // 7 days

// ============================================================================
// TOKEN CREATION
// ============================================================================

export async function createAccessToken(payload: Omit<AccessTokenPayload, 'jti' | 'type' | 'iat' | 'exp' | 'iss' | 'aud'>): Promise<string> {
  const jti = randomUUID()
  const now = Math.floor(Date.now() / 1000)
  
  const tokenPayload: AccessTokenPayload = {
    ...payload,
    jti,
    type: 'access',
    iat: now,
    exp: now + Math.floor(ACCESS_TOKEN_LIFETIME / 1000),
    iss: 'safestream',
    aud: 'safestream-users',
  }

  // Store token session in database - temporarily disabled
  // try {
  //   await prisma.tokenSession.create({
  //     data: {
  //       jti,
  //       userId: payload.id,
  //       tokenType: 'access',
  //       expiresAt: new Date(tokenPayload.exp * 1000),
  //     }
  //   })
  // } catch (error) {
  //   console.warn('Failed to store token session in database:', error)
  //   // Continue without database storage for now
  // }

  const jwt = await new SignJWT(tokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m') // 15 minutes
    .setIssuer('safestream')
    .setAudience('safestream-users')
    .setJti(jti)
    .sign(secret)

  return jwt
}

export async function createRefreshToken(payload: Omit<RefreshTokenPayload, 'jti' | 'type' | 'iat' | 'exp' | 'iss' | 'aud'>): Promise<string> {
  const jti = randomUUID()
  const now = Math.floor(Date.now() / 1000)
  
  const tokenPayload: RefreshTokenPayload = {
    ...payload,
    jti,
    type: 'refresh',
    iat: now,
    exp: now + Math.floor(REFRESH_TOKEN_LIFETIME / 1000),
    iss: 'safestream',
    aud: 'safestream-users',
  }

  // Store token session in database - temporarily disabled
  // try {
  //   await prisma.tokenSession.create({
  //     data: {
  //       jti,
  //       userId: payload.id,
  //       tokenType: 'refresh',
  //       expiresAt: new Date(tokenPayload.exp * 1000),
  //     }
  //   })
  // } catch (error) {
  //   console.warn('Failed to store refresh token session in database:', error)
  //   // Continue without database storage for now
  // }

  const jwt = await new SignJWT(tokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days
    .setIssuer('safestream')
    .setAudience('safestream-users')
    .setJti(jti)
    .sign(secret)

  return jwt
}

// ============================================================================
// TOKEN VERIFICATION
// ============================================================================

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'safestream',
      audience: 'safestream-users',
    })

    // Validate payload with Zod
    const validatedPayload = AccessTokenPayloadSchema.parse(payload)

    // Check if token is revoked - temporarily disabled
    // try {
    //   const tokenSession = await prisma.tokenSession.findFirst({
    //     where: {
    //       jti: validatedPayload.jti,
    //       tokenType: 'access',
    //       revoked: false,
    //       expiresAt: {
    //         gt: new Date()
    //       }
    //     }
    //   })

    //   if (!tokenSession) {
    //     return null
    //   }
    // } catch (error) {
    //   console.warn('Failed to check token session in database:', error)
    //   // Continue without database validation for now
    // }

    return validatedPayload
  } catch (error) {
    console.error("Access token verification failed:", error)
    return null
  }
}

export async function verifyRefreshToken(token: string): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'safestream',
      audience: 'safestream-users',
    })

    // Validate payload with Zod
    const validatedPayload = RefreshTokenPayloadSchema.parse(payload)

    // Check if token is revoked
    const tokenSession = await prisma.tokenSession.findFirst({
      where: {
        jti: validatedPayload.jti,
        tokenType: 'refresh',
        revoked: false,
        expiresAt: {
          gt: new Date()
        }
      }
    })

    if (!tokenSession) {
      return null
    }

    return validatedPayload
  } catch (error) {
    console.error("Refresh token verification failed:", error)
    return null
  }
}

// ============================================================================
// TOKEN REFRESH
// ============================================================================

export async function refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    // Verify refresh token
    const refreshPayload = await verifyRefreshToken(refreshToken)
    if (!refreshPayload) {
      return null
    }

    // Get fresh user data from database
    const user = await prisma.user.findFirst({
      where: { id: refreshPayload.id },
      include: {
        admins: {
          where: { isActive: true },
          select: { id: true, role: true }
        }
      }
    })

    if (!user) {
      return null
    }

    const admin = user.admins?.[0]

    // Revoke old refresh token
    await revokeToken(refreshPayload.jti)

    // Create new tokens
    const accessToken = await createAccessToken({
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      role: admin?.role || 'user',
      isAdmin: !!admin,
      adminId: admin?.id,
    })

    const newRefreshToken = await createRefreshToken({
      id: user.id,
      email: user.email,
    })

    return { accessToken, refreshToken: newRefreshToken }
  } catch (error) {
    console.error("Token refresh failed:", error)
    return null
  }
}

// ============================================================================
// TOKEN REVOCATION
// ============================================================================

export async function revokeToken(jti: string): Promise<boolean> {
  try {
    await prisma.tokenSession.updateMany({
      where: { jti },
      data: { revoked: true }
    })
    return true
  } catch (error) {
    console.error("Token revocation failed:", error)
    return false
  }
}

export async function revokeAllUserTokens(userId: string): Promise<boolean> {
  try {
    await prisma.tokenSession.updateMany({
      where: { userId },
      data: { revoked: true }
    })
    return true
  } catch (error) {
    console.error("User token revocation failed:", error)
    return false
  }
}

// ============================================================================
// ADMIN VALIDATION
// ============================================================================

export async function validateAdminToken(token: string): Promise<{ isValid: boolean; adminId?: string; role?: string }> {
  try {
    const payload = await verifyAccessToken(token)
    if (!payload || !payload.isAdmin || !payload.adminId) {
      return { isValid: false }
    }

    // Re-check admin status against database
    const adminUser = await prisma.admin.findFirst({
      where: { 
        id: payload.adminId,
        isActive: true,
      },
      select: { id: true, role: true },
    })

    if (!adminUser) {
      return { isValid: false }
    }

    return { isValid: true, adminId: adminUser.id, role: adminUser.role }
  } catch (error) {
    console.error("Admin token validation failed:", error)
    return { isValid: false }
  }
}

// ============================================================================
// CLEANUP EXPIRED TOKENS
// ============================================================================

export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.tokenSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revoked: true }
        ]
      }
    })
    return result.count
  } catch (error) {
    console.error("Token cleanup failed:", error)
    return 0
  }
}

// ============================================================================
// LEGACY COMPATIBILITY (for existing code)
// ============================================================================

export async function createJWT(payload: Omit<AccessTokenPayload, 'jti' | 'type' | 'iat' | 'exp' | 'iss' | 'aud'>): Promise<string> {
  return createAccessToken(payload)
}

export async function verifyJWT(token: string): Promise<AccessTokenPayload | null> {
  return verifyAccessToken(token)
}

export async function createSessionToken(payload: Omit<AccessTokenPayload, 'jti' | 'type' | 'iat' | 'exp' | 'iss' | 'aud'>): Promise<string> {
  return createAccessToken(payload)
}

export async function refreshSessionToken(token: string): Promise<string | null> {
  const result = await refreshTokens(token)
  return result?.accessToken || null
}
