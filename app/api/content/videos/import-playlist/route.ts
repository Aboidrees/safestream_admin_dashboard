import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole, getAuthStatusCode } from "@/lib/auth-session"

export const runtime = 'nodejs'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Extract playlist ID from a full YouTube URL or a bare playlist ID */
function parsePlaylistId(input: string): string | null {
  const trimmed = input.trim()
  try {
    const url = new URL(trimmed)
    const listParam = url.searchParams.get('list')
    if (listParam) return listParam
  } catch {
    // Not a URL — fall through
  }
  // Bare ID: YouTube playlist IDs are 34 chars starting with PL, UU, FL, RD…
  // but accept any alphanumeric/dash/underscore string of reasonable length
  if (/^[A-Za-z0-9_-]{10,}$/.test(trimmed)) return trimmed
  return null
}

/** Parse ISO 8601 duration string (PT4M13S) → seconds */
function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const h = parseInt(match[1] || '0')
  const m = parseInt(match[2] || '0')
  const s = parseInt(match[3] || '0')
  return h * 3600 + m * 60 + s
}

interface PlaylistItem {
  videoId: string
  title: string
  description: string
  thumbnailUrl: string
  channelTitle: string
}

// ── Route ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/content/videos/import-playlist
 * Body: { playlistUrl: string }
 * Requires: ADMIN or SUPER_ADMIN role
 *
 * 1. Paginates through YouTube PlaylistItems API to collect all video IDs
 * 2. Batch-fetches durations from YouTube Videos API (50 per request)
 * 3. Inserts each video into the DB with moderationStatus = PENDING
 *    — videos whose youtubeId already exists are skipped (not duplicated)
 * 4. Returns { imported, skipped, total, errors }
 */
export async function POST(req: NextRequest) {
  try {
    await requireRole('ADMIN')

    const apiKey = process.env.YOUTUBE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "YouTube API key not configured. Add YOUTUBE_API_KEY to environment variables." },
        { status: 503 }
      )
    }

    const body = await req.json()
    const { playlistUrl } = body

    if (!playlistUrl) {
      return NextResponse.json({ error: "playlistUrl is required" }, { status: 400 })
    }

    const playlistId = parsePlaylistId(playlistUrl)
    if (!playlistId) {
      return NextResponse.json(
        { error: "Invalid playlist URL or ID. Paste a YouTube playlist URL or bare playlist ID." },
        { status: 400 }
      )
    }

    // ── Step 1: Paginate through PlaylistItems API ────────────────────────────
    const items: PlaylistItem[] = []
    let pageToken: string | undefined

    do {
      const params = new URLSearchParams({
        part: 'snippet',
        playlistId,
        maxResults: '50',
        key: apiKey,
        ...(pageToken ? { pageToken } : {})
      })

      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${params}`
      )

      if (!res.ok) {
        const err = await res.json()
        return NextResponse.json(
          { error: err.error?.message || "Failed to fetch playlist from YouTube API" },
          { status: 400 }
        )
      }

      const data = await res.json()

      for (const item of data.items ?? []) {
        const snippet = item.snippet
        const videoId: string = snippet?.resourceId?.videoId
        // Skip deleted / private videos
        if (!videoId || snippet.title === 'Deleted video' || snippet.title === 'Private video') continue

        items.push({
          videoId,
          title: snippet.title ?? 'Untitled',
          description: snippet.description ?? '',
          thumbnailUrl:
            snippet.thumbnails?.high?.url ??
            snippet.thumbnails?.medium?.url ??
            snippet.thumbnails?.default?.url ??
            '',
          channelTitle: snippet.videoOwnerChannelTitle ?? snippet.channelTitle ?? ''
        })
      }

      pageToken = data.nextPageToken
    } while (pageToken)

    if (items.length === 0) {
      return NextResponse.json(
        { error: "Playlist is empty or private — no accessible videos found." },
        { status: 400 }
      )
    }

    // ── Step 2: Batch-fetch durations (Videos API, 50 IDs per request) ───────
    const durationMap: Record<string, number> = {}

    for (let i = 0; i < items.length; i += 50) {
      const batch = items.slice(i, i + 50).map(v => v.videoId)
      const params = new URLSearchParams({
        part: 'contentDetails',
        id: batch.join(','),
        key: apiKey
      })

      const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params}`)
      if (res.ok) {
        const data = await res.json()
        for (const v of data.items ?? []) {
          durationMap[v.id] = parseDuration(v.contentDetails?.duration ?? '')
        }
      }
    }

    // ── Step 3: Insert into DB, skipping duplicates ───────────────────────────
    let imported = 0
    let skipped = 0
    const errors: string[] = []

    for (const item of items) {
      try {
        const existing = await prisma.video.findUnique({
          where: { youtubeId: item.videoId },
          select: { id: true }
        })

        if (existing) {
          skipped++
          continue
        }

        await prisma.video.create({
          data: {
            youtubeId: item.videoId,
            title: item.title,
            description: item.description || null,
            thumbnailUrl: item.thumbnailUrl || null,
            channelName: item.channelTitle || null,
            duration: durationMap[item.videoId] || null,
            tags: [],
            moderationStatus: 'PENDING'
          }
        })

        imported++
      } catch (err) {
        errors.push(
          `"${item.title}": ${err instanceof Error ? err.message : 'Unknown error'}`
        )
      }
    }

    return NextResponse.json({
      message: `Import complete: ${imported} imported, ${skipped} already existed.`,
      imported,
      skipped,
      total: items.length,
      errors
    })
  } catch (error: unknown) {
    console.error("Error importing playlist:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: getAuthStatusCode(error) }
    )
  }
}
