"use client"

import { useState, useEffect, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import type { LoginFormData } from "@/lib/types"

function LoginForm() {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Check for circular redirect and clean up URL
  useEffect(() => {
    const callbackUrl = searchParams.get('callbackUrl')
    if (callbackUrl && callbackUrl.includes('/login')) {
      // Remove the circular callbackUrl parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('callbackUrl')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("🔄 Attempting login with:", formData.email)
      const result = await signIn("admin-credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })
      console.log("🔄 Login result:", result)

      if (result?.error) {
        // Handle specific error messages from the server
        const errorMessage = result.error === "CredentialsSignin" 
          ? "Invalid admin credentials" 
          : result.error
        setError(errorMessage)
        setLoading(false)
        return
      }

      if (result?.ok) {
        console.log("✅ Login successful, redirecting to dashboard...")
        // Use NextAuth's built-in redirect instead of manual redirect
        window.location.href = "/"
      } else {
        console.log("❌ Login failed:", result)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("An error occurred during login")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-4xl font-bold rounded-lg p-4 inline-block mb-4">
            🛡️
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-gray-600">
            SafeStream Platform Administration
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-start gap-2">
                <span className="text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@safestream.app"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-600 text-xl">🔒</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Security Notice</p>
              <p>This is a restricted area. All login attempts are logged and monitored.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link 
            href="/" 
            className="text-gray-600 hover:text-gray-900 text-sm"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}

