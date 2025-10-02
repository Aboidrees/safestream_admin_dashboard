"use client"

import { useEffect } from "react"

export default function AdminSetupRedirect() {
  useEffect(() => {
    // Redirect to the new secure location
    window.location.href = "/my-management-office/setup"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p>Please wait while we redirect you to the secure management area.</p>
      </div>
    </div>
  )
}
