# SafeStream Platform

A comprehensive family-friendly video streaming platform with advanced parental controls, content curation, and real-time monitoring capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 13+
- pnpm (recommended) or npm

### 1. Environment Setup

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/safestream_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# JWT Secret (for jose library)
JWT_SECRET="your-jwt-secret-key-here"

# Environment
NODE_ENV="development"
```

### 2. Installation & Setup

```bash
# Install dependencies
pnpm install

# Generate Prisma client
pnpm run db:generate

# Run database migrations
pnpm run db:migrate

# Seed the database with test data
pnpm run db:seed

# Start development server
pnpm run dev
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with JWT (jose)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Lucide React

### Project Structure
```
safestream_platform/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── (admin)/           # Admin dashboard pages
│   └── globals.css        # Global styles
├── lib/                   # Shared utilities
│   ├── types.ts          # Unified type definitions
│   ├── prisma.ts         # Database client
│   ├── auth.ts           # NextAuth configuration
│   └── jwt.ts            # JWT utilities
├── components/            # Reusable UI components
├── prisma/               # Database schema & migrations
└── scripts/              # Database scripts
```

## 🔐 Authentication & Security

### Security Features
- **Rate Limiting**: 1000 requests/15min (dev), 50 auth requests/15min
- **Security Headers**: XSS, CSRF, Clickjacking protection
- **JWT Validation**: Using jose library for secure token handling
- **Admin Protection**: Role-based access control
- **CORS Protection**: Configured for API routes

### Test Accounts
After seeding, use these accounts:

**Admin Account**
- Email: `admin@safestream.com`
- Password: `password123`
- Access: Full admin dashboard

**Parent Accounts**
- Email: `parent@safestream.com` / `jane@safestream.com`
- Password: `password123`
- Access: Parent dashboard with family management

## 📊 Admin Dashboard Features

### Core Pages
- **Overview** (`/`) - Platform statistics and health metrics
- **Users** (`/users`) - User management and role assignment
- **Families** (`/families`) - Family group management
- **Children** (`/children`) - Child profile management with QR codes
- **Collections** (`/collections`) - Content collection management
- **Videos** (`/videos`) - Video content management
- **Reports** (`/reports`) - Analytics and reporting
- **Settings** (`/settings`) - System configuration

### Key Features
- **Real-time Statistics**: Live platform metrics and growth trends
- **User Management**: Complete user lifecycle management
- **Content Curation**: Collection and video management
- **Screen Time Control**: Time limits and monitoring
- **Remote Control**: Device management and commands
- **Notifications**: System-wide notification management

## 🗄️ Database Schema

### Core Models
- **User**: User accounts and authentication
- **Admin**: Admin privileges and permissions
- **Family**: Family groups and membership
- **ChildProfile**: Child accounts with QR codes
- **Collection**: Content collections
- **Video**: Video content with metadata
- **WatchHistory**: Viewing history tracking
- **ScreenTime**: Usage monitoring
- **DeviceSession**: Device management
- **RemoteCommand**: Remote control commands
- **Notification**: User notifications

### Key Features
- **UUID Primary Keys**: Secure, non-sequential identifiers
- **Comprehensive Relations**: Proper foreign key relationships
- **JSON Fields**: Flexible data storage for settings/preferences
- **Proper Indexing**: Optimized query performance
- **Timestamps**: Automatic created/updated tracking
- **Enums**: Type-safe constrained values

## 🛠️ Available Scripts

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
pnpm run db:reset        # Reset database

# Code Quality
pnpm run lint            # Run ESLint
```

## 🧪 Testing

### Login Flow Testing
1. Navigate to `http://localhost:3000/login`
2. Use test accounts above
3. Admin users → Admin dashboard
4. Regular users → Parent dashboard

### Sample Data
The seed script creates:
- 3 test users (1 admin, 2 parents)
- 2 families with different settings
- 3 child profiles with QR codes
- 3 collections (Educational, Entertainment, Cartoons)
- 4 sample videos with metadata
- Watch history and screen time records
- Notifications and favorites

## 🔧 Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: Application URL
- `NEXTAUTH_SECRET`: NextAuth secret key
- `JWT_SECRET`: JWT signing secret
- `NODE_ENV`: Environment mode

### Database Configuration
- **Provider**: PostgreSQL
- **ORM**: Prisma
- **Migrations**: Version-controlled schema changes
- **Seeding**: Automated test data population

## 🚨 Troubleshooting

### Common Issues
1. **Database Connection**: Verify PostgreSQL is running and DATABASE_URL is correct
2. **Authentication**: Check NEXTAUTH_SECRET and JWT_SECRET are set
3. **Build Errors**: Run `pnpm run db:generate` after schema changes
4. **Type Errors**: Ensure all dependencies are installed

### Development Tips
- Use Prisma Studio for database inspection
- Check browser console for client-side errors
- Monitor server logs for API issues
- Use TypeScript for better development experience

## 📈 Monitoring & Logging

- **Security Events**: All authentication attempts logged
- **Rate Limiting**: Violations tracked and reported
- **Admin Access**: All admin actions monitored
- **Error Tracking**: Comprehensive error logging

## 🎨 Design System

### Colors
- **Primary**: Blue to Purple gradient (#3b82f6 to #9333ea)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)

### Typography
- **Font**: System font stack
- **Headers**: Bold, large sizing
- **Body**: Regular weight, readable sizes

## 📚 Documentation

- **API Documentation**: Available in `/api` routes
- **Type Definitions**: Centralized in `lib/types.ts`
- **Database Schema**: Defined in `prisma/schema.prisma`
- **Component Library**: Reusable UI components in `components/`

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use ESLint for code quality
3. Write comprehensive tests
4. Update documentation for new features
5. Follow the established project structure

## 📄 License

This project is proprietary software. All rights reserved.

---

**Ready to start developing! 🎉**

For detailed implementation guides, see the individual markdown files in the project root.
