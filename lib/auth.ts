import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import { createSessionToken, verifyJWT, type SafeStreamJWTPayload } from "./jwt"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // Check if user has a password (should be hashed)
        if (!user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // If this is a new login, create a custom JWT with jose
      if (user && account) {
        try {
          const customToken = await createSessionToken(user.id)
          // Parse the custom JWT to get the payload
          const payload = await verifyJWT(customToken)
          if (payload) {
            return {
              ...token,
              id: payload.id,
              email: payload.email,
              name: payload.name,
              role: payload.role,
              isAdmin: payload.isAdmin,
              adminId: payload.adminId,
              customToken: customToken
            }
          }
        } catch (error) {
          console.error('Failed to create custom JWT:', error)
        }
      }

      // For subsequent requests, return the existing token
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        // Add custom properties to session
        ;(session as any).user.role = token.role
        ;(session as any).user.isAdmin = token.isAdmin
        ;(session as any).user.adminId = token.adminId
        ;(session as any).customToken = token.customToken
      }
      return session
    },
  },
  pages: {
    signIn: "/dashboard/login",
    newUser: "/dashboard/register",
  },
}
