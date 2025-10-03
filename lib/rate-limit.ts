import { NextRequest } from 'next/server'

// In-memory store for rate limiting (in production, use Redis)
const attempts = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
    windowMs: number // Time window in milliseconds
    maxAttempts: number // Maximum attempts per window
    keyGenerator?: (req: NextRequest) => string // Custom key generator
}

export class RateLimiter {
    private options: Required<RateLimitOptions>

    constructor(options: RateLimitOptions) {
        this.options = {
            keyGenerator: (req) => {
                // Use IP address as default key
                const forwarded = req.headers.get('x-forwarded-for')
                const ip = forwarded ? forwarded.split(',')[0] : req.nextUrl.hostname || 'unknown'
                return ip
            },
            ...options
        }
    }

    async check(req: NextRequest): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
        const key = this.options.keyGenerator(req)
        const now = Date.now()

        // Clean up expired entries
        for (const [k, v] of attempts.entries()) {
            if (v.resetTime < now) {
                attempts.delete(k)
            }
        }

        const current = attempts.get(key)

        if (!current || current.resetTime < now) {
            // First attempt or window expired
            attempts.set(key, {
                count: 1,
                resetTime: now + this.options.windowMs
            })
            return {
                allowed: true,
                remaining: this.options.maxAttempts - 1,
                resetTime: now + this.options.windowMs
            }
        }

        if (current.count >= this.options.maxAttempts) {
            return {
                allowed: false,
                remaining: 0,
                resetTime: current.resetTime
            }
        }

        // Increment count
        current.count++
        attempts.set(key, current)

        return {
            allowed: true,
            remaining: this.options.maxAttempts - current.count,
            resetTime: current.resetTime
        }
    }
}

// Pre-configured rate limiters
export const loginRateLimiter = new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5, // 5 attempts per 15 minutes
    keyGenerator: (req) => {
        // Use IP + User-Agent for more specific tracking
        const forwarded = req.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0] : req.nextUrl.hostname || 'unknown'
        const userAgent = req.headers.get('user-agent') || 'unknown'
        return `${ip}:${userAgent}`
    }
})

export const apiRateLimiter = new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 100, // 100 requests per minute
})

export const strictApiRateLimiter = new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxAttempts: 20, // 20 requests per minute for sensitive endpoints
})
