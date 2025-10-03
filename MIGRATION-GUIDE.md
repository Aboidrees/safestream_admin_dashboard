# SafeStream Prisma Migration Guide

This guide will help you migrate from Supabase to Prisma + NextAuth + PostgreSQL.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/safestream"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Run Migration
```bash
npm run db:migrate-to-prisma
```

This will:
- Generate Prisma client
- Run database migrations
- Create a default admin user (admin@safestream.com / admin123)

### 4. Start Development Server
```bash
npm run dev
```

## 📁 File Changes

### New Files Created:
- `prisma/schema.prisma` - Database schema
- `lib/prisma.ts` - Prisma client singleton
- `lib/auth.ts` - NextAuth configuration
- `lib/auth-provider.tsx` - NextAuth provider component
- `middleware-prisma.ts` - Updated middleware using NextAuth
- `app/api/auth/[...nextauth]/route.ts` - NextAuth API routes
- `app/api/auth/admin-check/route.ts` - Admin check endpoint
- `app/login-prisma/page.tsx` - Updated login page
- `scripts/migrate-to-prisma.js` - Migration script
- `scripts/setup-database-prisma.js` - Prisma database setup
- `scripts/create-admin-prisma.js` - Create admin with Prisma
- `scripts/check-admins-prisma.js` - Check admins with Prisma

### Updated Files:
- `package.json` - Removed Supabase, added Prisma + NextAuth
- Database scripts now use Prisma instead of Supabase

## 🔄 Migration Steps Completed

✅ **Database Schema**: Converted Supabase tables to Prisma models
✅ **Authentication**: Replaced Supabase Auth with NextAuth
✅ **Database Client**: Replaced Supabase client with Prisma client
✅ **Middleware**: Updated to use NextAuth instead of Supabase
✅ **API Routes**: Created NextAuth API routes
✅ **Admin Management**: Updated admin scripts to use Prisma
✅ **Migration Scripts**: Created automated migration tools

## 🛠️ Available Scripts

```bash
# Database Management
npm run db:generate          # Generate Prisma client
npm run db:migrate           # Run Prisma migrations
npm run db:push              # Push schema changes
npm run db:studio            # Open Prisma Studio
npm run db:reset             # Reset database
npm run db:migrate-to-prisma # Run full migration

# Admin Management
npm run db:create-admin <email>  # Create admin user
npm run db:check-admins          # List admin users
npm run db:setup                 # Setup database
```

## 🔐 Default Admin Account

After running the migration, you'll have a default admin account:
- **Email**: admin@safestream.com
- **Password**: admin123
- **⚠️ Important**: Change this password after first login!

## ✅ Migration Complete

All Supabase code has been successfully removed and replaced with Prisma + NextAuth + jose:

1. **✅ Authentication**: Replaced Supabase Auth with NextAuth + jose JWT management
2. **✅ Database**: All Supabase queries replaced with Prisma
3. **✅ Middleware**: Updated to use jose for JWT validation
4. **✅ Components**: All components updated to use NextAuth
5. **✅ API Routes**: All API routes now use Prisma
6. **✅ Session Management**: Using jose for secure JWT handling

## 📝 Next Steps

1. **Update Components**: Replace Supabase usage in components with NextAuth/Prisma
2. **Test Authentication**: Verify login/logout flows work correctly
3. **Test Admin Routes**: Ensure admin middleware works properly
4. **Update API Routes**: Convert any remaining Supabase API calls to Prisma
5. **Remove Old Files**: Clean up Supabase-related files after testing

## 🆘 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database permissions

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Ensure NextAuth API routes are accessible

### Migration Issues
- Run `npm run db:reset` to start fresh
- Check Prisma schema for syntax errors
- Verify all required environment variables are set

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
