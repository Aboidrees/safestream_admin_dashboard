# SafeStream WebSocket Implementation Plan

## 📋 Overview

This document outlines the plan for implementing real-time WebSocket support for notifications and remote commands in SafeStream.

---

## 🎯 Current Status

**REST API:** ✅ Complete
- All notification endpoints implemented
- Remote command endpoints implemented
- Database models ready

**WebSocket:** 📱 Not Implemented (Optional Enhancement)
- Real-time notification delivery
- Real-time command status updates
- Live device status updates

---

## 🔌 WebSocket Use Cases

### **1. Real-time Notifications**
- Parent receives instant notification when:
  - Screen time limit exceeded
  - Child attempts to access restricted content
  - Device pairing request
  - Remote command executed/failed

### **2. Remote Command Status**
- Parent sees command status update in real-time:
  - PENDING → EXECUTED
  - PENDING → FAILED
  - Command acknowledgment from device

### **3. Device Status**
- Live device connection status
- Active viewing status
- Current video playing

---

## 🏗️ Architecture Options

### **Option A: Socket.IO with Next.js API Routes (Recommended)**

**Stack:**
- `socket.io` for WebSocket server
- `socket.io-client` for web client
- Next.js API route as WebSocket server
- Redis for scaling (optional)

**Pros:**
- Easy integration with Next.js
- Built-in room support
- Auto-reconnection
- Fallback to long-polling
- Large ecosystem

**Cons:**
- Requires custom Next.js server
- Not serverless-friendly

**Implementation:**
```typescript
// server.js (Custom Next.js server)
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    cors: {
      origin: process.env.NEXTAUTH_URL,
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)

    // Authenticate
    const token = socket.handshake.auth.token
    // Verify JWT and get user ID

    // Join user's room
    socket.join(`user:${userId}`)

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })
  })

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000')
  })
})
```

---

### **Option B: Pusher (Third-party Service)**

**Stack:**
- Pusher Channels
- pusher-js client
- No server changes needed

**Pros:**
- No server setup required
- Serverless-friendly
- Managed infrastructure
- Easy integration

**Cons:**
- Third-party dependency
- Monthly cost
- Data leaves your infrastructure

**Implementation:**
```typescript
// Server-side (API route)
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
})

// Trigger notification
await pusher.trigger(`user-${userId}`, 'notification', {
  type: 'SCREEN_TIME_LIMIT',
  message: 'Screen time limit exceeded'
})
```

---

### **Option C: Ably (Third-party Service)**

Similar to Pusher but with better pricing for real-time features.

---

## 🚀 Recommended Implementation (Option A)

### **Phase 1: Setup Socket.IO Server**

#### **1.1 Install Dependencies**
```bash
npm install socket.io socket.io-client
```

#### **1.2 Create Custom Server**
```typescript
// server.ts
import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { verifyJWT } from './lib/jwt'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  const io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXTAUTH_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  // Socket.IO logic
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const payload = await verifyJWT(token)
      if (!payload) {
        return next(new Error('Invalid token'))
      }

      socket.data.userId = payload.id
      socket.data.email = payload.email
      socket.data.isAdmin = payload.isAdmin
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    const userId = socket.data.userId
    console.log(`User ${userId} connected`)

    // Join user's personal room
    socket.join(`user:${userId}`)

    // If admin, join admin room
    if (socket.data.isAdmin) {
      socket.join('admins')
    }

    socket.on('disconnect', (reason) => {
      console.log(`User ${userId} disconnected: ${reason}`)
    })
  })

  // Store io instance globally for API routes to use
  global.io = io

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

#### **1.3 Update package.json**
```json
{
  "scripts": {
    "dev": "node server.ts",
    "build": "next build",
    "start": "NODE_ENV=production node server.ts"
  }
}
```

---

### **Phase 2: Emit Events from API Routes**

#### **2.1 Update Notification API**
```typescript
// app/api/dashboard/notifications/route.ts
export async function POST(req: NextRequest) {
  // ... create notification in database

  // Emit real-time event
  if (global.io) {
    global.io.to(`user:${user.id}`).emit('notification:new', notification)
  }

  return NextResponse.json({ notification }, { status: 201 })
}
```

#### **2.2 Update Remote Command API**
```typescript
// app/api/dashboard/remote-control/route.ts
export async function POST(req: NextRequest) {
  // ... create command in database

  // Emit to child device
  if (global.io) {
    // Send to all devices in child's family
    global.io.to(`child:${body.childId}`).emit('command:new', command)
    
    // Send confirmation to parent
    global.io.to(`user:${user.id}`).emit('command:sent', { 
      commandId: command.id,
      status: 'sent'
    })
  }

  return NextResponse.json({ command }, { status: 201 })
}
```

#### **2.3 Update Screen Time API**
```typescript
// app/api/dashboard/screen-time/route.ts
export async function POST(req: NextRequest) {
  // ... record screen time

  // Check if limit exceeded and emit alert
  if (exceedsLimit && global.io) {
    global.io.to(`user:${parentUserId}`).emit('screentime:alert', {
      childId: body.childId,
      childName: child.name,
      minutesUsed: screenTime.minutesUsed,
      limit: dailyLimit
    })
  }

  return NextResponse.json({ screenTime, alert })
}
```

---

### **Phase 3: Client Integration**

#### **3.1 Create Socket.IO Context**
```typescript
// lib/socket-provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.customToken) return

    const socketInstance = io({
      path: '/api/socket',
      auth: {
        token: session.customToken
      }
    })

    socketInstance.on('connect', () => {
      console.log('Socket connected')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [session])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
```

#### **3.2 Use in Components**
```typescript
// app/dashboard/notifications/page.tsx
'use client'

import { useSocket } from '@/lib/socket-provider'
import { useEffect } from 'react'

export default function NotificationsPage() {
  const { socket, isConnected } = useSocket()
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (!socket) return

    // Listen for new notifications
    socket.on('notification:new', (notification) => {
      setNotifications(prev => [notification, ...prev])
      // Show toast notification
      toast.success(notification.title)
    })

    return () => {
      socket.off('notification:new')
    }
  }, [socket])

  // ... rest of component
}
```

---

### **Phase 4: Child Device Integration**

#### **4.1 Child App WebSocket Connection**
```typescript
// In React Native child app
import io from 'socket.io-client'

