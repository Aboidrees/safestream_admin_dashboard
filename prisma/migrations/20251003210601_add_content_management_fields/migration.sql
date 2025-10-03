-- CreateEnum
CREATE TYPE "moderation_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED', 'UNDER_REVIEW');

-- AlterTable
ALTER TABLE "collections" ADD COLUMN     "age_rating" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "category" TEXT,
ADD COLUMN     "is_mandatory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_platform" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "videos" ADD COLUMN     "moderated_at" TIMESTAMP(3),
ADD COLUMN     "moderated_by" UUID,
ADD COLUMN     "moderation_notes" TEXT,
ADD COLUMN     "moderation_status" "moderation_status" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "rejection_reason" TEXT;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_moderated_by_fkey" FOREIGN KEY ("moderated_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
