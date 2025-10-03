import { NotificationType, PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  try {
    // Clear existing data (in development only)
    if (process.env.NODE_ENV === 'development') {
      console.log('🧹 Clearing existing data...')
      await prisma.tokenSession.deleteMany()
      await prisma.deviceSession.deleteMany()
      await prisma.remoteCommand.deleteMany()
      await prisma.notification.deleteMany()
      await prisma.screenTime.deleteMany()
      await prisma.favorite.deleteMany()
      await prisma.watchHistory.deleteMany()
      await prisma.collectionVideo.deleteMany()
      await prisma.video.deleteMany()
      await prisma.collection.deleteMany()
      await prisma.childProfile.deleteMany()
      await prisma.familyMember.deleteMany()
      await prisma.family.deleteMany()
      await prisma.admin.deleteMany()
      await prisma.session.deleteMany()
      await prisma.account.deleteMany()
      await prisma.verificationToken.deleteMany()
      await prisma.user.deleteMany()
    }

    // Create test users
    console.log('👤 Creating test users...')

    const hashedPassword = await bcrypt.hash('password123', 12)

    // Check if users already exist, if not create them
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
      console.log('✅ Created parent user 1')
    } else {
      console.log('✅ Parent user 1 already exists')
    }

    let parentUser2 = await prisma.user.findUnique({
      where: { email: 'jane@safestream.app' }
    })

    if (!parentUser2) {
      parentUser2 = await prisma.user.create({
        data: {
          email: 'jane@safestream.app',
          name: 'Jane Smith',
          password: hashedPassword,
          emailVerified: new Date(),
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        }
      })
      console.log('✅ Created parent user 2')
    } else {
      console.log('✅ Parent user 2 already exists')
    }

    // Create admin
    console.log('👑 Creating admin...')
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

    // Create families
    console.log('👨‍👩‍👧‍👦 Creating families...')
    const family1 = await prisma.family.create({
      data: {
        name: 'The Smith Family',
        createdBy: parentUser.id,
        settings: {
          defaultScreenTimeLimit: 120, // 2 hours
          allowUnrestrictedAccess: false,
          requireParentApproval: true,
        }
      }
    })

    const family2 = await prisma.family.create({
      data: {
        name: 'The Johnson Family',
        createdBy: parentUser2.id,
        settings: {
          defaultScreenTimeLimit: 90, // 1.5 hours
          allowUnrestrictedAccess: false,
          requireParentApproval: true,
        }
      }
    })

    // Create family members
    console.log('👥 Creating family members...')
    await prisma.familyMember.create({
      data: {
        familyId: family1.id,
        userId: parentUser.id,
        role: 'PARENT',
        permissions: ['MANAGE_CHILDREN', 'VIEW_ANALYTICS', 'MANAGE_CONTENT'],
        isActive: true,
      }
    })

    await prisma.familyMember.create({
      data: {
        familyId: family2.id,
        userId: parentUser2.id,
        role: 'PARENT',
        permissions: ['MANAGE_CHILDREN', 'VIEW_ANALYTICS', 'MANAGE_CONTENT'],
        isActive: true,
      }
    })

    // Create child profiles
    console.log('👶 Creating child profiles...')

    // Check if child profiles already exist
    let child1 = await prisma.childProfile.findUnique({
      where: { qrCode: 'QR_EMMA_001' }
    })

    if (!child1) {
      child1 = await prisma.childProfile.create({
        data: {
          familyId: family1.id,
          name: 'Emma Smith',
          age: 8,
          avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
          contentRestrictions: {
            favoriteGenres: ['Educational', 'Cartoons', 'Music'],
            restrictedContent: ['Violence', 'Horror'],
            language: 'en',
          },
          screenTimeLimits: {
            daily: 120, // 2 hours
            weekly: 840, // 14 hours
            bedtime: '20:00',
            wakeTime: '07:00',
          },
          qrCode: 'QR_EMMA_001',
          qrCodeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          isActive: true,
        }
      })
      console.log('✅ Created child profile 1 (Emma)')
    } else {
      console.log('✅ Child profile 1 (Emma) already exists')
    }

    let child2 = await prisma.childProfile.findUnique({
      where: { qrCode: 'QR_LIAM_002' }
    })

    if (!child2) {
      child2 = await prisma.childProfile.create({
        data: {
          familyId: family1.id,
          name: 'Liam Smith',
          age: 12,
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          contentRestrictions: {
            favoriteGenres: ['Action', 'Comedy', 'Sports'],
            restrictedContent: ['Horror'],
            language: 'en',
          },
          screenTimeLimits: {
            daily: 150, // 2.5 hours
            weekly: 1050, // 17.5 hours
            bedtime: '21:00',
            wakeTime: '07:00',
          },
          qrCode: 'QR_LIAM_002',
          qrCodeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          isActive: true,
        }
      })
      console.log('✅ Created child profile 2 (Liam)')
    } else {
      console.log('✅ Child profile 2 (Liam) already exists')
    }

    let child3 = await prisma.childProfile.findUnique({
      where: { qrCode: 'QR_SOPHIA_003' }
    })

    if (!child3) {
      child3 = await prisma.childProfile.create({
        data: {
          familyId: family2.id,
          name: 'Sophia Johnson',
          age: 6,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
          contentRestrictions: {
            favoriteGenres: ['Educational', 'Cartoons', 'Music'],
            restrictedContent: ['Violence', 'Horror', 'Mature'],
            language: 'en',
          },
          screenTimeLimits: {
            daily: 90, // 1.5 hours
            weekly: 630, // 10.5 hours
            bedtime: '19:30',
            wakeTime: '07:00',
          },
          qrCode: 'QR_SOPHIA_003',
          qrCodeExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          isActive: true,
        }
      })
      console.log('✅ Created child profile 3 (Sophia)')
    } else {
      console.log('✅ Child profile 3 (Sophia) already exists')
    }

    // Create collections
    console.log('📚 Creating collections...')
    const educationalCollection = await prisma.collection.create({
      data: {
        name: 'Educational Content',
        description: 'Learning videos for children (Math, Science, History)',
        createdBy: adminUser.id,
        isPublic: true,
      }
    })

    const entertainmentCollection = await prisma.collection.create({
      data: {
        name: 'Family Entertainment',
        description: 'Fun videos for the whole family (Comedy, Adventure, Music)',
        createdBy: adminUser.id,
        isPublic: true,
      }
    })

    const cartoonsCollection = await prisma.collection.create({
      data: {
        name: 'Cartoons & Animation',
        description: 'Animated content for children (2D, 3D, Stop Motion)',
        createdBy: adminUser.id,
        isPublic: true,
      }
    })

    // Create videos
    console.log('🎬 Creating videos...')
    const videos = [
      {
        youtubeId: 'numbers-1-10-001',
        title: 'Learning Numbers 1-10',
        description: 'Fun educational video teaching numbers',
        duration: 300, // 5 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=300&h=200&fit=crop',
        channelName: 'Educational Kids',
        ageRating: 'G',
        tags: ['numbers', 'counting', 'education'],
        isApproved: true,
      },
      {
        youtubeId: 'adventure-time-ep1-002',
        title: 'Adventure Time Episode 1',
        description: 'Finn and Jake go on an adventure',
        duration: 1320, // 22 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        channelName: 'Cartoon Network',
        ageRating: 'PG',
        tags: ['adventure', 'fantasy', 'cartoon'],
        isApproved: true,
      },
      {
        youtubeId: 'science-experiments-003',
        title: 'Science Experiments for Kids',
        description: 'Safe science experiments you can do at home',
        duration: 600, // 10 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=200&fit=crop',
        channelName: 'Science Kids',
        ageRating: 'G',
        tags: ['science', 'experiments', 'learning'],
        isApproved: true,
      },
      {
        youtubeId: 'disney-songs-004',
        title: 'Disney Songs Collection',
        description: 'Popular Disney songs for children',
        duration: 1800, // 30 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
        channelName: 'Disney Music',
        ageRating: 'G',
        tags: ['disney', 'music', 'songs'],
        isApproved: true,
      }
    ]

    const createdVideos = []
    for (const videoData of videos) {
      // Check if video already exists
      let video = await prisma.video.findUnique({
        where: { youtubeId: videoData.youtubeId }
      })

      if (!video) {
        video = await prisma.video.create({
          data: videoData
        })
        console.log(`✅ Created video: ${videoData.title}`)
      } else {
        console.log(`✅ Video already exists: ${videoData.title}`)
      }
      createdVideos.push(video)
    }

    // Add videos to collections
    console.log('🔗 Adding videos to collections...')
    await prisma.collectionVideo.create({
      data: {
        collectionId: educationalCollection.id,
        videoId: createdVideos[0].id,
        orderIndex: 1,
      }
    })

    await prisma.collectionVideo.create({
      data: {
        collectionId: cartoonsCollection.id,
        videoId: createdVideos[1].id,
        orderIndex: 1,
      }
    })

    await prisma.collectionVideo.create({
      data: {
        collectionId: educationalCollection.id,
        videoId: createdVideos[2].id,
        orderIndex: 2,
      }
    })

    await prisma.collectionVideo.create({
      data: {
        collectionId: entertainmentCollection.id,
        videoId: createdVideos[3].id,
        orderIndex: 1,
      }
    })

    // Create some favorites
    console.log('⭐ Creating favorites...')
    await prisma.favorite.create({
      data: {
        childProfileId: child1.id,
        videoId: createdVideos[0].id,
        createdAt: new Date(),
      }
    })

    await prisma.favorite.create({
      data: {
        childProfileId: child2.id,
        videoId: createdVideos[1].id,
        createdAt: new Date(),
      }
    })

    // Create watch history
    console.log('📺 Creating watch history...')
    await prisma.watchHistory.create({
      data: {
        childProfileId: child1.id,
        videoId: createdVideos[0].id,
        watchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        watchDuration: 300, // watched full video
        completed: true,
      }
    })

    await prisma.watchHistory.create({
      data: {
        childProfileId: child2.id,
        videoId: createdVideos[1].id,
        watchedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        watchDuration: 660, // watched half
        completed: false,
      }
    })

    // Create screen time records
    console.log('⏰ Creating screen time records...')
    await prisma.screenTime.create({
      data: {
        childProfileId: child1.id,
        date: new Date(),
        totalMinutes: 45, // 45 minutes today
      }
    })

    await prisma.screenTime.create({
      data: {
        childProfileId: child2.id,
        date: new Date(),
        totalMinutes: 90, // 90 minutes today
      } 
    })

    // Create some notifications
    console.log('🔔 Creating notifications...')
    await prisma.notification.create({
      data: {
        userId: parentUser.id,
        type: NotificationType.TIME_LIMIT_EXCEEDED ,
        title: 'Screen Time Limit Reached',
        message: 'Emma has reached her daily screen time limit',
        data: {
          childName: 'Emma',
          timeLimit: 120,
          timeUsed: 120,
        },
        isRead: false,
      }
    })

    await prisma.notification.create({
      data: {
        userId: parentUser.id,
        type: NotificationType.CONTENT_COMPLETED,
        title: 'New Educational Content Available',
        message: 'New educational videos have been added to your child\'s collection',
        data: {
          collectionName: 'Educational Content',
          newVideosCount: 2,
        },
        isRead: true,
      }
    })

    console.log('✅ Database seeding completed successfully!')
    console.log('\n📋 Test Accounts Created:')
    console.log('👑 Admin: admin@safestream.app / password123')
    console.log('👨‍👩‍👧‍👦 Parent 1: parent@safestream.app / password123')
    console.log('👨‍👩‍👧‍👦 Parent 2: jane@safestream.app / password123')
    console.log('\n👶 Child Profiles:')
    console.log('• Emma Smith (8 years old) - QR: QR_EMMA_001')
    console.log('• Liam Smith (12 years old) - QR: QR_LIAM_002')
    console.log('• Sophia Johnson (6 years old) - QR: QR_SOPHIA_003')
    console.log('\n📚 Collections: Educational Content, Family Entertainment, Cartoons & Animation')
    console.log('🎬 Videos: 4 sample videos with different categories')
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
