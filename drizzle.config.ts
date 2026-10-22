import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
const local = !url || url.startsWith("file:");

// Local: embedded PGlite in a folder. Production: Neon (use the unpooled URL for migrations).
export default local
  ? defineConfig({ schema: "./src/db/schema.ts", out: "./drizzle", dialect: "postgresql", driver: "pglite", dbCredentials: { url: url?.slice(5) || ".pglite" } })
  : defineConfig({ schema: "./src/db/schema.ts", out: "./drizzle", dialect: "postgresql", dbCredentials: { url: url! } });
