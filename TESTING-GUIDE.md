# SafeStream Testing Guide

## 🧪 Complete Testing Checklist

This guide provides step-by-step instructions for testing all SafeStream features, authentication flows, and API endpoints.

---

## 📋 Pre-Testing Setup

### **1. Environment Setup**

```bash
# 1. Copy environment example
cp env.example .env

# 2. Edit .env and add your values
# Required:
# - DATABASE_URL (PostgreSQL connection string)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - JWT_SECRET (generate with: openssl rand -base64 32)

# 3. Install dependencies
npm install

# 4. Run database migrations
npm run db:migrate

# 5. Seed the database
npm run db:seed
```

### **2. Start Development Server**

```bash
npm run dev
# Server should start at http://localhost:3000
```

---

## 🌐 Website Testing (Public Pages)

### **Test 1: Homepage**
```
URL: http://localhost:3000/
Expected: Landing page with hero, features, how it works
Status: ✅ No authentication required
```

### **Test 2: About Page**
```
URL: http://localhost:3000/about
Expected: About SafeStream information
Status: ✅ No authentication required
```

### **Test 3: All Website Pages**
Test these URLs without authentication:
- ✅ `/blog` - Blog listing
- ✅ `/community` - Community page
- ✅ `/contact-us` - Contact form
- ✅ `/faq` - Frequently asked questions
- ✅ `/help-center` - Help center
- ✅ `/privacy-policy` - Privacy policy
- ✅ `/terms-of-service` - Terms of service

**Expected Result**: All pages load without requiring login

---

## 👨‍👩‍👧‍👦 Parent Dashboard Testing

### **Test 4: Parent Registration**

```
URL: http://localhost:3000/dashboard/register

Steps:
1. Click "Get Started Free" or navigate to register
2. Fill in the form:
   - Name: Test Parent
   - Email: testparent@example.com
   - Password: testpass123
   - Confirm Password: testpass123
3. Submit form

Expected: 
✅ User created successfully
✅ Redirected to login page
```

### **Test 5: Parent Login**

```
URL: http://localhost:3000/dashboard/login

Test with seeded data:
Email: parent1@example.com
Password: password123

Steps:
1. Enter credentials
2. Click "Sign In"

Expected:
✅ Successful login
✅ Redirected to /dashboard
✅ See dashboard with sidebar navigation
```

### **Test 6: Dashboard Home**

```
URL: http://localhost:3000/dashboard

Expected:
✅ Dashboard overview page
✅ Links to various sections
✅ "View Website" link in header
✅ "Logout" button in header
```

### **Test 7: Family Management**

```
URL: http://localhost:3000/dashboard/families

Steps:
1. View existing families (should see "The Smith Family")
2. Click "Create New Family"
3. Enter name: "Test Family"
4. Submit

Expected:
✅ See list of families
✅ Each family shows:
   - Family name
   - Number of members
   - Number of children
   - Children avatars (if any)
✅ New family created successfully
```

### **Test 8: Content Collections**

```
URL: http://localhost:3000/dashboard/collections

Steps:
1. View existing collections
2. Click "Create New Collection"
3. Fill form:
   - Name: "Test Collection"
   - Description: "Test description"
   - Category: Educational
   - Age Rating: 5
   - Is Public: checked
4. Submit

Expected:
✅ See collection cards with:
   - Collection name
   - Category badge
   - Age rating
   - Video count
   - Public/Private badge
✅ New collection created
```

### **Test 9: Screen Time Control**

```
URL: http://localhost:3000/dashboard/screen-time

Steps:
1. Select a child from dropdown
2. View screen time statistics
3. Click "Set Limits"
4. Enter:
   - Daily Limit: 120 minutes
   - Weekly Limit: 840 minutes
   - Enable Limits: checked
5. Submit

Expected:
✅ See screen time stats:
   - Total time used
   - Average daily usage
   - Current limits
✅ Screen time history table
✅ Limits updated successfully
```

### **Test 10: Remote Control**

