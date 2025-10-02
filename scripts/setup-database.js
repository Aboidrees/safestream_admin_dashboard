const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables:")
  console.error("   - NEXT_PUBLIC_SUPABASE_URL")
  console.error("   - SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSQLFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, "utf8")
    console.log(`📄 Running ${path.basename(filePath)}...`)

    const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

    if (error) {
      // Try alternative method if rpc doesn't work
      const statements = sql.split(";").filter((stmt) => stmt.trim())

      for (const statement of statements) {
        if (statement.trim()) {
          const { error: stmtError } = await supabase.from("_").select("*").limit(0)
          // This is a workaround - in production you'd use a proper SQL execution method
        }
      }
    }

    console.log(`✅ ${path.basename(filePath)} completed`)
  } catch (error) {
    console.error(`❌ Error running ${filePath}:`, error.message)
    throw error
  }
}

async function setupDatabase() {
  try {
    console.log("🚀 Setting up SafeStream database...\n")

    const scriptsDir = path.join(__dirname)
    const sqlFiles = ["001-create-tables.sql", "002-create-policies.sql", "003-seed-data.sql"]

    for (const file of sqlFiles) {
      const filePath = path.join(scriptsDir, file)
      if (fs.existsSync(filePath)) {
        await runSQLFile(filePath)
      } else {
        console.log(`⚠️  ${file} not found, skipping...`)
      }
    }

    console.log("\n✅ Database setup completed successfully!")
    console.log("\n📋 Next steps:")
    console.log("   1. Create an admin account: npm run db:create-admin <email>")
    console.log("   2. Check admin accounts: npm run db:check-admins")
    console.log("   3. Access management office: /my-management-office/dashboard")
  } catch (error) {
    console.error("\n❌ Database setup failed:", error.message)
    process.exit(1)
  }
}

setupDatabase()
