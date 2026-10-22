import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgliteDrizzle } from "drizzle-orm/pglite";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { PGlite } from "@electric-sql/pglite";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/**
 * DATABASE_URL=postgresql://… → Neon (production).
 * DATABASE_URL=file:<dir> or unset → PGlite, an embedded Postgres stored in that folder (local dev, no account needed).
 */
export const LOCAL_DB_DIR = process.env.DATABASE_URL?.startsWith("file:") ? process.env.DATABASE_URL.slice(5) : ".pglite";
export const isLocalDb = !process.env.DATABASE_URL || process.env.DATABASE_URL.startsWith("file:");

function connect(): Db {
  if (!isLocalDb) return neonDrizzle(neon(process.env.DATABASE_URL!), { schema }) as unknown as Db;
  // One PGlite instance per process: the data directory can only be opened once.
  const g = globalThis as unknown as { __pglite?: PGlite };
  g.__pglite ??= new PGlite(LOCAL_DB_DIR);
  return pgliteDrizzle(g.__pglite, { schema }) as unknown as Db;
}

export const db = connect();
export * from "./schema";