```
URL: http://localhost:3000/dashboard/remote-control

Steps:
1. Click "Send Command"
2. Select child profile
3. Select command type (PAUSE, LOCK_DEVICE, etc.)
4. Add message if needed
5. Submit

Expected:
✅ Command sent successfully
✅ See command in history with status
✅ Can cancel pending commands
```

### **Test 11: Dashboard Logout**

```
Steps:
1. Click "Logout" button
2. Confirm logout

Expected:
✅ Logged out successfully
✅ Redirected to /dashboard/login
✅ Cannot access /dashboard without re-login
```

---

## 👑 Admin Dashboard Testing

### **Test 12: Admin Setup (First Time)**

```
URL: http://localhost:3000/admin/setup

Use if no admin exists:
Steps:
1. Navigate to admin setup
2. Fill form:
   - Name: Admin User
   - Email: admin@safestream.app
   - Password: adminpass123
   - Confirm Password: adminpass123
3. Submit

Expected:
✅ Admin account created
✅ Redirected to admin login
```

### **Test 13: Admin Login**

```
URL: http://localhost:3000/admin/login

Test with seeded admin:
Email: admin@safestream.app
Password: password123

Steps:
1. Enter admin credentials
2. Click "Sign In"

Expected:
✅ Successful login
✅ Admin role verified
✅ Redirected to /admin
✅ See admin dashboard with blue/purple theme
```

### **Test 14: Admin Dashboard Home**

```
URL: http://localhost:3000/admin

Expected:
✅ Platform statistics displayed:
   - Total Users
   - Child Profiles
   - Collections
   - Videos
✅ Quick actions section
✅ Recent activity
✅ Admin-specific navigation
```

### **Test 15: Platform Statistics**

```
URL: http://localhost:3000/admin/stats

Expected:
✅ Detailed statistics with growth trends:
   - Total Users with % growth
   - Child Profiles with % growth
   - Collections with % growth
   - Videos with % growth
✅ Platform health indicators
✅ User activity metrics
✅ Content overview
```

### **Test 16: User Management**

```
URL: http://localhost:3000/admin/users

Steps:
1. View all users
2. Use search to find users
3. Filter by role (User/Admin)

Expected:
✅ Table of all users showing:
   - User name and email
   - Role badge
   - Number of families
   - Status (Active/Banned)
   - Join date
✅ Search functionality works
✅ Role filter works
✅ Stats cards show correct counts
```

### **Test 17: Family Overview**

```
URL: http://localhost:3000/admin/families

Expected:
✅ Table of all families showing:
   - Family name
   - Parent name and email
   - Number of children
   - Number of collections
   - Created date
✅ Search functionality
✅ Stats cards (total families, total children, avg)
```

### **Test 18: Child Profiles**

```
URL: http://localhost:3000/admin/children

Expected:
✅ Table of all child profiles showing:
   - Child name and avatar
   - Age with colored badge
   - Family name
   - Screen time limit
   - QR code
   - Created date
✅ Age group filters work
✅ Stats cards show age distribution
```

### **Test 19: Collections Management**

```
URL: http://localhost:3000/admin/collections

Expected:
✅ Table of all collections showing:
   - Collection name (with mandatory star)
   - Category badge
   - Age rating
   - Video count
   - Visibility (Public/Private)
   - Creator name
✅ Search and category filters work
✅ Stats show total collections, public, mandatory
```

### **Test 20: Videos Management**

```
URL: http://localhost:3000/admin/videos

Expected:
✅ Placeholder page with:
   - Video management coming soon message
   - Stats cards (placeholder)
   - Upcoming features description
```

### **Test 21: Content Moderation**

```
URL: http://localhost:3000/admin/content-moderation

Expected:
✅ Placeholder page with:
   - Content moderation interface description
   - Filter options (All, Pending, Approved, Rejected)
   - Stats cards for moderation metrics
   - Upcoming features description
```

### **Test 22: Platform Reports**

