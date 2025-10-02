import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { MobileDashboardShell } from "@/components/mobile-dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Video, Eye, Plus } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch children count
  const { count: childrenCount } = await supabase
    .from("child_profiles")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", user.id)

  // Fetch collections count
  const { count: collectionsCount } = await supabase
    .from("video_collections")
    .select("*", { count: "exact", head: true })
    .eq("parent_id", user.id)

  return (
    <MobileDashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || "User"}!</h1>
          <p className="text-gray-600 mt-2">Here's an overview of your SafeStream account.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Children Profiles</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{childrenCount || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Active child profiles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Video Collections</CardTitle>
              <Video className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{collectionsCount || 0}</div>
              <p className="text-xs text-gray-600 mt-1">Curated video collections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watch Time Today</CardTitle>
              <Eye className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0h 0m</div>
              <p className="text-xs text-gray-600 mt-1">Across all profiles</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with SafeStream</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/children" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Child Profile
                </Button>
              </Link>
              <Link href="/dashboard/collections" className="block">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Collection
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions on your account</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">No recent activity to display.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MobileDashboardShell>
  )
}
