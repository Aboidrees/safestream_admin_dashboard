import { NotificationType, Prisma, PrismaClient  } from '@prisma/client'
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
      // Skip tokenSession for now due to client generation issue
      // await prisma.tokenSession.deleteMany()
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

    // Create separate admin
    console.log('👑 Creating admin...')
    
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@safestream.app',
        name: 'Admin User',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        permissions: ['ALL'],
        isActive: true
      }
    })
    console.log('✅ Created admin')

    // Create test users
    console.log('👤 Creating test users...')

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


    // Create main family with two parents and three children
    console.log('👨‍👩‍👧‍👦 Creating main family...')
    const mainFamily = await prisma.family.create({
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

    // Create secondary family for comparison
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

    // Create family members - both parents in main family
    console.log('👥 Creating family members...')
    
    // Parent 1 in main family
    await prisma.familyMember.create({
      data: {
        familyId: mainFamily.id,
        userId: parentUser.id,
        role: 'PARENT',
        permissions: ['MANAGE_CHILDREN', 'VIEW_ANALYTICS', 'MANAGE_CONTENT'],
        isActive: true,
      }
    })

    // Parent 2 in main family
    await prisma.familyMember.create({
      data: {
        familyId: mainFamily.id,
        userId: parentUser2.id,
        role: 'PARENT',
        permissions: ['MANAGE_CHILDREN', 'VIEW_ANALYTICS', 'MANAGE_CONTENT'],
        isActive: true,
      }
    })

    // Parent 2 also in secondary family
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

    // Create three children in the main family
    console.log('👶 Creating child profiles for main family...')

    // Child 1: Emma (8 years old)
    let child1 = await prisma.childProfile.findUnique({
      where: { qrCode: 'QR_EMMA_001' }
    })

    if (!child1) {
      child1 = await prisma.childProfile.create({
        data: {
          familyId: mainFamily.id,
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

    // Child 2: Liam (12 years old)
    let child2 = await prisma.childProfile.findUnique({
      where: { qrCode: 'QR_LIAM_002' }
    })

    if (!child2) {
      child2 = await prisma.childProfile.create({
        data: {
          familyId: mainFamily.id,
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

    // Child 3: Sophia (6 years old)
    let child3 = await prisma.childProfile.findUnique({
      where: { qrCode: 'QR_SOPHIA_003' }
    })

    if (!child3) {
      child3 = await prisma.childProfile.create({
        data: {
          familyId: mainFamily.id,
          name: 'Sophia Smith',
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
        createdBy: admin.id,
        isPublic: true,
      }
    })

    const entertainmentCollection = await prisma.collection.create({
      data: {
        name: 'Family Entertainment',
        description: 'Fun videos for the whole family (Comedy, Adventure, Music)',
        createdBy: admin.id,
        isPublic: true,
      }
    })

    const cartoonsCollection = await prisma.collection.create({
      data: {
        name: 'Cartoons & Animation',
        description: 'Animated content for children (2D, 3D, Stop Motion)',
        createdBy: admin.id,
        isPublic: true,
        ageRating: 0,
        isPlatform: true,
        isMandatory: false,
      }
    })

    const musicCollection = await prisma.collection.create({
      data: {
        name: 'Music & Songs',
        description: 'Educational and fun music videos for children',
        createdBy: admin.id,
        isPublic: true,
        ageRating: 0,
        isPlatform: true,
        isMandatory: false,
      }
    })

    const scienceCollection = await prisma.collection.create({
      data: {
        name: 'Science & Nature',
        description: 'Explore the wonders of science and nature',
        createdBy: admin.id,
        isPublic: true,
        ageRating: 0,
        isPlatform: true,
        isMandatory: false,
      }
    })

    console.log('✅ Created 5 collections')

    // Create videos for all collections
    console.log('🎬 Creating videos for all collections...')
    const videos = [
      // Educational Content videos
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
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      {
        youtubeId: 'alphabet-song-002',
        title: 'ABC Song for Kids',
        description: 'Learn the alphabet with this fun song',
        duration: 180, // 3 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
        channelName: 'Educational Kids',
        ageRating: 'G',
        tags: ['alphabet', 'letters', 'education'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      {
        youtubeId: 'math-addition-003',
        title: 'Basic Addition for Kids',
        description: 'Learn addition with fun examples',
        duration: 420, // 7 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e43d6dd8dca3?w=300&h=200&fit=crop',
        channelName: 'Math for Kids',
        ageRating: 'G',
        tags: ['math', 'addition', 'education'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      
      // Family Entertainment videos
      {
        youtubeId: 'adventure-time-ep1-004',
        title: 'Adventure Time Episode 1',
        description: 'Finn and Jake go on an adventure',
        duration: 1320, // 22 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        channelName: 'Cartoon Network',
        ageRating: 'PG',
        tags: ['adventure', 'fantasy', 'cartoon'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      {
        youtubeId: 'family-comedy-005',
        title: 'Funny Family Moments',
        description: 'Clean comedy for the whole family',
        duration: 600, // 10 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&h=200&fit=crop',
        channelName: 'Family Fun',
        ageRating: 'G',
        tags: ['comedy', 'family', 'fun'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      
      // Cartoons & Animation videos
      {
        youtubeId: 'peppa-pig-ep1-006',
        title: 'Peppa Pig - Muddy Puddles',
        description: 'Peppa loves jumping in muddy puddles',
        duration: 300, // 5 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        channelName: 'Peppa Pig Official',
        ageRating: 'G',
        tags: ['peppa pig', 'cartoon', 'animals'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      {
        youtubeId: 'paw-patrol-ep1-007',
        title: 'PAW Patrol - Pups Save the Day',
        description: 'The PAW Patrol pups help their community',
        duration: 600, // 10 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
        channelName: 'PAW Patrol',
        ageRating: 'G',
        tags: ['paw patrol', 'heroes', 'cartoon'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      
      // Music & Songs videos
      {
        youtubeId: 'disney-songs-008',
        title: 'Disney Songs Collection',
        description: 'Popular Disney songs for children',
        duration: 1800, // 30 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop',
        channelName: 'Disney Music',
        ageRating: 'G',
        tags: ['disney', 'music', 'songs'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      {
        youtubeId: 'nursery-rhymes-009',
        title: 'Classic Nursery Rhymes',
        description: 'Traditional nursery rhymes for toddlers',
        duration: 900, // 15 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=200&fit=crop',
        channelName: 'Kids Music',
        ageRating: 'G',
        tags: ['nursery rhymes', 'toddlers', 'music'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      
      // Science & Nature videos
      {
        youtubeId: 'science-experiments-010',
        title: 'Science Experiments for Kids',
        description: 'Safe science experiments you can do at home',
        duration: 600, // 10 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=300&h=200&fit=crop',
        channelName: 'Science Kids',
        ageRating: 'G',
        tags: ['science', 'experiments', 'learning'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      {
        youtubeId: 'animals-wildlife-011',
        title: 'Amazing Animals Around the World',
        description: 'Learn about different animals and their habitats',
        duration: 720, // 12 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1549366021-9f761d7f8e2f?w=300&h=200&fit=crop',
        channelName: 'Nature Kids',
        ageRating: 'G',
        tags: ['animals', 'nature', 'wildlife'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
      },
      {
        youtubeId: 'space-planets-012',
        title: 'Our Solar System for Kids',
        description: 'Explore the planets in our solar system',
        duration: 480, // 8 minutes
        thumbnailUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=300&h=200&fit=crop',
        channelName: 'Space Kids',
        ageRating: 'G',
        tags: ['space', 'planets', 'solar system'],
        isApproved: true,
        moderationStatus: 'APPROVED',
        moderatedBy: admin.id,
        moderatedAt: new Date(),
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
          data: videoData as Prisma.VideoCreateInput
        })
        console.log(`✅ Created video: ${videoData.title}`)
      } else {
        console.log(`✅ Video already exists: ${videoData.title}`)
      }
      createdVideos.push(video)
    }

    // Add videos to collections - distribute across all 5 collections
    console.log('🔗 Adding videos to collections...')
    
    // Educational Content Collection (3 videos)
    await prisma.collectionVideo.create({
      data: {
        collectionId: educationalCollection.id,
        videoId: createdVideos[0].id, // Learning Numbers 1-10
        orderIndex: 1,
      }
    })
    await prisma.collectionVideo.create({
      data: {
        collectionId: educationalCollection.id,
        videoId: createdVideos[1].id, // ABC Song for Kids
        orderIndex: 2,
      }
    })
    await prisma.collectionVideo.create({
      data: {
        collectionId: educationalCollection.id,
        videoId: createdVideos[2].id, // Basic Addition for Kids
        orderIndex: 3,
      }
    })

    // Family Entertainment Collection (2 videos)
    await prisma.collectionVideo.create({
      data: {
        collectionId: entertainmentCollection.id,
        videoId: createdVideos[3].id, // Adventure Time Episode 1
        orderIndex: 1,
      }
    })
    await prisma.collectionVideo.create({
      data: {
        collectionId: entertainmentCollection.id,
        videoId: createdVideos[4].id, // Funny Family Moments
        orderIndex: 2,
      }
    })

    // Cartoons & Animation Collection (2 videos)
    await prisma.collectionVideo.create({
      data: {
        collectionId: cartoonsCollection.id,
        videoId: createdVideos[5].id, // Peppa Pig - Muddy Puddles
        orderIndex: 1,
      }
    })
    await prisma.collectionVideo.create({
      data: {
        collectionId: cartoonsCollection.id,
        videoId: createdVideos[6].id, // PAW Patrol - Pups Save the Day
        orderIndex: 2,
      }
    })

    // Music & Songs Collection (2 videos)
    await prisma.collectionVideo.create({
      data: {
        collectionId: musicCollection.id,
        videoId: createdVideos[7].id, // Disney Songs Collection
        orderIndex: 1,
      }
    })
    await prisma.collectionVideo.create({
      data: {
        collectionId: musicCollection.id,
        videoId: createdVideos[8].id, // Classic Nursery Rhymes
        orderIndex: 2,
      }
    })

    // Science & Nature Collection (3 videos)
    await prisma.collectionVideo.create({
      data: {
        collectionId: scienceCollection.id,
        videoId: createdVideos[9].id, // Science Experiments for Kids
        orderIndex: 1,
      }
    })
    await prisma.collectionVideo.create({
      data: {
        collectionId: scienceCollection.id,
        videoId: createdVideos[10].id, // Amazing Animals Around the World
        orderIndex: 2,
      }
    })
    await prisma.collectionVideo.create({
      data: {
        collectionId: scienceCollection.id,
        videoId: createdVideos[11].id, // Our Solar System for Kids
        orderIndex: 3,
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
    console.log('\n👨‍👩‍👧‍👦 Main Family: The Smith Family')
    console.log('👥 Parents: John Parent & Jane Smith (both parents in same family)')
    console.log('👶 Children:')
    console.log('• Emma Smith (8 years old) - QR: QR_EMMA_001')
    console.log('• Liam Smith (12 years old) - QR: QR_LIAM_002')
    console.log('• Sophia Smith (6 years old) - QR: QR_SOPHIA_003')
    console.log('\n📚 Collections (5 total):')
    console.log('• Educational Content (3 videos)')
    console.log('• Family Entertainment (2 videos)')
    console.log('• Cartoons & Animation (2 videos)')
    console.log('• Music & Songs (2 videos)')
    console.log('• Science & Nature (3 videos)')
    console.log('\n🎬 Videos: 12 total videos distributed across collections')
    console.log('\n🚀 You can now test the family management with comprehensive data!')

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
