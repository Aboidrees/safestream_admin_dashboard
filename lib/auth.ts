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

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email
          },
          include: {
            admins: {
              where: { isActive: true },
              select: { role: true, id: true },
              take: 1
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

        const admin = user.admins[0]

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: admin?.role || 'user',
          isAdmin: !!admin,
          adminId: admin?.id,
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
      // If this is a new login, create tokens
      if (user && account) {
        try {
          const accessToken = await createAccessToken({
            id: user.id,
            email: user.email!,
            name: user.name!,
            role: user.role,
            isAdmin: user.isAdmin,
            adminId: user.adminId,
          })

          const refreshToken = await createRefreshToken({
            id: user.id,
            email: user.email,
          })

          return {
            ...token,
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isAdmin: user.isAdmin,
            adminId: user.adminId,
            accessToken,  
            refreshToken,
          }
        } catch (error) {
          console.error('Failed to create tokens:', error)
          // Return token without custom tokens on error
          return token
        }
      }

      // For subsequent requests, return the existing token
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          isAdmin: token.isAdmin as boolean,
          adminId: token.adminId as string | undefined,
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
}
