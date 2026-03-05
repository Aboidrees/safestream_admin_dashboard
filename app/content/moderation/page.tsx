'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle, XCircle, Eye, Clock, AlertTriangle,
  RotateCcw, User, ChevronDown
} from 'lucide-react'
import Image from 'next/image'

interface ModerationVideo {
  id: string
  youtubeId: string
  title: string
  description: string
  thumbnailUrl: string
  duration: number
  channelName: string
  ageRating: string
  tags: string[]
  moderationStatus: 'PENDING' | 'UNDER_REVIEW' | 'FLAGGED'
  moderatedById: string | null
  moderatedByName: string | null
  moderatedAt: string | null
  moderationNotes: string | null
  rejectionReason: string | null
  createdAt: string
}

interface Admin {
  id: string
  name: string
  email: string
  role: string
}

type ModerationAction = 'approve' | 'reject' | 'flag' | 'review' | 'pending'

function formatDuration(seconds: number): string {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function thumbnailSrc(video: ModerationVideo): string {
  return video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
}

export default function ModerationPage() {
  const [videos, setVideos] = useState<ModerationVideo[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedVideo, setSelectedVideo] = useState<ModerationVideo | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [moderationNotes, setModerationNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [assignTo, setAssignTo] = useState('')
  const [actioning, setActioning] = useState(false)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkAction, setBulkAction] = useState<ModerationAction | ''>('')
  const [bulkNotes, setBulkNotes] = useState('')
  const [bulkRejectionReason, setBulkRejectionReason] = useState('')
  const [showBulkPanel, setShowBulkPanel] = useState(false)
  const [bulking, setBulking] = useState(false)

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/content/moderation/videos')
      if (res.ok) {
        const data = await res.json()
        setVideos(data.videos)
      }
    } catch (err) {
      console.error('Error fetching moderation queue:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admins')
      if (res.ok) {
        const data = await res.json()
        setAdmins(data.admins || [])
      }
    } catch (err) {
      console.error('Error fetching admins:', err)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
    fetchAdmins()
  }, [fetchVideos, fetchAdmins])

  const openModal = (video: ModerationVideo) => {
    setSelectedVideo(video)
    setModerationNotes(video.moderationNotes || '')
    setRejectionReason(video.rejectionReason || '')
    setAssignTo(video.moderatedById || '')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedVideo(null)
    setModerationNotes('')
    setRejectionReason('')
    setAssignTo('')
  }

  const handleAction = async (action: ModerationAction) => {
    if (!selectedVideo) return
    setActioning(true)
    try {
      const res = await fetch(`/api/content/moderation/videos/${selectedVideo.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          notes: moderationNotes,
          rejectionReason: action === 'reject' ? rejectionReason : undefined,
          assignTo: assignTo || undefined,
        })
      })
      if (res.ok) {
        await fetchVideos()
        closeModal()
      }
    } catch (err) {
      console.error('Error moderating video:', err)
    } finally {
      setActioning(false)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => setSelectedIds(new Set(videos.map(v => v.id)))
  const deselectAll = () => { setSelectedIds(new Set()); setShowBulkPanel(false) }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return
    setBulking(true)
    try {
      const res = await fetch('/api/content/moderation/videos/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: bulkAction,
          videoIds: Array.from(selectedIds),
          notes: bulkNotes || undefined,
          rejectionReason: bulkAction === 'reject' ? bulkRejectionReason : undefined,
        })
      })
      if (res.ok) {
        await fetchVideos()
        deselectAll()
        setBulkAction('')
        setBulkNotes('')
        setBulkRejectionReason('')
      }
    } catch (err) {
      console.error('Error bulk moderating:', err)
    } finally {
      setBulking(false)
    }
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':     return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'REJECTED':     return <XCircle className="h-5 w-5 text-red-600" />
      case 'PENDING':      return <Clock className="h-5 w-5 text-yellow-600" />
      case 'UNDER_REVIEW': return <Eye className="h-5 w-5 text-blue-600" />
      case 'FLAGGED':      return <AlertTriangle className="h-5 w-5 text-orange-600" />
      default:             return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      APPROVED:     'bg-green-100 text-green-800',
      REJECTED:     'bg-red-100 text-red-800',
      PENDING:      'bg-yellow-100 text-yellow-800',
      UNDER_REVIEW: 'bg-blue-100 text-blue-800',
      FLAGGED:      'bg-orange-100 text-orange-800',
    }
    return map[status] ?? 'bg-gray-100 text-gray-800'
  }

  const pending     = videos.filter(v => v.moderationStatus === 'PENDING')
  const underReview = videos.filter(v => v.moderationStatus === 'UNDER_REVIEW')
  const flagged     = videos.filter(v => v.moderationStatus === 'FLAGGED')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ef4e50]" />
      </div>
    )
  }

  const VideoCard = ({ video, borderColor }: { video: ModerationVideo; borderColor?: string }) => (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${borderColor ? `border-l-4 ${borderColor}` : ''}`}>
      <div className="relative">
        <Image
          src={thumbnailSrc(video)}
          alt={video.title}
          width={400}
          height={225}
          className="w-full h-48 object-cover"
          unoptimized
        />
        <label className="absolute top-2 left-2 cursor-pointer bg-white rounded p-0.5 shadow">
          <input
            type="checkbox"
            checked={selectedIds.has(video.id)}
            onChange={() => toggleSelect(video.id)}
            className="h-4 w-4 rounded border-gray-300 text-[#ef4e50]"
          />
        </label>
        <div className="absolute top-2 right-2 bg-white rounded-full p-0.5 shadow">
          {statusIcon(video.moderationStatus)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 text-sm">{video.title}</h3>
        <p className="text-xs text-gray-500 mb-2">{video.channelName}</p>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`px-2 py-0.5 text-xs rounded font-medium ${statusBadge(video.moderationStatus)}`}>
            {video.moderationStatus.replace('_', ' ')}
          </span>
          {video.ageRating && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">{video.ageRating}</span>
          )}
        </div>
        {video.moderatedByName && (
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <User className="h-3 w-3" /> {video.moderatedByName}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-400">{formatDuration(video.duration)}</span>
          <button
            onClick={() => openModal(video)}
            className="px-3 py-1 bg-[#ef4e50] text-white text-xs rounded hover:bg-[#c03233]"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600 mt-1">Review and moderate video content</p>
        </div>
        <div className="flex gap-2 items-center">
          {selectedIds.size > 0 ? (
            <>
              <span className="text-sm text-gray-500">{selectedIds.size} selected</span>
              <button onClick={deselectAll} className="text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Deselect all
              </button>
              <button
                onClick={() => setShowBulkPanel(p => !p)}
                className="text-sm px-3 py-2 bg-[#ef4e50] text-white rounded-lg hover:bg-[#c03233] flex items-center gap-1"
              >
                Bulk action <ChevronDown className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button onClick={selectAll} className="text-sm px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Select all
            </button>
          )}
        </div>
      </div>

      {/* Bulk action panel */}
      {showBulkPanel && selectedIds.size > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">
            Apply to {selectedIds.size} selected video{selectedIds.size !== 1 ? 's' : ''}:
          </p>
          <div className="flex flex-wrap gap-2">
            {(['approve', 'reject', 'flag', 'review', 'pending'] as ModerationAction[]).map(a => (
              <button
                key={a}
                onClick={() => setBulkAction(a)}
                className={`px-3 py-1.5 text-sm rounded-lg border font-medium capitalize ${
                  bulkAction === a
                    ? 'bg-[#ef4e50] text-white border-[#ef4e50]'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {a === 'pending' ? 'Send to queue' : a}
              </button>
            ))}
          </div>
          {bulkAction && (
            <div className="space-y-2">
              <input
                type="text"
                value={bulkNotes}
                onChange={e => setBulkNotes(e.target.value)}
                placeholder="Optional notes for all selected videos…"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ef4e50]"
              />
              {bulkAction === 'reject' && (
                <input
                  type="text"
                  value={bulkRejectionReason}
                  onChange={e => setBulkRejectionReason(e.target.value)}
                  placeholder="Rejection reason…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ef4e50]"
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowBulkPanel(false); setBulkAction('') }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBulkAction}
                  disabled={bulking}
                  className="px-4 py-2 bg-[#ef4e50] text-white rounded-lg text-sm hover:bg-[#c03233] disabled:opacity-60"
                >
                  {bulking ? 'Applying…' : `Apply to ${selectedIds.size} videos`}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-600">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-600">{pending.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-600">Under Review</p>
          <p className="text-2xl font-bold text-blue-600">{underReview.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-600">Flagged</p>
          <p className="text-2xl font-bold text-orange-600">{flagged.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-5">
          <p className="text-sm text-gray-600">Total in Queue</p>
          <p className="text-2xl font-bold text-gray-700">{videos.length}</p>
        </div>
      </div>

      {videos.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <CheckCircle className="mx-auto h-12 w-12 text-green-400 mb-3" />
          <p className="font-medium">Queue is clear — nothing to review.</p>
        </div>
      )}

      {pending.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Review <span className="text-yellow-600">({pending.length})</span></h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pending.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </section>
      )}

      {underReview.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Under Review <span className="text-blue-600">({underReview.length})</span></h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {underReview.map(v => <VideoCard key={v.id} video={v} />)}
          </div>
        </section>
      )}

      {flagged.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Flagged Content <span className="text-orange-600">({flagged.length})</span></h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {flagged.map(v => <VideoCard key={v.id} video={v} borderColor="border-orange-400" />)}
          </div>
        </section>
      )}

      {/* Review modal */}
      {showModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Review Video</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600" aria-label="Close">✕</button>
            </div>
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div>
                  <Image
                    src={thumbnailSrc(selectedVideo)}
                    alt={selectedVideo.title}
                    width={600}
                    height={338}
                    className="w-full rounded-lg object-cover"
                    unoptimized
                  />
                  <a
                    href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center mt-2 text-sm text-[#ef4e50] hover:underline"
                  >
                    Watch on YouTube ↗
                  </a>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${statusBadge(selectedVideo.moderationStatus)}`}>
                      {selectedVideo.moderationStatus.replace('_', ' ')}
                    </span>
                    {selectedVideo.ageRating && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded">{selectedVideo.ageRating}</span>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold mb-1">{selectedVideo.title}</h4>
                  <p className="text-sm text-gray-500 mb-3">{selectedVideo.channelName} · {formatDuration(selectedVideo.duration)}</p>
                  {selectedVideo.description && (
                    <p className="text-sm text-gray-700 mb-3 line-clamp-4">{selectedVideo.description}</p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {selectedVideo.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-red-50 text-[#ef4e50] px-2 py-0.5 rounded">{tag}</span>
                    ))}
                  </div>
                  {selectedVideo.rejectionReason && (
                    <div className="bg-red-50 border border-red-200 rounded p-2 text-xs text-red-700">
                      <span className="font-medium">Previous rejection:</span> {selectedVideo.rejectionReason}
                    </div>
                  )}
                </div>
              </div>

              {/* Assign moderator */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Moderator
                </label>
                <select
                  value={assignTo}
                  onChange={e => setAssignTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ef4e50]"
                >
                  <option value="">— Self (current admin) —</option>
                  {admins.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Moderation Notes</label>
                <textarea
                  value={moderationNotes}
                  onChange={e => setModerationNotes(e.target.value)}
                  rows={3}
                  placeholder="Add notes about this video…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ef4e50]"
                />
              </div>

              {/* Rejection reason */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Required when rejecting…"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#ef4e50]"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap justify-end gap-2">
                <button onClick={closeModal} disabled={actioning} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50">Cancel</button>
                <button onClick={() => handleAction('pending')} disabled={actioning} title="Send back to Pending queue"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1">
                  <RotateCcw className="h-4 w-4 text-gray-500" /> Re-queue
                </button>
                <button onClick={() => handleAction('review')} disabled={actioning}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">Under Review</button>
                <button onClick={() => handleAction('flag')} disabled={actioning}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50">Flag</button>
                <button onClick={() => handleAction('reject')} disabled={actioning}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">Reject</button>
                <button onClick={() => handleAction('approve')} disabled={actioning}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                  {actioning ? 'Saving…' : 'Approve'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
