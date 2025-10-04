import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"
import type { AdminRole } from "@prisma/client"


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
  debug: true,
  useSecureCookies: false, // For development
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
        console.log("🔐 Authorize called with credentials:", { email: credentials?.email, hasPassword: !!credentials?.password })
        
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        try {
          // Only authenticate admins - NO USER TABLE USED
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

          // Verify password with timing attack protection
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            admin.password
          )

          if (!isPasswordValid) {
            throw new Error("Invalid credentials")
          }

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
      console.log("🔄 JWT callback - token:", token, "user:", user, "account:", account)
      
      // Initial sign in
      if (account && user) {
        const newToken = {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isAdmin: user.isAdmin,
          adminId: user.adminId,
        }
        console.log("🔄 JWT callback - New token created:", newToken)
        return newToken
      }

      // Return previous token if the access token has not expired yet
      console.log("🔄 JWT callback - Returning existing token:", token)
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
      console.log("🔄 Redirect callback - url:", url, "baseUrl:", baseUrl)
      
      // If it's a relative URL, make it absolute
      if (url.startsWith("/")) {
        const redirectUrl = `${baseUrl}${url}`
        console.log("🔄 Redirect callback - relative URL, redirecting to:", redirectUrl)
        return redirectUrl
      }
      
      // If it's the same origin, allow it
      if (url.startsWith(baseUrl)) {
        console.log("🔄 Redirect callback - same origin, allowing:", url)
        return url
      }
      
      // For any other URL, redirect to dashboard
      const redirectUrl = `${baseUrl}/`
      console.log("🔄 Redirect callback - default redirect to:", redirectUrl)
      return redirectUrl
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("🎉 Admin sign in: ", user)
      console.log("🎉 Account: ", account)
      console.log("🎉 Profile: ", profile)
      console.log("🎉 Is new user: ", isNewUser)
    },
    async signOut({ session, token }) {
      console.log("👋 Admin sign out: ", session?.user?.email || token?.email, session?.user?.name || token?.name, session?.user?.role || token?.role, session?.user?.isAdmin || token?.isAdmin, session?.user?.adminId || token?.adminId || 'none')
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}