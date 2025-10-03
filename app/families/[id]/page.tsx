'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import type { Family, User, ChildProfile, Collection, Video } from '@/lib/types'
import Image from 'next/image'

interface Child extends ChildProfile {
  familyName: string
  parentName: string
  screenTimeLimit: number
  qrCode: string
}

type TabType = 'users' | 'children' | 'collections'

export default function FamilyDetailPage() {
  const params = useParams()
  const familyId = params.id as string

  const [activeTab, setActiveTab] = useState<TabType>('users')
  const [family, setFamily] = useState<Family | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [children, setChildren] = useState<Child[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFamilyData = useCallback(async () => {
    try {
      setLoading(true)

      // Fetch family details
      const familyRes = await fetch(`/api/families/${familyId}`)
      if (!familyRes.ok) throw new Error('Failed to fetch family')
      const familyData = await familyRes.json()
      setFamily(familyData.family)

      // Fetch family users
      const usersRes = await fetch(`/api/families/${familyId}/users`)
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData.users)
      }

      // Fetch family children
      const childrenRes = await fetch(`/api/families/${familyId}/children`)
      if (childrenRes.ok) {
        const childrenData = await childrenRes.json()
        setChildren(childrenData.children)
      }

      // Fetch family collections
      const collectionsRes = await fetch(`/api/families/${familyId}/collections`)
      if (collectionsRes.ok) {
        const collectionsData = await collectionsRes.json()
        setCollections(collectionsData.collections)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [familyId])

  useEffect(() => {
    fetchFamilyData()
  }, [fetchFamilyData])

  const fetchCollectionVideos = async (collectionId: string) => {
    try {
      const res = await fetch(`/api/collections/${collectionId}/videos`)
      if (res.ok) {
        const data = await res.json()
        setVideos(data.videos)
      }
    } catch (err) {
      console.error('Failed to fetch collection videos:', err)
    }
  }

  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection)
    fetchCollectionVideos(collection.id)
  }

  const closeVideoModal = () => {
    setSelectedCollection(null)
    setVideos([])
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !family) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600">{error || 'Family not found'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Family Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{family.name}</h1>
            <p className="text-gray-600 mt-2">
              Created by {family.parentName} ({family.parentEmail})
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Created: {new Date(family.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{family.childrenCount}</div>
            <div className="text-sm text-gray-600">Children</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'users', label: 'Users', count: users.length },
              { id: 'children', label: 'Children', count: children.length },
              { id: 'collections', label: 'Collections', count: collections.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
              {users.length === 0 ? (
                <p className="text-gray-500">No users found for this family.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {users.map((user) => (
                    <div key={user.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Children Tab */}
          {activeTab === 'children' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Child Profiles</h3>
              {children.length === 0 ? (
                <p className="text-gray-500">No children found for this family.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {children.map((child) => (
                    <div key={child.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {child.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{child.name}</h4>
                          <p className="text-sm text-gray-600">Age: {child.age}</p>
                          <p className="text-xs text-gray-500">QR: {child.qrCode}</p>
                          <p className="text-xs text-blue-600">Screen Time: {child.screenTimeLimit} min</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collections Tab */}
          {activeTab === 'collections' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Collections</h3>
              {collections.length === 0 ? (
                <p className="text-gray-500">No collections found for this family.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {collections.map((collection) => (
                    <div
                      key={collection.id}
                      className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handleCollectionClick(collection)}
                    >
                      <h4 className="font-medium text-gray-900">{collection.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{collection.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-blue-600">{collection.videoCount} videos</span>
                        <span className="text-xs text-gray-500">
                          {collection.isPublic ? 'Public' : 'Private'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {selectedCollection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedCollection.name} - Videos</h3>
              <button
                onClick={closeVideoModal}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {videos.length === 0 ? (
                <p className="text-gray-500">No videos in this collection.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex space-x-3">
                        <Image
                          src={video.thumbnailUrl || ''}
                          alt={video.title}
                          className="w-20 h-15 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 text-sm">{video.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{video.channelName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {Math.floor((video.duration || 0) / 60)}:{((video.duration || 0) % 60).toString().padStart(2, '0')}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {video.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
