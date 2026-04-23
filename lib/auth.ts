import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import type { AdminRole } from "@aboidrees/safestream-database"


// Extend NextAuth types for better type safety
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: AdminRole
    isAdmin: boolean
    adminId: string
    image?: string | null
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: AdminRole
      isAdmin: boolean
      adminId: string
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    email: string
    name: string
    role: AdminRole
    isAdmin: boolean
    adminId: string
    image?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  // Let NextAuth auto-detect secure cookies based on NEXTAUTH_URL.
  // Setting useSecureCookies: true in an HTTP environment (e.g. http://localhost)
  // causes browsers to silently reject __Secure- prefixed cookies, breaking login.
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "admin@safestream.app"
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        // Brute-force lockout: 5 failed attempts → 15 minutes locked.
        // PRD §4.4.1 advertised this; this is the actual implementation (2026-04-23).
        const LOCKOUT_THRESHOLD = 5
        const LOCKOUT_WINDOW_MS = 15 * 60 * 1000

        try {
          const admin = await prisma.admin.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          })

          if (!admin || !admin.password) {
            throw new Error("Invalid credentials")
          }

          if (!admin.isActive) {
            throw new Error("Account is not active")
          }

          // Lockout gate — checked BEFORE bcrypt so locked accounts don't leak
          // password-hash compute time as a signal.
          if (admin.lockedUntil && admin.lockedUntil > new Date()) {
            throw new Error("Account temporarily locked due to repeated failed logins. Try again later.")
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            admin.password
          )

          if (!isPasswordValid) {
            const nextCount = admin.failedLoginAttempts + 1
            const now = new Date()
            const shouldLock = nextCount >= LOCKOUT_THRESHOLD
            await prisma.admin.update({
              where: { id: admin.id },
              data: {
                failedLoginAttempts: nextCount,
                lastFailedAttempt: now,
                ...(shouldLock ? { lockedUntil: new Date(now.getTime() + LOCKOUT_WINDOW_MS) } : {}),
              },
            })
            throw new Error("Invalid credentials")
          }

          // Success — clear any accumulated failure state and stamp last login.
          await prisma.admin.update({
            where: { id: admin.id },
            data: {
              failedLoginAttempts: 0,
              lastFailedAttempt: null,
              lockedUntil: null,
              lastLogin: new Date(),
            },
          })

          const adminUser = {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            isAdmin: true,
            adminId: admin.id,
          }

          return adminUser
        } catch (error) {
          throw error // Re-throw to preserve specific error messages
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours for testing
    updateAge: 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours for testing
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
          adminId: user.adminId,
        }
      }

      // Return previous token if the access token has not expired yet
      return token
    },
    async session({ session, token }) {
      
      // Send properties to the client - ONLY ADMIN DATA
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          isAdmin: token.isAdmin,
          adminId: token.adminId,
        }
      } 
      return session
    },
    async redirect({ url, baseUrl }) {
      // Never redirect back to login page after authentication
      if (url.includes('/login')) {
        return `${baseUrl}/`
      }
      
      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`
      }
      
      // If it's the same origin, allow it
      if (url.startsWith(baseUrl)) {
        return url
      }
      
      // For any other URL, redirect to dashboard
      return `${baseUrl}/`
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    async signIn({ user }) {
      // Admin sign in event - can be used for logging if needed
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Auth] Admin sign in: ${user.email}`)
      }
    },
    async signOut() {
      // Admin sign out event - can be used for logging if needed
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}