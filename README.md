# SafeStream Admin Dashboard

A comprehensive admin platform for managing the SafeStream family-friendly video streaming platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- pnpm (recommended)

### Installation
```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Generate Prisma client
pnpm run db:generate

# Run database migrations
pnpm run db:migrate

# Start development server
pnpm run dev
```

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT

## 📊 Features

### Core Management
- **User Management**: Complete user lifecycle management
- **Family Management**: Family groups and membership control
- **Child Profiles**: Child account management with QR codes
- **Content Curation**: Collection and video management
- **Analytics**: Platform statistics and reporting

### Admin Controls
- **Role Management**: Admin, moderator, and user roles
- **Content Moderation**: Video approval and management
- **System Monitoring**: Platform health and performance
- **Security Management**: Authentication and access control

## 🔧 Available Scripts

```bash
# Development
pnpm run dev              # Start development server
pnpm run build           # Build for production
pnpm run start           # Start production server

# Database
pnpm run db:generate     # Generate Prisma client
pnpm run db:migrate      # Run database migrations
pnpm run db:push         # Push schema changes
pnpm run db:seed         # Seed with test data
pnpm run db:studio       # Open Prisma Studio

# Code Quality
pnpm run lint            # Run ESLint
pnpm run type-check      # Run TypeScript checks
```

## 🔐 Authentication

### Test Accounts
After seeding the database:
- **Admin**: `admin@safestream.com` / `password123`
- **Parent**: `parent@safestream.com` / `password123`

### Security Features
- JWT-based authentication
- Role-based access control
- Rate limiting protection
- Security headers implementation

## 📁 Project Structure

```
admin_dashboard/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (admin)/           # Admin pages
│   └── globals.css        # Global styles
├── lib/                   # Shared utilities
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── types.ts          # Type definitions
├── components/            # Reusable UI components
├── prisma/               # Database schema & migrations
└── public/               # Static assets
```

## 🗄️ Database Schema

### Key Models
- **Admin**: Admin user accounts
- **User**: Regular user accounts
- **Family**: Family groups
- **ChildProfile**: Child accounts
- **Collection**: Content collections
- **Video**: Video content
- **WatchHistory**: Viewing history
- **ScreenTime**: Usage tracking
- **DeviceSession**: Device management
- **RemoteCommand**: Remote control
- **Notification**: User notifications

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### User Management
- `GET /api/users` - List all users
- `GET /api/users/{id}` - Get user details
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Family Management
- `GET /api/families` - List families
- `POST /api/families` - Create family
- `GET /api/families/{id}` - Get family details
- `PUT /api/families/{id}` - Update family
- `DELETE /api/families/{id}` - Delete family

### Content Management
- `GET /api/collections` - List collections
- `POST /api/collections` - Create collection
- `GET /api/videos` - List videos
- `POST /api/videos` - Add video

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
```

### Environment Variables
```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://admin.safestream.app"
NEXTAUTH_SECRET="your-secret"
JWT_SECRET="your-jwt-secret"
NODE_ENV="production"
```

## 🧪 Testing

### Manual Testing
1. Navigate to `http://localhost:3000/login`
2. Use test admin account
3. Verify all admin features work correctly

### Test Data
The seed script creates:
- 1 admin user
- 2 parent users
- 2 families with children
- Sample collections and videos
- Watch history and screen time data

## 🔧 Configuration

### Prisma Configuration
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x"]
}
```

### Next.js Configuration
```javascript
// next.config.mjs
export default {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin())
    }
    return config
  }
}
```

## 📚 Documentation

- **API Documentation**: Available in `/api` routes
- **Component Library**: Reusable UI components
- **Database Schema**: Defined in `prisma/schema.prisma`
- **Type Definitions**: Centralized in `lib/types.ts`

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use ESLint for code quality
3. Write comprehensive tests
4. Update documentation for new features
5. Follow the established project structure

## 📄 License

This project is proprietary software. All rights reserved.

---

**Ready to manage SafeStream! 🎉**

For detailed API documentation, see [docs/api-reference.md](../docs/api-reference.md)