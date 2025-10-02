"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Shield } from "lucide-react"
import { useSupabase } from "@/lib/supabase/provider"
import { getSupabaseClient } from "@/lib/supabase/client"

export function NavigationHeader() {
  const { user } = useSupabase()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const { data: adminData } = await supabase.from("admins").select("role").eq("user_id", user.id).single()

        setIsAdmin(!!adminData)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user, supabase])

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              SafeStream
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/#features"
              className="text-gray-600 hover:text-red-500 text-sm transition-colors duration-500 cursor-pointer"
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              className="text-gray-600 hover:text-red-500 text-sm transition-colors duration-500 cursor-pointer"
            >
              How it Works
            </a>
            <a
              href="/#pricing"
              className="text-gray-600 hover:text-red-500 text-sm transition-colors duration-500 cursor-pointer"
            >
              Pricing
            </a>
            <Link href="/about" className="text-gray-600 hover:text-red-500 text-sm transition-colors duration-500">
              About
            </Link>
            {!loading && (
              <>
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="text-gray-600 hover:text-red-500 text-sm transition-colors duration-500"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      className="text-gray-600 hover:text-red-500 text-sm transition-colors duration-500"
                    >
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-red-500 text-sm transition-colors duration-500"
                  >
                    Log In
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
