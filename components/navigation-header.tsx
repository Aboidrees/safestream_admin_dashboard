"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Shield } from "lucide-react"
import { useSupabase } from "@/lib/supabase/provider"

export function NavigationHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useSupabase()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">SafeStream</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-gray-700 hover:text-red-600 transition-colors">
              Features
            </a>
            <a href="/#how-it-works" className="text-gray-700 hover:text-red-600 transition-colors">
              How it Works
            </a>
            <a href="/#pricing" className="text-gray-700 hover:text-red-600 transition-colors">
              Pricing
            </a>
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button onClick={signOut} variant="outline" className="bg-transparent">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a
              href="/#features"
              className="block text-gray-700 hover:text-red-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="/#how-it-works"
              className="block text-gray-700 hover:text-red-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              href="/#pricing"
              className="block text-gray-700 hover:text-red-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </a>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={signOut} variant="outline" className="w-full bg-transparent">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-red-600 to-pink-600">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
