"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileDashboardShell } from "@/components/mobile-dashboard-shell"
import { Users, FolderOpen, Clock, BarChart3, Plus, Smartphone } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useSupabase } from "@/lib/supabase/provider"
import Link from "next/link"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    profiles: 0,
    collections: 0,
    totalWatchTime: 0,
    activeDevices: 0,
  })
  const [loading, setLoading] = useState(true)
  const { user } = useSupabase()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return

      try {
        // Fetch profiles count
        const { count: profilesCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("parent_id", user.id)

        // Fetch collections count
        const { count: collectionsCount } = await supabase
          .from("collections")
          .select("*", { count: "exact", head: true })
          .eq("created_by", user.id)

        setStats({
          profiles: profilesCount || 0,
          collections: collectionsCount || 0,
          totalWatchTime: 0, // TODO: Calculate from watch_history
          activeDevices: 0, // TODO: Track active devices
        })
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, supabase])

  return (
    <MobileDashboardShell>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.name || "Parent"}!
          </h1>
          <p className="text-blue-100 mobile-text">Manage your family's safe streaming experience from here.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Child Profiles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.profiles}</div>
              <p className="text-xs text-muted-foreground">Active profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stats.collections}</div>
              <p className="text-xs text-muted-foreground">Content collections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalWatchTime}h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devices</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeDevices}</div>
              <p className="text-xs text-muted-foreground">Connected</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Child Profiles
              </CardTitle>
              <CardDescription>Manage your children's profiles and viewing permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="mobile-text">Active profiles: {stats.profiles}</span>
                <Badge variant="secondary">{stats.profiles > 0 ? "Set up" : "Not set up"}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/dashboard/profiles" className="flex-1">
                  <Button variant="outline" className="w-full touch-target bg-transparent">
                    Manage Profiles
                  </Button>
                </Link>
                <Link href="/dashboard/profiles/new" className="flex-1">
                  <Button className="w-full touch-target">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Child
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Content Library
              </CardTitle>
              <CardDescription>Create and manage video collections for your children</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="mobile-text">Collections: {stats.collections}</span>
                <Badge variant="secondary">{stats.collections > 0 ? "Active" : "Empty"}</Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href="/dashboard/collections" className="flex-1">
                  <Button variant="outline" className="w-full touch-target bg-transparent">
                    View Library
                  </Button>
                </Link>
                <Link href="/dashboard/collections/new" className="flex-1">
                  <Button className="w-full touch-target">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Collection
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest viewing activity from your children's devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mobile-text">No recent activity to display</p>
              <p className="text-sm">Activity will appear here once your children start watching content</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileDashboardShell>
  )
}
