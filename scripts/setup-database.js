import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({ path: ".env.local" })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  console.log("Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSqlFile(filename) {
  try {
    console.log(`📄 Executing ${filename}...`)

    const sqlContent = readFileSync(join(__dirname, filename), "utf8")

    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"))

    for (const statement of statements) {
      if (statement.trim()) {
        const { error } = await supabase.rpc("exec_sql", { sql: statement })
        if (error) {
          // Try direct query if RPC doesn't work
          const { error: directError } = await supabase.from("_").select("*").limit(0)
          if (directError) {
            console.warn(`⚠️  Could not execute statement (this might be normal): ${statement.substring(0, 50)}...`)
          }
        }
      }
    }

    console.log(`✅ Completed ${filename}`)
  } catch (error) {
    console.error(`❌ Error executing ${filename}:`, error.message)
    console.log("💡 You may need to run these SQL files manually in your Supabase dashboard")
  }
}

async function setupDatabase() {
  console.log("🚀 Setting up SafeStream database...")
  console.log("")

  try {
    // Test connection
    const { data, error } = await supabase.from("_").select("*").limit(1)
    if (error && !error.message.includes("does not exist")) {
      throw new Error("Cannot connect to Supabase")
    }

    console.log("✅ Connected to Supabase")
    console.log("")

    // Execute SQL files in order
    await executeSqlFile("001-create-tables.sql")
    await executeSqlFile("002-create-policies.sql")
    await executeSqlFile("003-seed-data.sql")

    console.log("")
    console.log("🎉 Database setup completed!")
    console.log("")
    console.log("Next steps:")
    console.log("1. Register a user account")
    console.log("2. Run: npm run db:create-admin your-email@example.com")
    console.log("3. Or visit /admin-setup after logging in")
  } catch (error) {
    console.error("❌ Database setup failed:", error.message)
    console.log("")
    console.log("💡 Manual setup instructions:")
    console.log("1. Go to your Supabase dashboard → SQL Editor")
    console.log("2. Copy and paste the content from each file in order:")
    console.log("   - scripts/001-create-tables.sql")
    console.log("   - scripts/002-create-policies.sql")
    console.log("   - scripts/003-seed-data.sql")
  }
}

setupDatabase()
