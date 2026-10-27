import { neon } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
import { drizzle as pgliteDrizzle } from "drizzle-orm/pglite";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";
import * as schema from "./schema";

export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

/**
 * DATABASE_URL=postgresql://…neon.tech… → Neon over HTTP.
 * DATABASE_URL=postgresql://… (anything else, e.g. Railway) → node-postgres pool.
 * DATABASE_URL=file:<dir> or unset → PGlite, an embedded Postgres stored in that folder (local dev, no account needed).
 */
const url = process.env.DATABASE_URL;
export const LOCAL_DB_DIR = url?.startsWith("file:") ? url.slice(5) : ".pglite";
export const isLocalDb = !url || url.startsWith("file:");

function connect(): Db {
  if (!isLocalDb && url!.includes("neon.tech")) return neonDrizzle(neon(url!), { schema }) as unknown as Db;
  // One client per process: the PGlite data directory can only be opened once, and the pool is shared.
  const g = globalThis as unknown as { __pglite?: PGlite; __pgPool?: Pool };
  if (!isLocalDb) {
    g.__pgPool ??= new Pool({ connectionString: url, max: 5 });
    return pgDrizzle(g.__pgPool, { schema }) as unknown as Db;
  }
  g.__pglite ??= new PGlite(LOCAL_DB_DIR);
  return pgliteDrizzle(g.__pglite, { schema }) as unknown as Db;
}

export const db = connect();
export * from "./schema";
