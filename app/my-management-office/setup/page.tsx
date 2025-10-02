"use client"

import { useState, useEffect } from "react"
import { Button, Card, Input, message, Spin } from "antd"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useSupabase } from "@/lib/supabase/provider"

export default function AdminSetup() {
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const { user } = useSupabase()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkCurrentUser = async () => {
      if (!user) return

      setUserId(user.id)
      setUserEmail(user.email)

      // Check if user is already an admin
      const { data, error } = await supabase.from("admins").select("*").eq("user_id", user.id).single()

      if (data && !error) {
        setIsAdmin(true)
        // Auto-redirect to admin dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = "/my-management-office/dashboard"
        }, 2000)
      }
    }

    checkCurrentUser()
  }, [user, supabase])

  const handleCreateAdmin = async () => {
    if (!userId) {
      message.error("You must be logged in to perform this action")
      return
    }

    try {
      setLoading(true)

      // Insert the current user as a superadmin
      const { error } = await supabase.from("admins").insert([
        {
          user_id: userId,
          role: "super_admin",
        },
      ])

      if (error) {
        throw error
      }

      message.success("Successfully added as a superadmin!")
      setIsAdmin(true)

      // Redirect after success
      setTimeout(() => {
        window.location.href = "/my-management-office/dashboard"
      }, 1500)
    } catch (error: any) {
      console.error("Error creating admin:", error)
      message.error(`Failed to create admin: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Management Office Setup</h1>
            <p className="mb-4">Please log in to continue.</p>
            <Button type="primary" href="/login">
              Log In
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Management Office Setup</h1>

          {loading ? (
            <div className="flex justify-center my-8">
              <Spin size="large" />
            </div>
          ) : isAdmin ? (
            <div>
              <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
                <p className="font-bold">✅ You are already a superadmin!</p>
                <p>Redirecting to management dashboard in 2 seconds...</p>
              </div>
              <Button type="primary" href="/my-management-office/dashboard">
                Go to Management Dashboard Now
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <p className="mb-2">Current User:</p>
                <Input value={userEmail || ""} disabled className="mb-4" />
                <Input value={userId || ""} disabled />
              </div>
              <Button type="primary" onClick={handleCreateAdmin} loading={loading}>
                Grant Management Access
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
