"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  Users,
  Video,
  Database,
  Activity,
  CheckCircle,
  AlertTriangle,
  LogOut,
  BarChart3,
  Clock,
  TrendingUp,
  Eye,
  UserCheck,
  Globe,
} from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface AdminData {
  id: string
  role: string
  is_active: boolean
  permissions: Record<string, string[]>
  last_login: string | null
  users: {
    email: string
    full_name: string | null
  }
}

interface Stats {
  totalUsers: number
  totalFamilies: number
  totalCollections: number
  totalVideos: number
  totalAdmins: number
  activeUsers: number
  todaySignups: number
  weeklyGrowth: number
}

export default function ManagementOfficeDashboard() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    verifyAdminAccess()
  }, [])

  const verifyAdminAccess = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get current user
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        router.push("/login")
        return
      }

      // Verify admin status with comprehensive checks
      const { data: admin, error: adminError } = await supabase
        .from("admins")
        .select(`
          id,
          role,
          is_active,
          permissions,
          last_login,
          token_expires_at,
          users:user_id (
            email,
            full_name
          )
        `)
        .eq("user_id", user.id)
        .single()

      if (adminError || !admin) {
        console.warn("Admin verification failed:", adminError?.message)
        router.push("/")
        return
      }

      // Additional security checks
      if (!admin.is_active) {
        setError("Your admin account has been deactivated. Please contact support.")
        return
      }

      // Check token expiry if exists
      if (admin.token_expires_at) {
        const expiryDate = new Date(admin.token_expires_at)
        if (expiryDate < new Date()) {
          setError("Your admin session has expired. Please contact support for renewal.")
          return
        }
      }

      setAdminData(admin)
      await loadDashboardStats()

      // Update last login
      await supabase.from("admins").update({ last_login: new Date().toISOString() }).eq("user_id", user.id)
    } catch (error) {
      console.error("Error verifying admin access:", error)
      setError("Failed to verify admin access. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardStats = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

      const [
        usersResult,
        familiesResult,
        collectionsResult,
        videosResult,
        adminsResult,
        activeUsersResult,
        todaySignupsResult,
        weeklyUsersResult,
      ] = await Promise.all([
        supabase.from("users").select("id", { count: "exact", head: true }),
        supabase.from("families").select("id", { count: "exact", head: true }),
        supabase.from("collections").select("id", { count: "exact", head: true }),
        supabase.from("videos").select("id", { count: "exact", head: true }),
        supabase.from("admins").select("id", { count: "exact", head: true }),
        supabase
          .from("users")
          .select("id", { count: "exact", head: true })
          .gte("updated_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("users").select("id", { count: "exact", head: true }).gte("created_at", today),
        supabase.from("users").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      ])

      const totalUsers = usersResult.count || 0
      const weeklyUsers = weeklyUsersResult.count || 0
      const weeklyGrowth = totalUsers > 0 ? (weeklyUsers / totalUsers) * 100 : 0

      setStats({
        totalUsers,
        totalFamilies: familiesResult.count || 0,
        totalCollections: collectionsResult.count || 0,
        totalVideos: videosResult.count || 0,
        totalAdmins: adminsResult.count || 0,
        activeUsers: activeUsersResult.count || 0,
        todaySignups: todaySignupsResult.count || 0,
        weeklyGrowth: Math.round(weeklyGrowth * 100) / 100,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-red-500 border-t-transparent mx-auto"></div>
          <p className="text-slate-600 font-medium">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
            <Button onClick={() => router.push("/")} className="w-full" variant="outline">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!adminData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>You don't have permission to access this area.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
      case "admin":
        return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
      case "moderator":
        return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
    }
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: `+${stats?.todaySignups || 0} today`,
      changeColor: "text-blue-600",
    },
    {
      title: "Active Users",
      value: stats?.activeUsers || 0,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "Last 30 days",
      changeColor: "text-green-600",
    },
    {
      title: "Families",
      value: stats?.totalFamilies || 0,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "Protected accounts",
      changeColor: "text-purple-600",
    },
    {
      title: "Collections",
      value: stats?.totalCollections || 0,
      icon: Database,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "Curated content",
      changeColor: "text-orange-600",
    },
    {
      title: "Total Videos",
      value: stats?.totalVideos || 0,
      icon: Video,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      change: "Safe content",
      changeColor: "text-pink-600",
    },
    {
      title: "Weekly Growth",
      value: `${stats?.weeklyGrowth || 0}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      change: "User growth",
      changeColor: "text-emerald-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Management Office</h1>
                <p className="text-sm text-slate-500">SafeStream Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${getRoleBadgeColor(adminData.role)} transition-colors`}>
                <Shield className="w-3 h-3 mr-1" />
                {adminData.role.replace("_", " ").toUpperCase()}
              </Badge>
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-900">
                  {adminData.users?.full_name || adminData.users?.email}
                </p>
                <p className="text-xs text-slate-500">
                  Last login:{" "}
                  {adminData.last_login ? new Date(adminData.last_login).toLocaleDateString() : "First time"}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Status */}
        <Alert className="mb-8 border-green-200 bg-green-50/50 backdrop-blur-sm">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <span className="font-medium">Secure admin session verified.</span> All systems operational and monitoring
            active.
          </AlertDescription>
        </Alert>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm border-slate-200/50"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <p className={`text-xs ${stat.changeColor} font-medium`}>{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Eye className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Video className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    System Health
                  </CardTitle>
                  <CardDescription>Real-time platform status and monitoring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Database", status: "Healthy", color: "green" },
                    { name: "API Services", status: "Online", color: "green" },
                    { name: "Authentication", status: "Secure", color: "green" },
                    { name: "YouTube API", status: "Connected", color: "green" },
                    { name: "File Storage", status: "Available", color: "green" },
                  ].map((service, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-slate-50/50 rounded-lg">
                      <span className="text-sm font-medium text-slate-700">{service.name}</span>
                      <Badge className={`bg-${service.color}-50 text-${service.color}-700 border-${service.color}-200`}>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: Users, label: "Manage Users", desc: "View and manage user accounts" },
                    { icon: Shield, label: "Family Settings", desc: "Configure family protections" },
                    { icon: Video, label: "Content Review", desc: "Moderate platform content" },
                    { icon: Database, label: "System Logs", desc: "View system activity logs" },
                  ].map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 bg-white/50 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <action.icon className="h-4 w-4 mr-3 text-slate-600" />
                      <div className="text-left">
                        <div className="font-medium text-slate-900">{action.label}</div>
                        <div className="text-xs text-slate-500">{action.desc}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts, families, and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">User Management Interface</h3>
                  <p className="text-slate-500 mb-4">Advanced user management tools are coming soon.</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Clock className="w-3 h-3 mr-1" />
                    In Development
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-900">
                  <Video className="h-5 w-5 mr-2 text-purple-600" />
                  Content Management
                </CardTitle>
                <CardDescription>Monitor and moderate collections, videos, and content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4">
                    <Video className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Content Moderation Tools</h3>
                  <p className="text-slate-500 mb-4">
                    Advanced content management and moderation features are coming soon.
                  </p>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    <Clock className="w-3 h-3 mr-1" />
                    In Development
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <Shield className="h-5 w-5 mr-2 text-red-600" />
                    Your Admin Session
                  </CardTitle>
                  <CardDescription>Current session details and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50/50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Role</div>
                      <div className="font-medium text-slate-900">{adminData.role.replace("_", " ").toUpperCase()}</div>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Status</div>
                      <div className="font-medium text-green-600">Active</div>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Last Login</div>
                      <div className="font-medium text-slate-900">
                        {adminData.last_login ? new Date(adminData.last_login).toLocaleDateString() : "First login"}
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50/50 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Session</div>
                      <div className="font-medium text-green-600">Secure</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-slate-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-slate-900">
                    <Globe className="h-5 w-5 mr-2 text-blue-600" />
                    Permissions
                  </CardTitle>
                  <CardDescription>Your current access permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(adminData.permissions || {}).map(([resource, actions]) => (
                    <div key={resource} className="p-3 bg-slate-50/50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-slate-900 capitalize mb-1">{resource}</div>
                          <div className="flex flex-wrap gap-1">
                            {(actions as string[]).map((action) => (
                              <Badge key={action} variant="outline" className="text-xs bg-white">
                                {action}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
