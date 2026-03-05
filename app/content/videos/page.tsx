'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Edit, Trash, Eye, CheckCircle, XCircle, Clock, BookOpen, ListVideo, AlertCircle } from 'lucide-react'
import type { Video } from '@/lib/types'
import Image from 'next/image'

interface Collection {
  id: string
  name: string
  videoCount?: number
}

interface VideoWithCollections extends Video {
  collectionVideos?: { collection: { id: string; name: string } }[]
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoWithCollections | null>(null)
  const [assignedCollectionIds, setAssignedCollectionIds] = useState<string[]>([])
  const [originalCollectionIds, setOriginalCollectionIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  // Import playlist state
  const [showImportModal, setShowImportModal] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{
    message: string
    imported: number
    skipped: number
    total: number
    errors: string[]
  } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    youtubeId: '',
    title: '',
    description: '',
    thumbnailUrl: '',
    channelName: '',
    ageRating: '',
    tags: ''
  })

  useEffect(() => {
    fetchVideos()
    fetchCollections()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/content/videos')
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

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/content/collections')
      if (response.ok) {
        const data = await response.json()
        setCollections(data.collections || [])
      }
    } catch (error) {
      console.error('Error fetching collections:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = editingVideo
        ? `/api/content/videos/${editingVideo.id}`
        : '/api/content/videos'

      const method = editingVideo ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
        })
      })

      if (!response.ok) {
        const err = await response.json()
        console.error('Save failed:', err)
        return
      }

      const saved = await response.json()
      const videoId = editingVideo?.id ?? saved.video?.id

      // Sync collection assignments (only when editing or after creating)
      if (videoId) {
        const toAdd = assignedCollectionIds.filter(id => !originalCollectionIds.includes(id))
        const toRemove = originalCollectionIds.filter(id => !assignedCollectionIds.includes(id))

        await Promise.all([
          ...toAdd.map(collectionId =>
            fetch(`/api/content/collections/${collectionId}/videos`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ videoId })
            })
          ),
          ...toRemove.map(collectionId =>
            fetch(`/api/content/collections/${collectionId}/videos`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ videoId })
            })
          )
        ])
      }

      await fetchVideos()
      handleCloseModal()
    } catch (error) {
      console.error('Error saving video:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch(`/api/content/videos/${id}`, { method: 'DELETE' })
      if (response.ok) await fetchVideos()
    } catch (error) {
      console.error('Error deleting video:', error)
    }
  }

  const handleEdit = useCallback(async (video: Video) => {
    // Fetch full video detail to get current collection assignments
    try {
      const res = await fetch(`/api/content/videos/${video.id}`)
      const data = res.ok ? await res.json() : { video }
      const fullVideo: VideoWithCollections = data.video

      const currentCollectionIds = (fullVideo.collectionVideos ?? []).map(cv => cv.collection.id)

      setEditingVideo(fullVideo)
      setAssignedCollectionIds(currentCollectionIds)
      setOriginalCollectionIds(currentCollectionIds)
      setFormData({
        youtubeId: fullVideo.youtubeId,
        title: fullVideo.title,
        description: fullVideo.description || '',
        thumbnailUrl: fullVideo.thumbnailUrl || '',
        channelName: fullVideo.channelName || '',
        ageRating: fullVideo.ageRating || '',
        tags: fullVideo.tags.join(', ')
      })
      setShowModal(true)
    } catch (error) {
      console.error('Error loading video detail:', error)
    }
  }, [])

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingVideo(null)
    setAssignedCollectionIds([])
    setOriginalCollectionIds([])
    setFormData({
      youtubeId: '',
      title: '',
      description: '',
      thumbnailUrl: '',
      channelName: '',
      ageRating: '',
      tags: ''
    })
  }

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault()
    setImporting(true)
    setImportResult(null)
    setImportError(null)

    try {
      const res = await fetch('/api/content/videos/import-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlistUrl: importUrl.trim() })
      })

      const data = await res.json()

      if (!res.ok) {
        setImportError(data.error || 'Import failed')
      } else {
        setImportResult(data)
        if (data.imported > 0) await fetchVideos()
      }
    } catch {
      setImportError('Network error — could not reach the server.')
    } finally {
      setImporting(false)
    }
  }

  const handleCloseImportModal = () => {
    setShowImportModal(false)
    setImportUrl('')
    setImportResult(null)
    setImportError(null)
  }

  const toggleCollection = (id: string) => {
    setAssignedCollectionIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'REJECTED': return <XCircle className="h-5 w-5 text-red-600" />
      case 'PENDING':  return <Clock className="h-5 w-5 text-yellow-600" />
      case 'UNDER_REVIEW': return <Eye className="h-5 w-5 text-[#ef4e50]" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':     return 'bg-green-100 text-green-800'
      case 'REJECTED':     return 'bg-red-100 text-red-800'
      case 'PENDING':      return 'bg-yellow-100 text-yellow-800'
      case 'UNDER_REVIEW': return 'bg-red-100 text-red-800'
      case 'FLAGGED':      return 'bg-orange-100 text-orange-800'
      default:             return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4e50]"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600 mt-2">Manage platform videos</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <ListVideo className="h-5 w-5" />
            Import Playlist
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#ef4e50] text-white px-4 py-2 rounded-lg hover:bg-[#c03233]"
          >
            <Plus className="h-5 w-5" />
            Add Video
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Total Videos</div>
          <div className="text-2xl font-bold text-[#ef4e50]">{videos.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Approved</div>
          <div className="text-2xl font-bold text-green-600">
            {videos.filter(v => v.moderationStatus === 'APPROVED').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {videos.filter(v => v.moderationStatus === 'PENDING').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Under Review</div>
          <div className="text-2xl font-bold text-[#ef4e50]">
            {videos.filter(v => v.moderationStatus === 'UNDER_REVIEW').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-600">Rejected</div>
          <div className="text-2xl font-bold text-red-600">
            {videos.filter(v => v.moderationStatus === 'REJECTED').length}
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative">
              <Image
                src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized
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
                  <span key={index} className="text-xs bg-red-50 text-[#ef4e50] px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {video.duration ? formatDuration(video.duration) : '—'}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(video)}
                    className="text-[#ef4e50] hover:text-[#c03233]"
                    aria-label="Edit video"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(video.id)}
                    className="text-red-600 hover:text-red-900"
                    aria-label="Delete video"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">
                {editingVideo ? 'Edit Video' : 'Add Video'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* YouTube ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.youtubeId}
                  onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4e50]"
                  placeholder="e.g., dQw4w9WgXcQ"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4e50]"
                  placeholder="Enter video title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4e50]"
                  rows={3}
                  placeholder="Enter video description"
                />
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4e50]"
                  placeholder="https://img.youtube.com/vi/VIDEO_ID/hqdefault.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to auto-use the YouTube thumbnail.
                </p>
              </div>

              {/* Channel + Age Rating (two columns) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Channel Name</label>
                  <input
                    type="text"
                    value={formData.channelName}
                    onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4e50]"
                    placeholder="Enter channel name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age Rating</label>
                  <select
                    value={formData.ageRating}
                    onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4e50]"
                  >
                    <option value="">Select rating</option>
                    <option value="G">G (All ages)</option>
                    <option value="PG">PG (7+)</option>
                    <option value="PG-13">PG-13 (13+)</option>
                    <option value="R">R (17+)</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4e50]"
                  placeholder="e.g., educational, fun, kids"
                />
              </div>

              {/* Collections Assignment */}
              {collections.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#ef4e50]" />
                    Assign to Collections
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select the collections this video should appear in.
                  </p>
                  <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto divide-y divide-gray-100">
                    {collections.map((col) => (
                      <label
                        key={col.id}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={assignedCollectionIds.includes(col.id)}
                          onChange={() => toggleCollection(col.id)}
                          className="h-4 w-4 text-[#ef4e50] border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-800">{col.name}</span>
                        {col.videoCount !== undefined && (
                          <span className="ml-auto text-xs text-gray-400">
                            {col.videoCount} videos
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#ef4e50] text-white rounded-lg hover:bg-[#c03233] disabled:opacity-60"
                >
                  {saving ? 'Saving…' : editingVideo ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Playlist Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ListVideo className="h-5 w-5 text-[#ef4e50]" />
                Import from YouTube Playlist
              </h3>
              <button
                onClick={handleCloseImportModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Input form */}
              {!importResult && (
                <form onSubmit={handleImport} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Playlist URL or ID
                    </label>
                    <input
                      type="text"
                      required
                      value={importUrl}
                      onChange={e => setImportUrl(e.target.value)}
                      placeholder="https://www.youtube.com/playlist?list=PL… or bare playlist ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ef4e50] text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      All videos will be imported as <span className="font-medium text-yellow-700">PENDING</span> and require moderation before going live.
                    </p>
                  </div>

                  {importError && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      {importError}
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={handleCloseImportModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={importing}
                      className="px-4 py-2 bg-[#ef4e50] text-white rounded-lg hover:bg-[#c03233] disabled:opacity-60 text-sm flex items-center gap-2"
                    >
                      {importing ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                          Importing…
                        </>
                      ) : 'Import'}
                    </button>
                  </div>
                </form>
              )}

              {/* Result summary */}
              {importResult && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-blue-700">{importResult.total}</p>
                      <p className="text-xs text-blue-600 mt-1">Found in playlist</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-green-700">{importResult.imported}</p>
                      <p className="text-xs text-green-600 mt-1">Imported</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-2xl font-bold text-gray-600">{importResult.skipped}</p>
                      <p className="text-xs text-gray-500 mt-1">Already existed</p>
                    </div>
                  </div>

                  {importResult.imported > 0 && (
                    <p className="text-sm text-gray-600 text-center">
                      Videos are now in the <span className="font-medium text-yellow-700">Moderation Queue</span> awaiting review.
                    </p>
                  )}

                  {importResult.errors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-700 mb-1">
                        {importResult.errors.length} error{importResult.errors.length > 1 ? 's' : ''}:
                      </p>
                      <ul className="text-xs text-red-600 space-y-1 max-h-24 overflow-y-auto">
                        {importResult.errors.map((e, i) => <li key={i}>• {e}</li>)}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => { setImportResult(null); setImportUrl('') }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    >
                      Import Another
                    </button>
                    <button
                      onClick={handleCloseImportModal}
                      className="px-4 py-2 bg-[#ef4e50] text-white rounded-lg hover:bg-[#c03233] text-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
