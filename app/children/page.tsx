"use client"

import { useEffect, useState } from "react"
import { Search, Baby, Calendar, QrCode, Shield } from "lucide-react"
import type { ChildProfile } from "@/lib/types"

export default function AdminChildrenPage() {
  const [children, setChildren] = useState<ChildProfile[]>([])
  const [filteredChildren, setFilteredChildren] = useState<ChildProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [ageFilter, setAgeFilter] = useState("all")

  useEffect(() => {
    fetchChildren()
  }, [])

  useEffect(() => {
    let filtered = children

    if (searchTerm) {
      filtered = filtered.filter(child =>
        child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.familyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        child.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (ageFilter !== "all") {
      const [min, max] = ageFilter.split('-').map(Number)
      filtered = filtered.filter(child => child.age >= min && child.age <= max)
    }

    setFilteredChildren(filtered)
  }, [searchTerm, ageFilter, children])

  const fetchChildren = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/children')
      const data = await response.json()
      
      if (response.ok && data.children) {
        setChildren(data.children)
      } else {
        console.error('Failed to fetch children:', data.error)
      }
    } catch (error) {
      console.error("Error fetching children:", error)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Baby className="h-8 w-8 text-blue-600" />
          Child Profiles
        </h1>
        <p className="text-gray-600 mt-2">
          View and monitor all child profiles across the platform
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Children
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="search"
                type="text"
                placeholder="Search by name, family, or parent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Age Group
            </label>
            <select
              id="age"
              value={ageFilter}
              onChange={(e) => setAgeFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Ages</option>
              <option value="0-5">0-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-18">11+ years</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Profiles</p>
              <p className="text-3xl font-bold text-blue-600">{children.length}</p>
            </div>
            <Baby className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Age 0-5</p>
              <p className="text-3xl font-bold text-green-600">
                {children.filter(c => c.age <= 5).length}
              </p>
            </div>
            <div className="text-4xl">👶</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Age 6-10</p>
              <p className="text-3xl font-bold text-purple-600">
                {children.filter(c => c.age >= 6 && c.age <= 10).length}
              </p>
            </div>
            <div className="text-4xl">🧒</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Age 11+</p>
              <p className="text-3xl font-bold text-orange-600">
                {children.filter(c => c.age > 10).length}
              </p>
            </div>
            <div className="text-4xl">🧑</div>
          </div>
        </div>
      </div>

      {/* Children Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading child profiles...</p>
            </div>
          ) : filteredChildren.length === 0 ? (
            <div className="text-center py-12">
              <Baby className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No child profiles found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Child
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Family
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Screen Time Limit
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    QR Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredChildren.map((child) => (
                  <tr key={child.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold">
                            {child.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{child.name}</div>
                          <div className="text-sm text-gray-500">{child.parentName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        child.age <= 5 ? 'bg-green-100 text-green-800' :
                        child.age <= 10 ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {child.age} years
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {child.familyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-900">{child.screenTimeLimit} min/day</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <QrCode className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500 font-mono">{child.qrCode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(child.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

