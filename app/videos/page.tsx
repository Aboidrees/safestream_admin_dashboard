"use client"

import { useState } from "react"
import { Search, Video, Eye, Flag, Trash2 } from "lucide-react"

export default function AdminVideosPage() {
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Video className="h-8 w-8 text-blue-600" />
          Video Management
        </h1>
        <p className="text-gray-600 mt-2">
          View and manage all videos across the platform
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Videos
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="search"
            type="text"
            placeholder="Search by title, URL, or collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Videos</p>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <Video className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Flagged Videos</p>
              <p className="text-3xl font-bold text-red-600">0</p>
            </div>
            <Flag className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Views</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <Eye className="h-10 w-10 text-green-600" />
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Video className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Management Coming Soon</h3>
        <p className="text-gray-600 mb-4">
          This feature will allow you to view, moderate, and manage all videos on the platform.
        </p>
        <div className="bg-blue-50 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-blue-800">
            <strong>Upcoming features:</strong> Video moderation, bulk operations, video analytics, 
            flagged content review, and automated content filtering.
          </p>
        </div>
      </div>
    </div>
  )
}

