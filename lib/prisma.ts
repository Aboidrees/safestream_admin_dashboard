import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@safestream/database";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  // Normalise SSL mode to verify-full to silence pg's security deprecation warning.
  // sslmode=prefer/require/verify-ca are all treated as verify-full already;
  // making it explicit avoids the warning in pg v8 and matches pg v9 semantics.
  const connectionString = (process.env.DATABASE_URL ?? "").replace(
    /sslmode=(prefer|require|verify-ca)/g,
    "sslmode=verify-full"
  );
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

