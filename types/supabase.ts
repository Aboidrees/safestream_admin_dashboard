export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      api_credentials: {
        Row: {
          id: string
          service_name: string
          api_key: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_name: string
          api_key: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_name?: string
          api_key?: string
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          title: string
          description: string
          thumbnail: string | null
          age_restriction: string
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          thumbnail?: string | null
          age_restriction: string
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          thumbnail?: string | null
          age_restriction?: string
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          interval: string
          max_profiles: number
          max_collections: number
          features: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          interval: string
          max_profiles: number
          max_collections: number
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          interval?: string
          max_profiles?: number
          max_collections?: number
          features?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profile_collections: {
        Row: {
          id: string
          profile_id: string
          collection_id: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          collection_id: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          collection_id?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: "user" | "admin" | "superadmin"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "admin" | "superadmin"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: "user" | "admin" | "superadmin"
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          status: string
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_id?: string
          status?: string
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      time_controls: {
        Row: {
          id: string
          profile_id: string
          daily_limit: number
          enable_daily_limit: boolean
          enable_schedule: boolean
          monday_from: string | null
          monday_to: string | null
          tuesday_from: string | null
          tuesday_to: string | null
          wednesday_from: string | null
          wednesday_to: string | null
          thursday_from: string | null
          thursday_to: string | null
          friday_from: string | null
          friday_to: string | null
          saturday_from: string | null
          saturday_to: string | null
          sunday_from: string | null
          sunday_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          daily_limit: number
          enable_daily_limit?: boolean
          enable_schedule?: boolean
          monday_from?: string | null
          monday_to?: string | null
          tuesday_from?: string | null
          tuesday_to?: string | null
          wednesday_from?: string | null
          wednesday_to?: string | null
          thursday_from?: string | null
          thursday_to?: string | null
          friday_from?: string | null
          friday_to?: string | null
          saturday_from?: string | null
          saturday_to?: string | null
          sunday_from?: string | null
          sunday_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          daily_limit?: number
          enable_daily_limit?: boolean
          enable_schedule?: boolean
          monday_from?: string | null
          monday_to?: string | null
          tuesday_from?: string | null
          tuesday_to?: string | null
          wednesday_from?: string | null
          wednesday_to?: string | null
          thursday_from?: string | null
          thursday_to?: string | null
          friday_from?: string | null
          friday_to?: string | null
          saturday_from?: string | null
          saturday_to?: string | null
          sunday_from?: string | null
          sunday_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          plan_id: string | null
          plan_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          plan_id?: string | null
          plan_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          plan_id?: string | null
          plan_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          collection_id: string
          title: string
          description: string
          url: string
          thumbnail: string | null
          duration: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          title: string
          description: string
          url: string
          thumbnail?: string | null
          duration: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          title?: string
          description?: string
          url?: string
          thumbnail?: string | null
          duration?: number
          created_at?: string
          updated_at?: string
        }
      }
      watch_history: {
        Row: {
          id: string
          profile_id: string
          video_id: string
          watched_at: string
          duration_watched: number
          completed: boolean
        }
        Insert: {
          id?: string
          profile_id: string
          video_id: string
          watched_at?: string
          duration_watched: number
          completed?: boolean
        }
        Update: {
          id?: string
          profile_id?: string
          video_id?: string
          watched_at?: string
          duration_watched?: number
          completed?: boolean
        }
      }
      child_profiles: {
        Row: {
          id: string
          parent_id: string
          name: string
          age: number
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          name: string
          age: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          name?: string
          age?: number
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      video_collections: {
        Row: {
          id: string
          parent_id: string
          child_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          child_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          child_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "user" | "admin" | "superadmin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
