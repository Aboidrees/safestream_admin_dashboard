#!/bin/sh
set -e

echo "Running database migrations..."
pnpm prisma migrate deploy
echo "Migrations complete. Starting app..."
exec pnpm start
