const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing required environment variables")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdmin(email) {
  if (!email) {
    console.error("❌ Please provide an email address")
    console.log("Usage: npm run db:create-admin <email>")
    process.exit(1)
  }

  try {
    console.log(`🔍 Looking for user with email: ${email}`)

    // First, check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()

    if (authError) {
      throw authError
    }

    const authUser = authUsers.users.find((user) => user.email === email)

    if (!authUser) {
      console.error(`❌ User with email ${email} not found in authentication system`)
      console.log("💡 The user must first register on the platform before being made an admin")
      process.exit(1)
    }

    console.log(`✅ Found user: ${authUser.email}`)

    // Check if user exists in our users table
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single()

    if (userError && userError.code !== "PGRST116") {
      throw userError
    }

    // Create user record if it doesn't exist
    if (!existingUser) {
      console.log("📝 Creating user record...")
      const { error: insertUserError } = await supabase.from("users").insert({
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || null,
      })

      if (insertUserError) {
        throw insertUserError
      }
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
      console.log(`⚠️  User ${email} is already an admin with role: ${existingAdmin.role}`)

      if (!existingAdmin.is_active) {
        console.log("🔄 Reactivating admin account...")
        const { error: updateError } = await supabase
          .from("admins")
          .update({ is_active: true })
          .eq("user_id", authUser.id)

        if (updateError) {
          throw updateError
        }
        console.log("✅ Admin account reactivated")
      }
      return
    }

    // Create admin record
    console.log("👑 Creating admin account...")

    const adminData = {
      user_id: authUser.id,
      role: "super_admin",
      permissions: {
        users: ["read", "write", "delete"],
        families: ["read", "write", "delete"],
        content: ["read", "write", "moderate", "delete"],
        collections: ["read", "write", "delete"],
        videos: ["read", "write", "moderate", "delete"],
        system: ["read", "write", "admin"],
        analytics: ["read"],
        security: ["read", "write"],
      },
      is_active: true,
      token_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }

    const { error: createError } = await supabase.from("admins").insert(adminData)

    if (createError) {
      throw createError
    }

    console.log("✅ Admin account created successfully!")
    console.log(`📧 Email: ${email}`)
    console.log(`👑 Role: super_admin`)
    console.log(`🔐 Management Office: /my-management-office/dashboard`)
    console.log(`⏰ Token expires: ${new Date(adminData.token_expires_at).toLocaleString()}`)
  } catch (error) {
    console.error("❌ Error creating admin:", error.message)
    process.exit(1)
  }
}

const email = process.argv[2]
createAdmin(email)
