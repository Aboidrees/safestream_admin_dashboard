# SafeStream Branch Separation Plan

## 📋 Overview

This document outlines the clear separation of the SafeStream platform into three distinct branches:
1. **Website Branch** - Public-facing marketing website
2. **Parent Dashboard Branch** - Parent/user dashboard for family management
3. **Admin Dashboard Branch** - Platform administration and management

---

## 🌳 Branch Structure

### **Branch 1: Website (`website-branch`)**
- **Purpose**: Public-facing marketing and information website
- **Target Audience**: Potential customers, visitors
- **Authentication**: None required
- **Access**: Public

### **Branch 2: Parent Dashboard (`parent-dashboard-branch`)**
- **Purpose**: Parent/user dashboard for managing families, children, content, and controls
- **Target Audience**: Registered parents/users
- **Authentication**: Required (regular users)
- **Access**: Authenticated users only

### **Branch 3: Admin Dashboard (`admin-dashboard-branch`)**
- **Purpose**: Platform administration, user management, and system oversight
- **Target Audience**: Platform administrators
- **Authentication**: Required (admin role)
- **Access**: Admin users only

---

## 📁 Current Structure Analysis

### **Website (`app/(website)/`)**
```
app/(website)/
├── layout.tsx                 ✅ Website layout with navbar/footer
├── page.tsx                   ✅ Homepage
├── about/page.tsx             ✅ About page
├── blog/page.tsx              ✅ Blog listing
├── community/page.tsx         ✅ Community page
├── contact-us/page.tsx        ✅ Contact form
├── faq/page.tsx               ✅ FAQ
├── help-center/page.tsx       ✅ Help center
├── privacy-policy/page.tsx    ✅ Privacy policy
└── terms-of-service/page.tsx  ✅ Terms of service
```

**Components:**
- `components/website-navbar.tsx` ✅ Website navigation
- `components/ui/*` ✅ Shared UI components

**Status:** ✅ Already well-separated

---

### **Parent Dashboard (`app/dashboard/`)**
```
app/dashboard/
├── layout.tsx                 ✅ Dashboard layout with sidebar
├── page.tsx                   ✅ Dashboard home
├── login/page.tsx             ✅ Login page
├── register/page.tsx          ✅ Registration page
├── families/page.tsx          ✅ Family management
├── children/ (to be created)  📱 Child profile management
├── collections/page.tsx       ✅ Content curation
├── screen-time/page.tsx       ✅ Screen time control
├── remote-control/page.tsx    ✅ Remote control commands
└── notifications/ (to be created) 📱 Notifications

REMOVE from parent dashboard:
├── admin/page.tsx             ❌ Move to admin dashboard
├── admin-setup/page.tsx       ❌ Move to admin dashboard
└── my-management-office/      ❌ Move to admin dashboard
```

**API Routes for Parent Dashboard:**
```
app/api/dashboard/
├── families/
├── children/
├── collections/
├── videos/
├── screen-time/
├── remote-control/
└── notifications/
```

**Status:** ✅ Mostly complete, needs separation from admin features

---

### **Admin Dashboard (New: `app/admin/`)**
```
app/admin/
├── layout.tsx                 📱 NEW - Admin layout
├── page.tsx                   📱 NEW - Admin home/stats
├── login/page.tsx             📱 NEW - Admin login
├── users/page.tsx             📱 NEW - User management
├── families/page.tsx          📱 NEW - All families overview
├── children/page.tsx          📱 NEW - All child profiles
├── content/page.tsx           📱 NEW - Content moderation
├── collections/page.tsx       📱 NEW - All collections
├── videos/page.tsx            📱 NEW - Video management
├── reports/page.tsx           📱 NEW - Platform reports
├── settings/page.tsx          📱 NEW - System settings
└── setup/page.tsx             📱 MOVE from dashboard/admin-setup

MOVE from dashboard:
├── admin/page.tsx             → admin/page.tsx
└── my-management-office/      → admin/management/
```

**API Routes for Admin Dashboard:**
```
app/api/admin/
├── stats/                     ✅ Already exists
│   ├── users/
│   ├── profiles/
│   ├── collections/
│   └── videos/
├── users/                     📱 NEW - User CRUD
├── families/                  📱 NEW - Family oversight
├── content/                   📱 NEW - Content moderation
└── system/                    📱 NEW - System settings
```

**Status:** 📱 Needs to be created and separated

---

## 🎯 Separation Plan

### **Phase 1: Create Admin Dashboard Structure**

