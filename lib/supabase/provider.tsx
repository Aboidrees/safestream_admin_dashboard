"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "./client"
import type { Session, User, SupabaseClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

type SupabaseContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  supabase: SupabaseClient
}

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  supabase: createClient(),
})

export const useSupabase = () => useContext(SupabaseContext)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        }

        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      } catch (error) {
        console.error("Error in getSession:", error)
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signOut,
    supabase,
  }

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>
}
