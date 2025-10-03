"use client"

import { useState } from "react"
import { AlertTriangle, CheckCircle, XCircle, Flag, } from "lucide-react"

export default function ContentModerationPage() {
  const [filter, setFilter] = useState("all")

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          Content Moderation
        </h1>
        <p className="text-gray-600 mt-2">
          Review and moderate flagged content to ensure platform safety
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-2">
          Filter Content
        </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Reports</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Review</p>
              <p className="text-3xl font-bold text-orange-600">0</p>
            </div>
            <Flag className="h-10 w-10 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">0</p>
            </div>
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-blue-600">0</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Moderation Coming Soon</h3>
        <p className="text-gray-600 mb-4">
          This feature will allow you to review and moderate flagged content to maintain platform safety.
        </p>
        <div className="bg-orange-50 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-orange-800">
            <strong>Upcoming features:</strong> Automated content filtering, user-reported content review, 
            bulk moderation actions, content flags history, and moderation analytics.
          </p>
        </div>
      </div>
    </div>
  )
}

