-- CreateTable
CREATE TABLE "token_sessions" (
    "id" UUID NOT NULL,
    "jti" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "token_type" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "token_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_sessions_jti_key" ON "token_sessions"("jti");

-- CreateIndex
CREATE INDEX "token_sessions_jti_idx" ON "token_sessions"("jti");

-- CreateIndex
CREATE INDEX "token_sessions_user_id_idx" ON "token_sessions"("user_id");

-- CreateIndex
CREATE INDEX "token_sessions_expires_at_idx" ON "token_sessions"("expires_at");

-- AddForeignKey
ALTER TABLE "token_sessions" ADD CONSTRAINT "token_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
