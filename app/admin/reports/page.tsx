"use client"

import { BarChart3, TrendingUp, FileText, Download } from "lucide-react"

export default function AdminReportsPage() {
  return (
    <div>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Platform Reports
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive platform analytics and reporting
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Reports
        </button>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">User Activity Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Detailed insights into user engagement, active users, and session duration
          </p>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.5% vs last period
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Content Performance</h3>
          <p className="text-sm text-gray-600 mb-4">
            Most viewed collections, popular videos, and content engagement metrics
          </p>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8.3% vs last period
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Family Analytics</h3>
          <p className="text-sm text-gray-600 mb-4">
            Family creation trends, average children per family, and family engagement
          </p>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            +15.2% vs last period
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Screen Time Report</h3>
          <p className="text-sm text-gray-600 mb-4">
            Average screen time, limit compliance, and usage patterns by age group
          </p>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            +5.7% vs last period
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Safety & Moderation</h3>
          <p className="text-sm text-gray-600 mb-4">
            Flagged content, moderation actions, and safety incidents overview
          </p>
          <div className="flex items-center text-sm text-gray-600 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            0% vs last period
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <FileText className="h-6 w-6 text-cyan-600" />
            </div>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">System Performance</h3>
          <p className="text-sm text-gray-600 mb-4">
            API response times, uptime, error rates, and system health metrics
          </p>
          <div className="flex items-center text-sm text-green-600 font-medium">
            <TrendingUp className="h-4 w-4 mr-1" />
            99.98% uptime
          </div>
        </div>
      </div>

      {/* Custom Report Builder */}
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <BarChart3 className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Report Builder</h3>
        <p className="text-gray-600 mb-4">
          Create custom reports with specific metrics, date ranges, and filters
        </p>
        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium">
          Build Custom Report
        </button>
      </div>
    </div>
  )
}

