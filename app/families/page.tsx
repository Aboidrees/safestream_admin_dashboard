"use client"

import { useEffect, useState } from "react"
import { Search, Users, Eye, Baby } from "lucide-react"
import type { Family } from "@/lib/types"

export default function AdminFamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([])
  const [filteredFamilies, setFilteredFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    fetchFamilies()
  }, [])

  useEffect(() => {
    let filtered = families

    if (searchTerm) {
      filtered = filtered.filter(family =>
        family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.parentEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredFamilies(filtered)
  }, [searchTerm, families])

  const fetchFamilies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/families')
      const data = await response.json()
      
      if (response.ok && data.families) {
        setFamilies(data.families)
      } else {
        console.error('Failed to fetch families:', data.error)
      }
    } catch (error) {
      console.error("Error fetching families:", error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Users className="h-8 w-8 text-blue-600" />
          Family Overview
        </h1>
        <p className="text-gray-600 mt-2">
          View and monitor all registered families on the platform
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Families
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="search"
            type="text"
            placeholder="Search by family name, parent name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Families</p>
              <p className="text-3xl font-bold text-blue-600">{families.length}</p>
            </div>
            <Users className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Children</p>
              <p className="text-3xl font-bold text-purple-600">
                {families.reduce((sum, f) => sum + f.childrenCount, 0)}
              </p>
            </div>
            <Baby className="h-10 w-10 text-purple-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Children per Family</p>
              <p className="text-3xl font-bold text-green-600">
                {families.length > 0
                  ? (families.reduce((sum, f) => sum + f.childrenCount, 0) / families.length).toFixed(1)
                  : 0}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
      </div>

      {/* Families Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading families...</p>
            </div>
          ) : filteredFamilies.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-gray-500">No families found</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Family
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Children
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Collections
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFamilies.map((family) => (
                  <tr key={family.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg">
                            👨‍👩‍👧‍👦
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{family.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{family.parentName}</div>
                      <div className="text-sm text-gray-500">{family.parentEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Baby className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900">{family.childrenCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {family.collectionsCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(family.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </button>
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

