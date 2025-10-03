import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting simple database seeding...')

  try {
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    // Create admin user if not exists
    let adminUser = await prisma.user.findUnique({
      where: { email: 'admin@safestream.app' }
    })
    
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@safestream.app',
          name: 'Admin User',
          password: hashedPassword,
          emailVerified: new Date(),
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        }
      })
      console.log('✅ Created admin user')
    } else {
      console.log('✅ Admin user already exists')
    }

    // Create admin record if not exists
    let admin = await prisma.admin.findFirst({
      where: { userId: adminUser.id }
    })
    
    if (!admin) {
      admin = await prisma.admin.create({
        data: {
          userId: adminUser.id,
          role: 'SUPER_ADMIN',
          permissions: ['ALL'],
          isActive: true,
        }
      })
      console.log('✅ Created admin record')
    } else {
      console.log('✅ Admin record already exists')
    }

    // Create parent user if not exists
    let parentUser = await prisma.user.findUnique({
      where: { email: 'parent@safestream.app' }
    })
    
    if (!parentUser) {
      parentUser = await prisma.user.create({
        data: {
          email: 'parent@safestream.app',
          name: 'John Parent',
          password: hashedPassword,
          emailVerified: new Date(),
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        }
      })
      console.log('✅ Created parent user')
    } else {
      console.log('✅ Parent user already exists')
    }

    console.log('✅ Simple seeding completed successfully!')
    console.log('\n📋 Test Accounts Created:')
    console.log('👑 Admin: admin@safestream.app / password123')
    console.log('👨‍👩‍👧‍👦 Parent: parent@safestream.app / password123')
    console.log('\n🚀 You can now test the login flow with these accounts!')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
