import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { AdminShell } from "@/components/admin-shell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SafeStream - Family-Friendly Video Streaming",
  description: "Create a safe viewing experience for your children with curated content and parental controls.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          html {
            scroll-behavior: smooth;
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AdminShell>{children}</AdminShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
