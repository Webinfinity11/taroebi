// First-deploy setup: creates the admin from ADMIN_EMAIL / ADMIN_PASSWORD when there is none yet.
// Later deploys leave existing admins (and changed passwords) alone.
// Usage: npx tsx scripts/bootstrap.ts
import "./env";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { admins, db } from "../src/db";

(async () => {
  const [{ n }] = await db.select({ n: sql<number>`count(*)::int` }).from(admins);
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (n > 0 || !email || !password) {
    console.log(n > 0 ? "admin exists — bootstrap skipped" : "ADMIN_EMAIL / ADMIN_PASSWORD not set — no admin created");
    process.exit(0);
  }
  await db.insert(admins).values({ email, passwordHash: await bcrypt.hash(password, 10) });
  console.log(`admin created: ${email}`);
  process.exit(0);
})();
