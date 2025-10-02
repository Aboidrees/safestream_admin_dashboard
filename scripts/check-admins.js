const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkAdmins() {
  try {
    console.log("🔍 Checking admin accounts...\n")

    const { data: admins, error } = await supabase
      .from("admins")
      .select(`
        id,
        role,
        is_active,
        last_login,
        created_at,
        users:user_id (
          email,
          full_name
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      throw error
    }

    if (!admins || admins.length === 0) {
      console.log("❌ No admin accounts found")
      console.log('💡 Run "npm run db:create-admin <email>" to create an admin account')
      return
    }

    console.log(`✅ Found ${admins.length} admin account(s):\n`)

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.users?.email || "Unknown email"}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Status: ${admin.is_active ? "🟢 Active" : "🔴 Inactive"}`)
      console.log(`   Last Login: ${admin.last_login ? new Date(admin.last_login).toLocaleString() : "Never"}`)
      console.log(`   Created: ${new Date(admin.created_at).toLocaleString()}`)
      console.log("")
    })

    console.log("🔐 Management Office URL: /my-management-office/dashboard")
  } catch (error) {
    console.error("❌ Error checking admins:", error.message)
    process.exit(1)
  }
}

checkAdmins()
