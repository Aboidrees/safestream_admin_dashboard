"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "./client"
import type { User } from "@supabase/supabase-js"

interface SupabaseContext {
  user: User | null
  signOut: () => Promise<void>
}

const Context = createContext<SupabaseContext>({
  user: null,
  signOut: async () => {},
})

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return <Context.Provider value={{ user, signOut }}>{children}</Context.Provider>
}

export const useSupabase = () => useContext(Context)
