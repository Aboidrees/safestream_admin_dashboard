"use client"

import { useEffect, useState } from "react"

export default function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<{
    supabaseUrl: boolean
    supabaseAnonKey: boolean
  }>({
    supabaseUrl: false,
    supabaseAnonKey: false,
  })

  useEffect(() => {
    setEnvStatus({
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  }, [])

  if (envStatus.supabaseUrl && envStatus.supabaseAnonKey) {
    return null
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Environment Variables Missing</h2>
        <div className="space-y-2">
          {!envStatus.supabaseUrl && <p className="text-red-600">NEXT_PUBLIC_SUPABASE_URL is missing</p>}
          {!envStatus.supabaseAnonKey && <p className="text-red-600">NEXT_PUBLIC_SUPABASE_ANON_KEY is missing</p>}
        </div>
        <p className="mt-4">
          Please make sure these environment variables are set in your .env.local file or in your deployment
          environment.
        </p>
      </div>
    </div>
  )
}
