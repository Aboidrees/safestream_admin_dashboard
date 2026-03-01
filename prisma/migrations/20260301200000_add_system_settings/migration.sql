-- CreateTable
CREATE TABLE IF NOT EXISTS "system_settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("key")
);

-- Seed default settings
INSERT INTO "system_settings" ("key", "value", "updated_at") VALUES
  ('platform', '{"siteName":"SafeStream","siteUrl":"https://safestream.app","adminEmail":"admin@safestream.app","maintenanceMode":false,"allowRegistration":true,"requireEmailVerification":true,"maxChildrenPerFamily":5,"defaultScreenTimeLimit":120,"enableNotifications":true,"enablePublicCollections":true}', NOW())
ON CONFLICT ("key") DO NOTHING;
