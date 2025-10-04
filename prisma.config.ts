import path from 'node:path'
import { defineConfig } from "prisma/config";

// Import environment variables
import "dotenv/config";

export default defineConfig({
    schema: path.join("prisma", "schema.prisma"),
    migrations: {
        path: path.join("prisma", "migrations"),
        seed: "tsx prisma/seed.ts"
    },
    views: {
        path: path.join("prisma", "views")
    },
    experimental: {
        adapter: false,
        externalTables: false,
        studio: false
    }
});