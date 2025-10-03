import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import { createAccessToken, createRefreshToken } from "./jwt-enhanced"
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

        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email
            },
            include: {
              admins: {
                where: { isActive: true },
                select: { role: true, id: true },
              },
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          const admin = user.admins?.[0]

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: admin?.role || 'user',
            isAdmin: !!admin,
            adminId: admin?.id,
          } as any
        } catch (error) {
          console.error('Authorize error:', error)
          return null
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
      // If this is a new login, add custom user properties to token
      if (user && account) {
        return {
          ...token,
          id: user.id,
          email: user.email,
          name: user.name,
          role: (user as any).role,
          isAdmin: (user as any).isAdmin,
          adminId: (user as any).adminId,
        }
      }

      // For subsequent requests, return the existing token
      return token
    },
    async session({ session, token }) {
      // Add custom token properties to session
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          isAdmin: token.isAdmin as boolean,
          adminId: token.adminId as string | undefined,
        } as any
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
