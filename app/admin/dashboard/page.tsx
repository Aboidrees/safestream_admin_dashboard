"use client"

import { useEffect, useState } from "react"
import { Card, Row, Col, Statistic, Spin } from "antd"
import { UserOutlined, AppstoreOutlined, PlayCircleOutlined } from "@ant-design/icons"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfiles: 0,
    totalCollections: 0,
    totalVideos: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        // Fetch total users
        const { count: usersCount, error: usersError } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })

        // Fetch total profiles
        const { count: profilesCount, error: profilesError } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })

        // Fetch total collections
        const { count: collectionsCount, error: collectionsError } = await supabase
          .from("collections")
          .select("*", { count: "exact", head: true })

        // Fetch total videos
        const { count: videosCount, error: videosError } = await supabase
          .from("videos")
          .select("*", { count: "exact", head: true })

        setStats({
          totalUsers: usersCount || 0,
          totalProfiles: profilesCount || 0,
          totalCollections: collectionsCount || 0,
          totalVideos: videosCount || 0,
        })
      } catch (error) {
        console.error("Error fetching admin stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [supabase])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-6 text-gray-600">
        Welcome to the SafeStream admin dashboard. Here you can manage users, content, and platform settings.
      </p>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Child Profiles"
                value={stats.totalProfiles}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Collections"
                value={stats.totalCollections}
                prefix={<AppstoreOutlined />}
                valueStyle={{ color: "#13c2c2" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Videos"
                value={stats.totalVideos}
                prefix={<PlayCircleOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </div>
  )
}