const socket = io('https://app.safestream.app', {
  path: '/api/socket',
  auth: {
    token: childDeviceToken  // Special device token
  }
})

// Listen for remote commands
socket.on('command:new', (command) => {
  switch (command.commandType) {
    case 'PAUSE':
      videoPlayer.pause()
      break
    case 'LOCK_DEVICE':
      lockDevice()
      break
    // ... other commands
  }

  // Send acknowledgment
  fetch('/api/dashboard/remote-control/' + command.id, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'EXECUTED' })
  })
})
```

---

## 📊 Event Schema

### **Notification Events**
```typescript
// notification:new
{
  event: 'notification:new',
  data: {
    id: string
    type: NotificationType
    title: string
    message: string
    metadata: object
    createdAt: string
  }
}
```

### **Command Events**
```typescript
// command:new (to child device)
{
  event: 'command:new',
  data: {
    id: string
    commandType: CommandType
    payload: object
    expiresAt: string
  }
}

// command:status (to parent)
{
  event: 'command:status',
  data: {
    commandId: string
    status: 'EXECUTED' | 'FAILED'
    executedAt: string
  }
}
```

### **Screen Time Events**
```typescript
// screentime:alert
{
  event: 'screentime:alert',
  data: {
    childId: string
    childName: string
    minutesUsed: number
    limit: number
  }
}
```

---

## 🔐 Security Considerations

1. **Authentication**
   - JWT token validation on connection
   - Token refresh handling
   - Disconnect on token expiration

2. **Authorization**
   - Room-based access control
   - User can only join their own room
   - Admin room for admin events

3. **Rate Limiting**
   - Limit events per second per user
   - Prevent DoS attacks

4. **Data Validation**
   - Validate all incoming socket data
   - Sanitize payloads

---

## 📦 Deployment Considerations

### **Development**
- Run custom server locally
- Hot reload works
- Easy debugging

### **Production**

**Option 1: Single Server**
- Deploy Next.js app with custom server
- Works on VPS, Docker, Kubernetes
- Simple but not horizontally scalable

**Option 2: Separate WebSocket Server**
- Deploy Next.js app normally (Vercel)
- Deploy Socket.IO server separately
- Use Redis adapter for scaling
- More complex but scalable

**Option 3: Use Managed Service**
- Use Pusher/Ably instead
- No server management
- Easier scaling
- Monthly cost

---

## ✅ Implementation Checklist

- [ ] Install socket.io and socket.io-client
- [ ] Create custom Next.js server
- [ ] Add authentication middleware
- [ ] Create Socket.IO context provider
- [ ] Update notification API to emit events
- [ ] Update remote command API to emit events
- [ ] Update screen time API to emit events
- [ ] Create client-side listeners
- [ ] Add toast notifications
- [ ] Test real-time features
- [ ] Add reconnection handling
- [ ] Add error handling
- [ ] Document WebSocket API
- [ ] Deploy with custom server

---

## 🎯 Status

**Priority:** Low (Nice to have, not critical)
**Current:** REST API polling works fine
**Future:** Implement when scaling or when real-time is critical

**Alternative:** 
For now, use client-side polling (refresh every 30-60 seconds) which is:
- ✅ Simpler
- ✅ Works everywhere
- ✅ No custom server needed
- ✅ Vercel-compatible

---

**Recommendation:** Implement WebSocket when:
1. User base grows significantly
2. Real-time features become critical
3. Ready to manage custom server infrastructure
4. Budget allows for managed service (Pusher/Ably)

Until then, REST API with polling is sufficient! ✅

