"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Family {
  id: string
  name: string
  createdAt: string
  creator: {
    id: string
    name: string
    email: string
  }
  childProfiles: Array<{
    id: string
    name: string
    avatarUrl: string | null
  }>
  _count: {
    childProfiles: number
    familyMembers: number
  }
}

export default function FamiliesPage() {
  const [families, setFamilies] = useState<Family[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newFamilyName, setNewFamilyName] = useState("")
  const [creating, setCreating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchFamilies()
  }, [])

  const fetchFamilies = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/families')
      const data = await response.json()
      setFamilies(data.families || [])
    } catch (error) {
      console.error('Error fetching families:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFamilyName.trim()) return

    try {
      setCreating(true)
      const response = await fetch('/api/dashboard/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFamilyName.trim()
        }),
      })

      if (response.ok) {
        setNewFamilyName("")
        setShowCreateModal(false)
        fetchFamilies()
      }
    } catch (error) {
      console.error('Error creating family:', error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading families...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Families</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Create Family
        </button>
      </div>

      {families.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Families Yet</h2>
          <p className="text-gray-500 mb-6">Create your first family to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Create Your First Family
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {families.map((family) => (
            <Link
              key={family.id}
              href={`/dashboard/families/${family.id}`}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{family.name}</h3>
              <p className="text-sm text-gray-500 mb-4">
                Created by {family.creator.name}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{family._count.childProfiles} Children</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{family._count.familyMembers} Members</span>
                </div>
              </div>
              {family.childProfiles.length > 0 && (
                <div className="mt-4 flex -space-x-2">
                  {family.childProfiles.slice(0, 3).map((child) => (
                    <div
                      key={child.id}
                      className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
                      title={child.name}
                    >
                      {child.avatarUrl ? (
                        <img src={child.avatarUrl} alt={child.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        child.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  ))}
                  {family.childProfiles.length > 3 && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700">
                      +{family.childProfiles.length - 3}
                    </div>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Create Family Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create New Family</h2>
            <form onSubmit={handleCreateFamily}>
              <div className="mb-4">
                <label htmlFor="familyName" className="block text-sm font-medium text-gray-700 mb-2">
                  Family Name
                </label>
                <input
                  type="text"
                  id="familyName"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., The Smith Family"
                  required
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setNewFamilyName("")
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Family"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

