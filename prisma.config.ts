import { setDefaultResultOrder } from "node:dns";
import { setDefaultAutoSelectFamily } from "node:net";
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// Next.js reads .env.local automatically; the Prisma CLI does not (it only
// auto-loads a plain .env), so load it explicitly here.
config({ path: ".env.local" });

// See the matching comment in lib/prisma.ts — avoids Node's dual-stack
// connection racing getting stuck on unreachable IPv6 candidates for hosts
// (like Neon) that resolve to both address families.
setDefaultAutoSelectFamily(false);
setDefaultResultOrder("ipv4first");

// Prisma 7 moved the datasource connection string out of schema.prisma and
// into this file — used by `prisma db push` / `prisma migrate` /
// `prisma studio`. The actual runtime PrismaClient (lib/prisma.ts) still
// gets its own connection via the @prisma/adapter-pg adapter, independent
// of this file.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
