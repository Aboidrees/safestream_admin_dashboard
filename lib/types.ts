// ============================================================================
// SafeStream Platform - Unified Types and Interfaces
// ============================================================================

import type { JWTPayload } from 'jose'

// ============================================================================
// AUTHENTICATION & USER TYPES
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  isActive: boolean
  familyCount?: number
}

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  role: string
  isAdmin: boolean
  adminId?: string
}

export interface SafeStreamJWTPayload extends JWTPayload {
  id: string
  email: string
  name?: string
  role?: string
  isAdmin?: boolean
  adminId?: string
  jti?: string
  type?: 'access' | 'refresh'
}

export interface AccessTokenPayload {
  id: string
  email: string
  name?: string
  role?: string
  isAdmin?: boolean
  adminId?: string
  jti: string
  type: 'access'
  iat: number
  exp: number
  iss: string
  aud: string
}

export interface RefreshTokenPayload {
  id: string
  email: string
  jti: string
  type: 'refresh'
  iat: number
  exp: number
  iss: string
  aud: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

// ============================================================================
// FAMILY & CHILD TYPES
// ============================================================================

export interface Family {
  id: string
  name: string
  createdAt: string
  parentName: string
  parentEmail: string
  childrenCount: number
  collectionsCount: number
}

export interface ChildProfile {
  id: string
  name: string
  age: number
  familyName: string
  parentName: string
  createdAt: string
  screenTimeLimit: number
  qrCode: string
}

export interface FamilyMember {
  id: string
  familyId: string
  userId: string
  role: 'parent' | 'guardian' | 'child'
  joinedAt: string
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

export interface Category {
  id: string
  name: string
  description?: string
  color?: string
  icon?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Collection {
  id: string
  name: string
  description?: string
  category: Category | null
  ageRating: number
  videoCount: number
  isPublic: boolean
  isPlatform?: boolean
  isMandatory: boolean
  creatorName: string
  createdAt: string
}

export interface Video {
  id: string
  youtubeId: string
  title: string
  description?: string
  thumbnailUrl?: string
  duration?: number
  channelName?: string
  ageRating?: string
  tags: string[]
  isApproved: boolean
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED' | 'UNDER_REVIEW'
  moderatedBy?: string
  moderatedAt?: string
  moderationNotes?: string
  rejectionReason?: string
  createdAt: string
  collectionId?: string
}

export interface Favorite {
  id: string
  userId: string
  videoId: string
  createdAt: string
}

export interface WatchHistory {
  id: string
  userId: string
  videoId: string
  watchedAt: string
  duration: number
  completed: boolean
}

// ============================================================================
// SCREEN TIME & DEVICE TYPES
// ============================================================================

export interface ScreenTime {
  id: string
  userId: string
  date: string
  totalMinutes: number
  videoMinutes: number
  gameMinutes: number
  educationalMinutes: number
}

export interface DeviceSession {
  id: string
  userId: string
  deviceId: string
  deviceName: string
  lastActiveAt: string
  isActive: boolean
}

// ============================================================================
// REMOTE CONTROL & NOTIFICATION TYPES
// ============================================================================

export interface RemoteCommand {
  id: string
  userId: string
  deviceId: string
  commandType: 'pause' | 'play' | 'stop' | 'volume_up' | 'volume_down' | 'next' | 'previous'
  status: 'pending' | 'sent' | 'completed' | 'failed' | 'cancelled'
  createdAt: string
  executedAt?: string
  expiresAt: string
}

export interface Notification {
  id: string
  userId: string
  type: 'info' | 'warning' | 'success' | 'error'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  readAt?: string
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export interface Admin {
  id: string
  userId: string
  role: 'super_admin' | 'admin' | 'moderator'
  permissions: string[]
  createdAt: string
  lastActiveAt: string
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ============================================================================
// STATISTICS TYPES
// ============================================================================

export interface PlatformStats {
  totalUsers: number
  totalProfiles: number
  totalCollections: number
  totalVideos: number
}

export interface GrowthTrends {
  usersGrowth: number
  profilesGrowth: number
  collectionsGrowth: number
  videosGrowth: number
}

export interface StatCardProps {
  title: string
  value: string | number
  growth?: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

// ============================================================================
// FORM TYPES
// ============================================================================

export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AdminSetupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// ============================================================================
// SETTINGS TYPES
// ============================================================================

export interface PlatformSettings {
  siteName: string
  siteUrl: string
  adminEmail: string
  maintenanceMode: boolean
  allowRegistration: boolean
  requireEmailVerification: boolean
  maxChildrenPerFamily: number
  defaultScreenTimeLimit: number
  enableNotifications: boolean
  enablePublicCollections: boolean
}

// ============================================================================
// FILTER TYPES
// ============================================================================

export interface UserFilters {
  searchTerm: string
  roleFilter: string
}

export interface FamilyFilters {
  searchTerm: string
}

export interface ChildFilters {
  searchTerm: string
  ageFilter: string
}

export interface CollectionFilters {
  searchTerm: string
  categoryFilter: string
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

export interface AdminShellProps {
  children: React.ReactNode
}

export interface MobileDashboardShellProps {
  children: React.ReactNode
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: unknown, item: T) => React.ReactNode
}

export interface TableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  onRowClick?: (item: T) => void
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

export interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'right' | 'bottom' | 'left'
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type AdminRole = 'super_admin' | 'admin' | 'moderator'
export type FamilyRole = 'parent' | 'guardian' | 'child'
export type CommandType = 'pause' | 'play' | 'stop' | 'volume_up' | 'volume_down' | 'next' | 'previous'
export type CommandStatus = 'pending' | 'sent' | 'completed' | 'failed' | 'cancelled'
export type NotificationType = 'info' | 'warning' | 'success' | 'error'

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  // Re-export commonly used types for convenience
  User as AdminUser,
  Family as AdminFamily,
  ChildProfile as AdminChildProfile,
  Collection as AdminCollection,
  Video as AdminVideo,
}
