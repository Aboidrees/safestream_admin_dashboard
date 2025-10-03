import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateAdminData() {
  try {
    console.log('🔄 Starting admin data migration...')
    
    // Get existing admin data with user information
    const existingAdmins = await prisma.admin.findMany({
      include: {
        user: true
      }
    })
    
    console.log(`📊 Found ${existingAdmins.length} existing admin records`)
    
    for (const admin of existingAdmins) {
      if (admin.user) {
        console.log(`🔄 Migrating admin: ${admin.user.email}`)
        
        // Update admin with user data
        await prisma.admin.update({
          where: { id: admin.id },
          data: {
            email: admin.user.email,
            name: admin.user.name || 'Admin',
            password: admin.user.password || 'temp_password_123',
            // Remove the user_id field by setting it to null first
            userId: null
          }
        })
        
        console.log(`✅ Migrated admin: ${admin.user.email}`)
      }
    }
    
    console.log('🎉 Admin data migration completed!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

migrateAdminData()
