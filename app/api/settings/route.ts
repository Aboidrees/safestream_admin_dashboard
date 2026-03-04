import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin, requireRole, getAuthStatusCode } from "@/lib/auth-session"
import type { PlatformSettings } from "@/lib/types"

const SETTINGS_KEY = 'platform'

const DEFAULT_SETTINGS: PlatformSettings = {
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

export async function GET(_req: NextRequest) {
  try {
    await requireAdmin() // any admin can read settings

    const record = await prisma.systemSetting.findUnique({
      where: { key: SETTINGS_KEY }
    })

    const settings: PlatformSettings = record
      ? (record.value as PlatformSettings)
      : DEFAULT_SETTINGS

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireRole('ADMIN') // ADMIN or SUPER_ADMIN can change settings

    const settings: PlatformSettings = await req.json()

    if (!settings.siteName || !settings.siteUrl || !settings.adminEmail) {
      return NextResponse.json(
        { error: "Missing required settings: siteName, siteUrl, adminEmail" },
        { status: 400 }
      )
    }

    const record = await prisma.systemSetting.upsert({
      where: { key: SETTINGS_KEY },
      update: {
        value: settings as object,
        updatedBy: admin.email
      },
      create: {
        key: SETTINGS_KEY,
        value: settings as object,
        updatedBy: admin.email
      }
    })

    return NextResponse.json({
      message: "Settings saved successfully",
      settings: record.value
    })
  } catch (error) {
    console.error("Error saving settings:", error)
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    return NextResponse.json(
      { error: errorMessage },
      { status: getAuthStatusCode(error) === 500 ? 500 : getAuthStatusCode(error) }
    )
  }
}