```
URL: http://localhost:3000/admin/reports

Expected:
✅ Report categories displayed:
   - User Activity Report
   - Content Performance
   - Family Analytics
   - Screen Time Report
   - Safety & Moderation
   - System Performance
✅ Each shows growth % and last 30 days label
✅ Custom Report Builder section
```

### **Test 23: System Settings**

```
URL: http://localhost:3000/admin/settings

Steps:
1. View all settings sections:
   - General Settings
   - User Management
   - Content Settings
   - Notifications
   - Maintenance Mode
2. Modify a setting (e.g., site name)
3. Click "Save Changes"

Expected:
✅ All settings sections visible
✅ Settings can be modified
✅ Save button shows "Saving..." then "Save Changes"
✅ Success message after save
```

### **Test 24: Admin Logout**

```
Steps:
1. Click "Logout" button
2. Confirm logout

Expected:
✅ Logged out successfully
✅ Redirected to /admin/login
✅ Cannot access /admin without re-login
```

---

## 🔒 Middleware & Security Testing

### **Test 25: Unauthenticated Access Protection**

```
Test these URLs without login:

1. http://localhost:3000/dashboard
   Expected: ❌ Redirect to /dashboard/login

2. http://localhost:3000/dashboard/families
   Expected: ❌ Redirect to /dashboard/login

3. http://localhost:3000/admin
   Expected: ❌ Redirect to /admin/login

4. http://localhost:3000/api/dashboard/families
   Expected: ❌ 401 Unauthorized
```

### **Test 26: Admin-Only Access**

```
Login as regular parent user, then try:

1. http://localhost:3000/admin
   Expected: ❌ Access denied or redirect

2. http://localhost:3000/api/admin/stats/users
   Expected: ❌ 403 Forbidden
```

### **Test 27: Rate Limiting** (Production Only)

```
Note: Disabled in development mode

In production:
1. Make 1000+ requests in 15 minutes
   Expected: ❌ 429 Too Many Requests

2. Make 50+ login attempts in 15 minutes
   Expected: ❌ 429 Too Many Requests
```

### **Test 28: Security Headers**

```
Check response headers (use browser DevTools):

Expected headers:
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ X-XSS-Protection: 1; mode=block
✅ Strict-Transport-Security: max-age=31536000
✅ Content-Security-Policy: (present)
```

---

## 🔌 API Endpoint Testing

### **Test 29: Admin Statistics APIs**

```bash
# Must be logged in as admin first, then:

curl http://localhost:3000/api/admin/stats/users \
  -H "Cookie: next-auth.session-token=YOUR_TOKEN"

Expected: {"count": 3}

curl http://localhost:3000/api/admin/stats/profiles
curl http://localhost:3000/api/admin/stats/collections
curl http://localhost:3000/api/admin/stats/videos

All should return count objects
```

### **Test 30: Dashboard APIs**

```bash
# Must be logged in as parent first

# Families
curl http://localhost:3000/api/dashboard/families
Expected: {families: [...]}

# Collections
curl http://localhost:3000/api/dashboard/collections
Expected: {collections: [...]}

# Screen Time
curl "http://localhost:3000/api/dashboard/screen-time?childId=CHILD_ID&days=7"
Expected: {history: [...], summary: {...}}
```

---

## 📊 Database Testing

### **Test 31: Verify Seeded Data**

```bash
# Open Prisma Studio
npm run db:studio

Check tables:
✅ users: Should have 3 users (1 admin, 2 parents)
✅ admin: Should have 1 admin record
✅ family: Should have 2 families
✅ childProfile: Should have 3 children
✅ collection: Should have several collections
✅ video: Should have several videos
✅ screenTime: Should have screen time records
```

### **Test 32: Database Relationships**

```
In Prisma Studio:

1. Click on a User
   ✅ Should show linked families
   ✅ Should show linked admin record (if admin)

2. Click on a Family
   ✅ Should show linked child profiles
   ✅ Should show family members

3. Click on a ChildProfile
   ✅ Should show linked family
   ✅ Should show screen time records
   ✅ Should show favorites
```

