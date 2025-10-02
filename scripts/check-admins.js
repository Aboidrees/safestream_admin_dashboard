import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAdmins() {
  try {
    console.log("🔍 Checking for admin users...")

    // Get all admin users with their details
    const { data: admins, error } = await supabase.from("admins").select(`
        *,
        users!inner(email, name)
      `)

    if (error) {
      throw error
    }

    if (admins.length === 0) {
      console.log("❌ No admin users found")
      console.log("")
      console.log("To create an admin user:")
      console.log("1. Register a user account first")
      console.log("2. Run: npm run db:create-admin user@example.com")
      console.log("3. Or visit /admin-setup after logging in")
    } else {
      console.log(`✅ Found ${admins.length} admin user(s):`)
      console.log("")
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.users.name} (${admin.users.email})`)
        console.log(`   Role: ${admin.role}`)
        console.log(`   Created: ${new Date(admin.created_at).toLocaleDateString()}`)
        console.log("")
      })
    }
  } catch (error) {
    console.error("Error checking admins:", error.message)
  }
}

checkAdmins()
