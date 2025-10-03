import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { readFileSync, existsSync } from "fs"
import { basename, join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const prisma = new PrismaClient()

async function checkDatabaseConnection() {
  try {
    await prisma.$connect()
    console.log("✅ Database connection successful")
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error.message)
    return false
  }
}

async function runSQLFile(filePath) {
  try {
    const sql = readFileSync(filePath, "utf8")
    console.log(`📄 Running ${basename(filePath)}...`)

    // Split SQL into individual statements
    const statements = sql
      .split(";")
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith("--"))

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await prisma.$executeRawUnsafe(statement)
        } catch (error) {
          // Skip errors for statements that might already exist (like extensions)
          if (error.message.includes("already exists")) {
            console.log(`⚠️  ${basename(filePath)}: ${error.message}`)
            continue
          }
          throw error
        }
      }
    }

    console.log(`✅ ${basename(filePath)} completed`)
  } catch (error) {
    console.error(`❌ Error running ${filePath}:`, error.message)
    throw error
  }
}

async function setupDatabase() {
  try {
    console.log("🚀 Setting up SafeStream database with Prisma...\n")

    // Check database connection
    const connected = await checkDatabaseConnection()
    if (!connected) {
      process.exit(1)
    }

    // Run Prisma migrations
    console.log("📦 Running Prisma migrations...")
    const { execSync } = await import("child_process")
    
    try {
      execSync("npx prisma migrate dev --name init", { stdio: "inherit" })
      console.log("✅ Prisma migrations completed")
    } catch (error) {
      console.log("⚠️  Migration might have already been applied")
    }

    // Run additional SQL files if they exist
    const scriptsDir = join(__dirname)
    const sqlFiles = ["002-create-policies.sql", "003-seed-data.sql"]

    for (const file of sqlFiles) {
      const filePath = join(scriptsDir, file)
      if (existsSync(filePath)) {
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
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