---

## 🎨 UI/UX Testing

### **Test 33: Responsive Design**

```
Test on different screen sizes:
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

Check:
✅ Website navbar collapses properly
✅ Dashboard sidebar works on mobile
✅ Tables are scrollable on mobile
✅ Forms are usable on all sizes
✅ Buttons are appropriately sized
```

### **Test 34: Color Scheme**

```
Website:
✅ Primary color: #ef4444 (red)
✅ Consistent red accents

Parent Dashboard:
✅ Red accents (#ef4444)
✅ White/gray base colors
✅ Clean, user-friendly design

Admin Dashboard:
✅ Blue to purple gradient (#3b82f6 to #9333ea)
✅ Professional, data-dense design
✅ Distinct from parent dashboard
```

### **Test 35: Navigation**

```
Website:
✅ Navbar shows all menu items
✅ Footer has proper links
✅ All links work correctly

Parent Dashboard:
✅ Sidebar navigation visible
✅ Active page highlighted
✅ All menu items accessible

Admin Dashboard:
✅ Sidebar with sections
✅ All admin pages accessible
✅ Logout button works
```

---

## 🐛 Error Handling Testing

### **Test 36: Invalid Login**

```
Try logging in with:
- Non-existent email
- Wrong password
- Empty fields

Expected:
✅ Clear error messages
✅ No page crash
✅ Form remains usable
```

### **Test 37: Network Errors**

```
1. Stop the server
2. Try to submit a form
3. Try to load a page

Expected:
✅ Graceful error handling
✅ User-friendly error messages
✅ Loading states visible
```

### **Test 38: Database Errors**

```
1. Stop PostgreSQL
2. Try to load dashboard

Expected:
✅ Error message displayed
✅ No sensitive information leaked
✅ App doesn't crash
```

---

## ✅ Testing Checklist Summary

### **Essential Tests** (Must Pass)
- [x] Homepage loads
- [x] Parent login works
- [x] Admin login works
- [x] Dashboard accessible after login
- [x] Admin dashboard accessible after admin login
- [x] Middleware protects routes
- [x] Logout works
- [x] Seeded data visible

### **Feature Tests** (Should Pass)
- [x] Family management
- [x] Collection management
- [x] Screen time control
- [x] Remote control commands
- [x] Admin user management
- [x] Admin statistics
- [x] All admin pages load

### **Security Tests** (Critical)
- [x] Unauthenticated users blocked
- [x] Non-admin users can't access admin routes
- [x] Passwords are hashed
- [x] JWT tokens validated
- [x] Security headers present
- [x] CORS protection active

---

## 🚀 Production Testing

### **Before Deployment**

```bash
# 1. Run in production mode
npm run build
npm start

# 2. Test with production database
# 3. Verify environment variables
# 4. Test with real domain (not localhost)
# 5. Check SSL certificates
# 6. Monitor error logs
# 7. Test rate limiting (should be active)
```

---

## 📝 Test Data Summary

### **Seeded Users**

| Email | Password | Role | Family | Children |
|-------|----------|------|---------|----------|
| admin@safestream.app | password123 | Admin | - | - |
| parent1@example.com | password123 | User | The Smith Family | 2 |
| parent2@example.com | password123 | User | The Johnson Family | 1 |

### **Seeded Families**

1. **The Smith Family**
   - Parent: parent1@example.com
   - Children: 2 (Emma, 8 years & Liam, 5 years)
   - Collections: Multiple

2. **The Johnson Family**
   - Parent: parent2@example.com
   - Children: 1 (Olivia, 10 years)
   - Collections: Multiple

---

## 🎯 Status

**All Core Features**: ✅ **TESTED & WORKING**

- Authentication flows
- Middleware protection
- Parent dashboard features
- Admin dashboard pages
- API endpoints
- Database seeding
- Security measures

**Last Updated:** 2025-10-03

