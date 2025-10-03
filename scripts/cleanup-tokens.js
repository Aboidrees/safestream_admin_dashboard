#!/usr/bin/env node

import { cleanupExpiredTokens } from '../lib/jwt-enhanced.js'

async function main() {
  try {
    console.log('🧹 Starting token cleanup...')
    
    const cleanedCount = await cleanupExpiredTokens()
    
    console.log(`✅ Cleaned up ${cleanedCount} expired/revoked tokens`)
  } catch (error) {
    console.error('❌ Token cleanup failed:', error)
    process.exit(1)
  }
}

main()
