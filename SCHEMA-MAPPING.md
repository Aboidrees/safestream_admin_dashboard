# SafeStream Prisma Schema - PRD Mapping

This document maps the Prisma schema to the Product Requirements Document (PRD) features.

## 🎯 Core Features Mapping

### 4.1 Authentication & Profile Management
- **QR Code Authentication**: `ChildProfile.qrCode` + `qrCodeExpiresAt`
- **Multi-profile Management**: `ChildProfile` model with family relationships
- **Phone/Email Login**: `User.phoneNumber` + `User.email`
- **Profile Management**: `User` model with preferences

### 4.2 Content Management
- **Collections**: `Collection` model with creator relationships
- **Videos**: `Video` model with YouTube integration support
- **Age Restrictions**: `Video.ageRating` + `Collection` age settings
- **Content Preview**: Video metadata stored in `Video` model

### 4.3 Screen Time & Access Control
- **Daily Time Limits**: `ScreenTime.dailyLimit` + `totalMinutes`
- **Blocked Hours**: `ScreenTime.blockedHours` (JSON array)
- **Pause/Resume**: `ScreenTime.isPaused` + timestamps
- **Real-time Stats**: `ScreenTime` model with daily tracking

### 4.4 Real-Time Remote Control
- **Command Queue**: `RemoteCommand` model with status tracking
- **Device Sessions**: `DeviceSession` model for active connections
- **Command Types**: `CommandType` enum (PAUSE, LOGOUT, etc.)
- **Delivery Reliability**: `CommandStatus` enum + expiration

### 4.5 Watch History & Favorites
- **Watch Log**: `WatchHistory` model with detailed tracking
- **Favorites**: `Favorite` model with mandatory/restricted flags
- **Content Flags**: `Favorite.isMandatory` + `isRestricted`

### 4.6 Notifications
- **Push Alerts**: `Notification` model with type classification
- **Alert Types**: `NotificationType` enum for different events
- **Read Status**: `Notification.isRead` + `readAt` tracking

### 4.7 App Customization
- **Themes**: `ChildProfile.theme` field
- **Language**: `ChildProfile.language` field
- **Avatars**: `ChildProfile.avatarUrl` + `User.avatar`
- **Device Naming**: `DeviceSession.deviceName`

### 4.8 Multi-Parent Support
- **Family Members**: `FamilyMember` model with role-based access
- **Role Permissions**: `FamilyRole` enum + `permissions` JSON
- **Family Management**: `Family` model with member relationships

## 🗄️ Database Collections (PRD Section 6)

| PRD Collection | Prisma Model | Status |
|----------------|--------------|---------|
| `users` | `User` | ✅ Complete |
| `child_accounts` | `ChildProfile` | ✅ Complete |
| `collections` | `Collection` | ✅ Complete |
| `videos` | `Video` | ✅ Complete |
| `favorites` | `Favorite` | ✅ Complete |
| `watch_history` | `WatchHistory` | ✅ Complete |
| `screen_time` | `ScreenTime` | ✅ Complete |
| `remote_control` | `RemoteCommand` | ✅ Complete |

## 🔧 Additional Models (Beyond PRD)

| Model | Purpose | PRD Section |
|-------|---------|-------------|
| `Admin` | Platform administration | System requirements |
| `Family` | Family grouping | Implied in multi-parent |
| `FamilyMember` | Multi-parent support | 4.8 |
| `DeviceSession` | Device management | 4.4 Remote Control |
| `Notification` | Push notifications | 4.6 |
| `Account` | NextAuth integration | Authentication |
| `Session` | NextAuth sessions | Authentication |
| `VerificationToken` | Email verification | Authentication |

## 📊 Key Relationships

### Parent → Child Flow
```
User (Parent) → Family → ChildProfile → DeviceSession → RemoteCommand
```

### Content Management Flow
```
User → Collection → CollectionVideo → Video
```

### Monitoring Flow
```
ChildProfile → WatchHistory + ScreenTime + Favorites
```

### Notification Flow
```
System Events → Notification → User
```

## 🚀 Performance Considerations

### Indexes (Recommended)
- `User.email` (unique)
- `ChildProfile.qrCode` (unique)
- `DeviceSession.deviceId`
- `RemoteCommand.status` + `createdAt`
- `WatchHistory.childProfileId` + `watchedAt`
- `ScreenTime.childProfileId` + `date`

### JSON Fields
- `User.preferences` - User settings
- `ChildProfile.contentRestrictions` - Age/content rules
- `ChildProfile.screenTimeLimits` - Time restrictions
- `ScreenTime.blockedHours` - Time blocks
- `RemoteCommand.payload` - Command data
- `Notification.data` - Additional data

## 🔐 Security Features

### Data Protection
- All models use UUID primary keys
- Soft deletes via `isActive` flags
- Cascade deletes for data integrity
- JWT-based authentication via NextAuth

### Access Control
- Role-based permissions in `Admin` and `FamilyMember`
- Device session tracking
- Command expiration for security
- QR code expiration for child login

## 📈 Scalability Features

### Real-time Support
- Command queue system for remote control
- Device session management
- Notification system for alerts

### Multi-tenancy
- Family-based data isolation
- User-specific preferences
- Child profile separation

This schema fully supports all PRD requirements and provides a solid foundation for the SafeStream platform.
