import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/supabase"

let clientInstance: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createClient() {
  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return clientInstance
}

// Backward compatibility export
export const getSupabaseClient = createClient

// Direct export of supabase instance for simple use cases
export const supabase = createClient()
