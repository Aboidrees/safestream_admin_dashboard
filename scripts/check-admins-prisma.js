import "dotenv/config"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function checkAdmins() {
  try {
    console.log("🔍 Checking admin accounts...\n")

    const admins = await prisma.admin.findMany({
      include: {
        user: {
          select: {
            email: true,
            fullName: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    if (!admins || admins.length === 0) {
      console.log("❌ No admin accounts found")
      console.log('💡 Run "npm run db:create-admin <email>" to create an admin account')
      return
    }

    console.log(`✅ Found ${admins.length} admin account(s):\n`)

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.user?.email || "Unknown email"}`)
      console.log(`   Role: ${admin.role}`)
      console.log(`   Status: ${admin.isActive ? "🟢 Active" : "🔴 Inactive"}`)
      console.log(`   Last Login: ${admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "Never"}`)
      console.log(`   Created: ${new Date(admin.createdAt).toLocaleString()}`)
      console.log("")
    })

    console.log("🔐 Management Office URL: /my-management-office/dashboard")
  } catch (error) {
    console.error("❌ Error checking admins:", error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmins()
