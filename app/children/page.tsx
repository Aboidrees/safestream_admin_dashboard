"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Baby, ArrowRight, Users } from "lucide-react"

export default function AdminChildrenPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to families page after a short delay
    const timer = setTimeout(() => {
      router.push('/families')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
            <Baby className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Child Profiles Moved
          </h2>
          <p className="text-gray-600 mb-6">
            Child profiles are now managed within Family Management for better organization.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-blue-800">
              <Users className="h-5 w-5" />
              <span className="font-medium">Redirecting to Family Management...</span>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/families')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
          >
            <Users className="h-5 w-5" />
            Go to Family Management
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}