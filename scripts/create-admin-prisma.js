import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function createAdmin(email) {
  if (!email) {
    console.error("❌ Please provide an email address")
    console.log("Usage: npm run db:create-admin <email>")
    process.exit(1)
  }

  try {
    console.log(`🔍 Looking for user with email: ${email}`)

    // Check if user exists in our users table
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (!existingUser) {
      console.log("📝 Creating user record...")
      const newUser = await prisma.user.create({
        data: {
          email,
          fullName: null, // Will be updated when user completes profile
        }
      })
      console.log(`✅ Created user: ${newUser.email}`)
    } else {
      console.log(`✅ Found existing user: ${existingUser.email}`)
    }

    // Check if user is already an admin
    const existingAdmin = await prisma.admin.findUnique({
      where: { userId: existingUser?.id || (await prisma.user.findUnique({ where: { email } })).id }
    })

    if (existingAdmin) {
      console.log(`⚠️  User ${email} is already an admin with role: ${existingAdmin.role}`)

      if (!existingAdmin.isActive) {
        console.log("🔄 Reactivating admin account...")
        await prisma.admin.update({
          where: { id: existingAdmin.id },
          data: { isActive: true }
        })
        console.log("✅ Admin account reactivated")
      }
      return
    }

    // Create admin record
    console.log("👑 Creating admin account...")

    const userId = existingUser?.id || (await prisma.user.findUnique({ where: { email } })).id

    const adminData = {
      userId,
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

    const newAdmin = await prisma.admin.create({
      data: adminData
    })

    console.log("✅ Admin account created successfully!")
    console.log(`📧 Email: ${email}`)
    console.log(`👑 Role: ${newAdmin.role}`)
    console.log(`🔐 Management Office: /my-management-office/dashboard`)
    console.log(`⏰ Token expires: ${newAdmin.tokenExpiresAt.toLocaleString()}`)
  } catch (error) {
    console.error("❌ Error creating admin:", error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

const email = process.argv[2]
createAdmin(email)
