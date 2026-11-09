// Build entry. On Railway (DATABASE_PUBLIC_URL set) the build container cannot reach the
// private network, so it syncs the schema/seed and prerenders against the public DB URL.
import { execSync } from "node:child_process";

const env = { ...process.env };
const run = (cmd) => execSync(cmd, { stdio: "inherit", env });

if (env.DATABASE_PUBLIC_URL) {
  env.DATABASE_URL = env.DATABASE_PUBLIC_URL;
  run("npx drizzle-kit push --force");
  run("npx tsx scripts/bootstrap.ts");
  run("npx tsx scripts/seed.ts");
  run("npx tsx scripts/fix-image-paths.ts");
}
run("npx next build");
