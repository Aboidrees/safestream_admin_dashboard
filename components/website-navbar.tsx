"use client"

import Link from "next/link"
import { Shield, Play } from "lucide-react"

interface WebsiteNavbarProps {
  currentPage?: string
}

export function WebsiteNavbar({ currentPage }: WebsiteNavbarProps) {
  const navItems = [
    { href: "/#features", label: "Features", id: "features" },
    { href: "/#how-it-works", label: "How it Works", id: "how-it-works" },
    { href: "/#pricing", label: "Pricing", id: "pricing" },
    { href: "/about", label: "About", id: "about" },
  ]

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative">
              <Shield className="h-8 w-8 text-red-500" />
              <Play className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              SafeStream
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = currentPage === item.id
              return item.href.startsWith('/#') ? (
                <a
                  key={item.id}
                  href={item.href}
                  className={`text-sm transition-colors duration-500 cursor-pointer ${
                    isActive 
                      ? 'text-red-500 font-medium' 
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-sm transition-colors duration-500 ${
                    isActive 
                      ? 'text-red-500 font-medium' 
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link href="/dashboard/login" className="text-gray-600 hover:text-red-500 text-sm transition-colors duration-500">
              Log In
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
