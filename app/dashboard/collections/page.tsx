"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface Collection {
  id: string
  name: string
  description: string | null
  thumbnailUrl: string | null
  isPublic: boolean
  isMandatory: boolean
  ageRating: number | null
  category: string | null
  creator: {
    id: string
    name: string
  }
  _count: {
    videos: number
  }
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    ageRating: "",
    isPublic: false,
    isMandatory: false
  })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/collections')
      const data = await response.json()
      setCollections(data.collections || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    try {
      setCreating(true)
      const response = await fetch('/api/dashboard/collections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          category: formData.category.trim() || null,
          ageRating: formData.ageRating ? parseInt(formData.ageRating) : null,
          isPublic: formData.isPublic,
          isMandatory: formData.isMandatory
        }),
      })

      if (response.ok) {
        setFormData({
          name: "",
          description: "",
          category: "",
          ageRating: "",
          isPublic: false,
          isMandatory: false
        })
        setShowCreateModal(false)
        fetchCollections()
      }
    } catch (error) {
      console.error('Error creating collection:', error)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading collections...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Collections</h1>
          <p className="text-gray-600 mt-1">Curate safe and engaging content for your children</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Create Collection
        </button>
      </div>

      {collections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Collections Yet</h2>
          <p className="text-gray-500 mb-6">Create your first collection to organize content</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Create Your First Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/dashboard/collections/${collection.id}`}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white">
                {collection.thumbnailUrl ? (
                  <img src={collection.thumbnailUrl} alt={collection.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl">📚</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{collection.name}</h3>
                {collection.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{collection.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      {collection._count.videos} videos
                    </span>
                    {collection.ageRating && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        Age {collection.ageRating}+
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {collection.isPublic && (
                      <span className="text-gray-400" title="Public">
                        🌍
                      </span>
                    )}
                    {collection.isMandatory && (
                      <span className="text-red-500" title="Mandatory">
                        ⭐
                      </span>
                    )}
                  </div>
                </div>
                {collection.category && (
                  <div className="mt-2 text-xs text-gray-500">
                    {collection.category}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Collection</h2>
            <form onSubmit={handleCreateCollection}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Collection Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., Educational Videos"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Describe this collection..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      <option value="">Select category...</option>
                      <option value="Educational">Educational</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Music">Music</option>
                      <option value="Stories">Stories</option>
                      <option value="Science">Science</option>
                      <option value="Arts">Arts & Crafts</option>
                      <option value="Sports">Sports</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="ageRating" className="block text-sm font-medium text-gray-700 mb-2">
                      Age Rating
                    </label>
                    <input
                      type="number"
                      id="ageRating"
                      value={formData.ageRating}
                      onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="e.g., 8"
                      min="0"
                      max="18"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                      className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      Make this collection public (visible to other parents)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isMandatory}
                      onChange={(e) => setFormData({ ...formData, isMandatory: e.target.checked })}
                      className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="text-sm text-gray-700">
                      Mark as mandatory viewing
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false)
                    setFormData({
                      name: "",
                      description: "",
                      category: "",
                      ageRating: "",
                      isPublic: false,
                      isMandatory: false
                    })
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
                  {creating ? "Creating..." : "Create Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

