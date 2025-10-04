import { NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/auth-session"
import type { PlatformSettings } from "@/lib/types"

// In a real implementation, these would be stored in a database
// For now, we'll use environment variables or a config file
export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin()

    const settings: PlatformSettings = await req.json()

    // Validate settings
    if (!settings.siteName || !settings.siteUrl || !settings.adminEmail) {
      return NextResponse.json(
        { error: "Missing required settings" },
        { status: 400 }
      )
    }

    // Save settings to database
    // Note: In a real implementation, you'd create a settings table
    // For now, we'll store in environment or a simple config file
    console.log("Settings update requested by:", user.email)
    console.log("New settings:", settings)

    return NextResponse.json({ 
      message: "Settings saved successfully",
      settings 
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req)
    
    if (!user || !user.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    // Fetch settings from database
    // Note: In a real implementation, you'd fetch from a settings table
    // For now, return default settings
    const settings: PlatformSettings = {
      siteName: "SafeStream",
      siteUrl: "https://safestream.app",
      adminEmail: "admin@safestream.app",
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      maxChildrenPerFamily: 5,
      defaultScreenTimeLimit: 120,
      enableNotifications: true,
      enablePublicCollections: true,
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

