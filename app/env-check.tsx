"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function EnvCheck() {
  const [missingVars, setMissingVars] = useState<string[]>([])

  useEffect(() => {
    const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
    const missing = required.filter((varName) => !process.env[varName])
    setMissingVars(missing)
  }, [])

  if (missingVars.length === 0) return null

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full px-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Missing Environment Variables</AlertTitle>
        <AlertDescription>
          The following environment variables are required but not set:
          <ul className="list-disc list-inside mt-2">
            {missingVars.map((varName) => (
              <li key={varName}>{varName}</li>
            ))}
          </ul>
          <p className="mt-2">Please check your .env.local file and restart the development server.</p>
        </AlertDescription>
      </Alert>
    </div>
  )
}