#### **1.1 Create Admin Layout**
```typescript
// app/admin/layout.tsx
- Admin-specific navigation
- Admin sidebar with different menu items
- Admin branding/styling
- Admin-only authentication check
```

#### **1.2 Move Admin Pages**
- Move `app/dashboard/admin/page.tsx` → `app/admin/page.tsx`
- Move `app/dashboard/admin-setup/page.tsx` → `app/admin/setup/page.tsx`
- Move `app/dashboard/my-management-office/` → `app/admin/management/`

#### **1.3 Create New Admin Pages**
- `app/admin/users/page.tsx` - User management
- `app/admin/families/page.tsx` - All families overview
- `app/admin/children/page.tsx` - All child profiles
- `app/admin/content/page.tsx` - Content moderation
- `app/admin/reports/page.tsx` - Platform analytics
- `app/admin/settings/page.tsx` - System configuration

---

### **Phase 2: Clean Up Parent Dashboard**

#### **2.1 Remove Admin Features**
- Remove admin links from `app/dashboard/layout.tsx`
- Remove admin-only pages from dashboard
- Update navigation to parent-only features

#### **2.2 Add Missing Parent Pages**
- Create `app/dashboard/children/page.tsx` (detailed child management)
- Create `app/dashboard/notifications/page.tsx` (notification center)
- Create detail pages for collections, videos, etc.

---

### **Phase 3: Update Middleware & Authentication**

#### **3.1 Update Middleware Routes**
```typescript
// middleware.ts
const publicRoutes = [
  "/",              // Website home
  "/about",
  "/blog",
  // ... other website routes
]

const parentDashboardRoutes = [
  "/dashboard",     // Parent dashboard
  "/dashboard/*",
]

const adminRoutes = [
  "/admin",         // Admin dashboard
  "/admin/*",
]
```

#### **3.2 Update Authentication Logic**
- Separate login pages: `/dashboard/login` (parents) vs `/admin/login` (admins)
- Different authentication flows
- Role-based redirects

---

### **Phase 4: Create Admin API Routes**

#### **4.1 User Management APIs**
```
POST   /api/admin/users              - Create user
GET    /api/admin/users              - List all users
GET    /api/admin/users/[id]         - Get user details
PATCH  /api/admin/users/[id]         - Update user
DELETE /api/admin/users/[id]         - Delete user
POST   /api/admin/users/[id]/ban     - Ban user
POST   /api/admin/users/[id]/unban   - Unban user
```

#### **4.2 Content Moderation APIs**
```
GET    /api/admin/content/flagged    - Get flagged content
POST   /api/admin/content/[id]/approve - Approve content
POST   /api/admin/content/[id]/reject  - Reject content
DELETE /api/admin/content/[id]       - Remove content
```

#### **4.3 System Management APIs**
```
GET    /api/admin/system/settings    - Get system settings
PATCH  /api/admin/system/settings    - Update settings
GET    /api/admin/system/logs        - System logs
POST   /api/admin/system/maintenance - Maintenance mode
```

---

## 📊 Feature Distribution

### **Website Features**
- ✅ Landing page with hero section
- ✅ Features showcase
- ✅ Pricing information
- ✅ About us
- ✅ Blog
- ✅ Community
- ✅ FAQ
- ✅ Help Center
- ✅ Contact form
- ✅ Privacy Policy & Terms

**No Authentication Required**

---

### **Parent Dashboard Features**
- ✅ Family management (create, edit, view families)
- ✅ Child profile management (create, edit, QR codes)
- ✅ Content curation (collections, videos)
- ✅ Screen time control (monitor, set limits)
- ✅ Remote control (send commands to devices)
- ✅ Notifications (receive alerts)
- ✅ Profile settings
- ✅ Subscription management

**Requires User Authentication**

---

### **Admin Dashboard Features**
- ✅ Platform statistics (users, profiles, content)
- 📱 User management (view, edit, ban/unban)
- 📱 Family oversight (view all families)
- 📱 Content moderation (approve/reject content)
- 📱 Video management (all videos)
- 📱 Collection management (all collections)
- 📱 Reports & analytics (platform health)
- 📱 System settings (configuration)
- 📱 Admin user management
- 📱 Audit logs

**Requires Admin Authentication**

---

## 🔒 Security & Access Control

### **Middleware Protection**

```typescript
// Website routes
- No authentication required
- Public access
- Rate limiting for contact forms

// Parent dashboard routes
- User authentication required
- JWT token validation
- Session management
- Owner/family member access control

// Admin dashboard routes  
- Admin authentication required
- Admin role validation
- Elevated permissions check
- Audit logging
```

