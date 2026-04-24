import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
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

// Runtime shape check for values read out of Prisma's `Json` column and values
// posted by the admin UI. Prisma types JSON as
// `string | number | boolean | JsonObject | JsonArray | null`, so a direct
// `as PlatformSettings` cast is unsound and — correctly — rejected by TS.
// Validating here means bad/legacy data in the DB falls back to
// DEFAULT_SETTINGS instead of silently corrupting the admin UI at runtime,
// and bad payloads from the client 400 with precise field-level errors.
const PlatformSettingsSchema: z.ZodType<PlatformSettings> = z.object({
  siteName: z.string().min(1),
  siteUrl: z.string().url(),
  adminEmail: z.string().email(),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  maxChildrenPerFamily: z.number().int().min(1),
  defaultScreenTimeLimit: z.number().int().min(0),
  enableNotifications: z.boolean(),
  enablePublicCollections: z.boolean(),
})

export async function GET(_req: NextRequest) {
  try {
    await requireAdmin() // any admin can read settings

    const record = await prisma.systemSetting.findUnique({
      where: { key: SETTINGS_KEY }
    })

    if (!record) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS })
    }

    const parsed = PlatformSettingsSchema.safeParse(record.value)
    if (!parsed.success) {
      // Stored value no longer matches the schema (field added, DB migrated
      // but the row never re-saved, etc.). Serve defaults and log — don't
      // 500 the admin panel.
      console.warn(
        "settings: stored value failed schema validation, serving defaults",
        parsed.error.issues,
      )
      return NextResponse.json({ settings: DEFAULT_SETTINGS })
    }

    return NextResponse.json({ settings: parsed.data })
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

    // Validate incoming payload against the same schema used for reads.
    // Catches missing fields, wrong types, empty strings, bad URL / email
    // formats before any DB write.
    const body: unknown = await req.json()
    const parsed = PlatformSettingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid settings payload",
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join("."),
            message: i.message,
          })),
        },
        { status: 400 },
      )
    }
    const settings = parsed.data

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
