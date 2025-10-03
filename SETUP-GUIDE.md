# SafeStream Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the project root with the following variables:

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

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with test data
npm run db:seed
```

### 3. Start Development Server

```bash
npm run dev
```

## 🧪 Test Accounts

After running the seed script, you can test with these accounts:

### Admin Account
- **Email**: admin@safestream.com
- **Password**: password123
- **Access**: Full admin dashboard

### Parent Accounts
- **Email**: parent@safestream.com
- **Password**: password123
- **Access**: Parent dashboard with family management

- **Email**: jane@safestream.com
- **Password**: password123
- **Access**: Parent dashboard

### Child Profiles
- **Emma Smith** (8 years old) - QR Code: QR_EMMA_001
- **Liam Smith** (12 years old) - QR Code: QR_LIAM_002
- **Sophia Johnson** (6 years old) - QR Code: QR_SOPHIA_003

## 📚 Sample Data

The seed script creates:
- 3 test users (1 admin, 2 parents)
- 2 families with different settings
- 3 child profiles with age-appropriate content
- 3 collections (Educational, Entertainment, Cartoons)
- 4 sample videos with different categories
- Watch history and screen time records
- Notifications and favorites

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with test data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database and run migrations

## 🚨 Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check DATABASE_URL format
3. Verify database exists
4. Check user permissions

### Authentication Issues
1. Verify NEXTAUTH_SECRET is set
2. Check JWT_SECRET is configured
3. Ensure all environment variables are loaded

### Build Issues
1. Run `npm run db:generate` after schema changes
2. Check for TypeScript errors
3. Verify all dependencies are installed

## 📱 Testing the Login Flow

1. Navigate to `http://localhost:3000/dashboard/login`
2. Use any of the test accounts above
3. Admin users will be redirected to `/dashboard/my-management-office`
4. Regular users will be redirected to `/dashboard`
5. Test the registration flow at `/dashboard/register`

## 🔐 Security Features

The middleware includes:
- Rate limiting (100 requests/15min, 5 auth requests/15min)
- Security headers (XSS, CSRF, Clickjacking protection)
- JWT validation with jose library
- Admin route protection
- CORS protection
- Comprehensive error handling

## 📊 Monitoring

- All security events are logged
- Rate limit violations are tracked
- Authentication failures are monitored
- Admin access attempts are recorded

---

**Ready to start developing! 🎉**