---

## 🎨 UI/UX Differences

### **Website**
- **Design**: Marketing-focused, attractive
- **Colors**: Red (#ef4444) primary, gradients
- **Layout**: Full-width, no sidebar
- **Navigation**: Horizontal navbar
- **Footer**: Comprehensive site map

### **Parent Dashboard**
- **Design**: Functional, user-friendly
- **Colors**: Red accents, white/gray base
- **Layout**: Sidebar navigation
- **Navigation**: Vertical sidebar menu
- **Header**: Compact with user profile

### **Admin Dashboard**
- **Design**: Data-dense, powerful tools
- **Colors**: Blue/purple accents (admin feel)
- **Layout**: Sidebar with metrics
- **Navigation**: Admin-specific menu
- **Header**: Admin branding

---

## 🚀 Git Branch Strategy

### **Branch Creation Commands**

```bash
# Create website branch from main
git checkout -b website
# Keep only: app/(website)/, components/website-*, app/globals.css, app/layout.tsx

# Create parent dashboard branch from main
git checkout main
git checkout -b parent-dashboard
# Keep only: app/dashboard/ (cleaned), app/api/dashboard/, components/ui/

# Create admin dashboard branch from main  
git checkout main
git checkout -b admin-dashboard
# Keep only: app/admin/ (new), app/api/admin/, components/admin-*
```

### **Branch Management**

```bash
# Website branch - for marketing team
website-branch
├── Deploy to: website.safestream.app
├── Team: Marketing, Content
└── Updates: Content, design, marketing features

# Parent dashboard branch - for product team
parent-dashboard-branch
├── Deploy to: app.safestream.app
├── Team: Product, Frontend
└── Updates: User features, UX improvements

# Admin dashboard branch - for platform team
admin-dashboard-branch
├── Deploy to: admin.safestream.app
├── Team: Platform, DevOps
└── Updates: Admin tools, system management
```

---

## 📦 Deployment Strategy

### **Separate Deployments**

```yaml
# Website deployment
website:
  url: https://safestream.app
  routes: /, /about, /blog, /faq, etc.
  build: app/(website)
  public: true

# Parent Dashboard deployment
parent-dashboard:
  url: https://app.safestream.app
  routes: /dashboard/*
  build: app/dashboard
  authentication: required
  
# Admin Dashboard deployment
admin-dashboard:
  url: https://admin.safestream.app
  routes: /admin/*
  build: app/admin
  authentication: admin-only
```

---

## ✅ Implementation Checklist

### **Phase 1: Admin Dashboard**
- [ ] Create `app/admin/` directory structure
- [ ] Create `app/admin/layout.tsx` with admin navigation
- [ ] Move admin pages from dashboard
- [ ] Create new admin pages (users, content, reports)
- [ ] Create admin API routes
- [ ] Update middleware for admin routes
- [ ] Create admin login page
- [ ] Test admin authentication

### **Phase 2: Clean Parent Dashboard**
- [ ] Remove admin features from dashboard
- [ ] Update dashboard navigation
- [ ] Create missing parent pages (children detail, notifications)
- [ ] Update dashboard links
- [ ] Test parent dashboard functionality

### **Phase 3: Branch Creation**
- [ ] Create `website-branch`
- [ ] Create `parent-dashboard-branch`
- [ ] Create `admin-dashboard-branch`
- [ ] Test each branch independently
- [ ] Set up CI/CD for each branch

### **Phase 4: Documentation**
- [ ] Update README for each branch
- [ ] Create deployment guides
- [ ] Document API endpoints per branch
- [ ] Create contribution guidelines per branch

---

## 🎯 Expected Outcome

**Three Independent Branches:**

1. **Website Branch** 🌐
   - Lightweight, marketing-focused
   - Fast loading, SEO-optimized
   - No authentication complexity

2. **Parent Dashboard Branch** 👨‍👩‍👧‍👦
   - Feature-rich for parents
   - User-friendly interface
   - Family management tools

3. **Admin Dashboard Branch** 👑
   - Powerful admin tools
   - Platform oversight
   - System management

**Benefits:**
- ✅ Clear separation of concerns
- ✅ Independent deployment cycles
- ✅ Easier maintenance
- ✅ Better security (admin isolation)
- ✅ Team-specific workflows
- ✅ Faster development
- ✅ Reduced merge conflicts

---

**Status:** 📋 **PLAN COMPLETE - READY FOR IMPLEMENTATION**

**Next Step:** Execute Phase 1 (Create Admin Dashboard Structure)

