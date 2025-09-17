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

async function createAdmin(email) {
  try {
    console.log(`Creating admin user for email: ${email}`)

    // First, find the user in auth.users by email
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      throw authError
    }

    const authUser = authUsers.users.find((user) => user.email === email)

    if (!authUser) {
      console.log("❌ User not found in authentication system.")
      console.log("Please make sure the user is registered first.")
      return
    }

    // Check if user is already an admin
    const { data: existingAdmin, error: adminCheckError } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", authUser.id)
      .single()

    if (adminCheckError && adminCheckError.code !== "PGRST116") {
      throw adminCheckError
    }

    if (existingAdmin) {
      console.log("⚠️ User is already an admin")
      console.log(`Role: ${existingAdmin.role}`)
      return
    }

    // Create admin record
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .insert([
        {
          user_id: authUser.id,
          role: "super_admin",
        },
      ])
      .select()
      .single()

    if (adminError) {
      throw adminError
    }

    console.log("✅ Successfully created admin user!")
    console.log(`User: ${authUser.user_metadata?.name || authUser.email} (${authUser.email})`)
    console.log(`Role: ${admin.role}`)
    console.log(`Admin ID: ${admin.id}`)
  } catch (error) {
    console.error("❌ Failed to create admin:", error.message)

    if (error.message.includes("foreign key constraint")) {
      console.log("")
      console.log("💡 This usually means:")
      console.log("1. The user hasn't registered yet, or")
      console.log("2. The database tables haven't been created")
      console.log("")
      console.log("Try:")
      console.log("1. Make sure the user has registered an account")
      console.log("2. Run: npm run db:setup")
    }
  }
}

// Get email from command line arguments
const email = process.argv[2]

if (!email) {
  console.error("Please provide an email address")
  console.log("Usage: node scripts/create-admin.js user@example.com")
  process.exit(1)
}

createAdmin(email)
