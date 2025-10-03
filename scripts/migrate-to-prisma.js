import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function migrateToPrisma() {
  try {
    console.log("🚀 Starting migration to Prisma...\n")

    // Generate Prisma client
    console.log("📦 Generating Prisma client...")
    const { execSync } = await import("child_process")
    execSync("npx prisma generate", { stdio: "inherit" })

    // Run migrations
    console.log("📦 Running Prisma migrations...")
    execSync("npx prisma migrate dev --name init", { stdio: "inherit" })

    // Create a default admin user if none exists
    console.log("👑 Checking for admin users...")
    const adminCount = await prisma.admin.count()
    
    if (adminCount === 0) {
      console.log("📝 Creating default admin user...")
      
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 12)
      
      const adminUser = await prisma.user.create({
        data: {
          email: "admin@safestream.com",
          name: "SafeStream Admin",
          password: hashedPassword,
          emailVerified: new Date(),
        }
      })

      await prisma.admin.create({
        data: {
          userId: adminUser.id,
          role: "SUPER_ADMIN",
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
          isActive: true,
          tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        }
      })

      console.log("✅ Default admin created:")
      console.log("   Email: admin@safestream.com")
      console.log("   Password: admin123")
      console.log("   ⚠️  Please change the password after first login!")
    } else {
      console.log(`✅ Found ${adminCount} existing admin(s)`)
    }

    console.log("\n✅ Migration to Prisma completed successfully!")
    console.log("\n📋 Next steps:")
    console.log("   1. Update your .env file with DATABASE_URL")
    console.log("   2. Install dependencies: npm install")
    console.log("   3. Start the development server: npm run dev")
    console.log("   4. Access management office: /my-management-office/dashboard")

  } catch (error) {
    console.error("\n❌ Migration failed:", error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

migrateToPrisma()
