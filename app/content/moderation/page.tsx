'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Eye, Clock, AlertTriangle } from 'lucide-react'
import type { Video } from '@/lib/types'

export default function ModerationPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [moderationNotes, setModerationNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content/moderation/videos')
      if (response.ok) {
        const data = await response.json()
        setVideos(data.videos)
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModeration = async (videoId: string, action: 'approve' | 'reject' | 'flag' | 'review') => {
    try {
      const response = await fetch(`/api/content/moderation/videos/${videoId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: moderationNotes,
          rejectionReason: action === 'reject' ? rejectionReason : null
        })
      })

      if (response.ok) {
        await fetchVideos()
        setShowModal(false)
        setSelectedVideo(null)
        setModerationNotes('')
        setRejectionReason('')
      }
    } catch (error) {
      console.error('Error moderating video:', error)
    }
  }

  const openModerationModal = (video: Video) => {
    setSelectedVideo(video)
    setModerationNotes(video.moderationNotes || '')
    setRejectionReason(video.rejectionReason || '')
    setShowModal(true)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'UNDER_REVIEW':
        return <Eye className="h-5 w-5 text-blue-600" />
      case 'FLAGGED':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800'
      case 'FLAGGED':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const pendingVideos = videos.filter(v => v.moderationStatus === 'PENDING')
  const underReviewVideos = videos.filter(v => v.moderationStatus === 'UNDER_REVIEW')
  const flaggedVideos = videos.filter(v => v.moderationStatus === 'FLAGGED')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
        <p className="text-gray-600 mt-2">Review and moderate video content</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Pending Review</div>
          <div className="text-2xl font-bold text-yellow-600">{pendingVideos.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Under Review</div>
          <div className="text-2xl font-bold text-blue-600">{underReviewVideos.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Flagged</div>
          <div className="text-2xl font-bold text-orange-600">{flaggedVideos.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Videos</div>
          <div className="text-2xl font-bold text-gray-600">{videos.length}</div>
        </div>
      </div>

      {/* Videos Needing Review */}
      <div className="space-y-6">
        {/* Pending Videos */}
        {pendingVideos.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Review ({pendingVideos.length})</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pendingVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusIcon(video.moderationStatus)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{video.channelName}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(video.moderationStatus)}`}>
                        {video.moderationStatus}
                      </span>
                      {video.ageRating && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                          {video.ageRating}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => openModerationModal(video)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Under Review Videos */}
        {underReviewVideos.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Under Review ({underReviewVideos.length})</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {underReviewVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusIcon(video.moderationStatus)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{video.channelName}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(video.moderationStatus)}`}>
                        {video.moderationStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => openModerationModal(video)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flagged Videos */}
        {flaggedVideos.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Flagged Content ({flaggedVideos.length})</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {flaggedVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden border-l-4 border-orange-500">
                  <div className="relative">
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      {getStatusIcon(video.moderationStatus)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{video.channelName}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(video.moderationStatus)}`}>
                        {video.moderationStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => openModerationModal(video)}
                        className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Moderation Modal */}
      {showModal && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Moderate Video</h3>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <img 
                    src={selectedVideo.thumbnailUrl} 
                    alt={selectedVideo.title}
                    className="w-full rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">{selectedVideo.title}</h4>
                  <p className="text-gray-600 mb-4">{selectedVideo.channelName}</p>
                  <p className="text-sm text-gray-700 mb-4">{selectedVideo.description}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {selectedVideo.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Moderation Notes</label>
                  <textarea
                    value={moderationNotes}
                    onChange={(e) => setModerationNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Add notes about this video..."
                  />
                </div>
                
                {selectedVideo.moderationStatus === 'PENDING' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason (if rejecting)</label>
                    <input
                      type="text"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Reason for rejection..."
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleModeration(selectedVideo.id, 'approve')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleModeration(selectedVideo.id, 'reject')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleModeration(selectedVideo.id, 'flag')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Flag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
