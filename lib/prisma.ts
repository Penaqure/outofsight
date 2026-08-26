import { setDefaultResultOrder } from "node:dns";
import { setDefaultAutoSelectFamily } from "node:net";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Node's default "Happy Eyeballs" dual-stack racing (autoSelectFamily) can
// get stuck if a host resolves to both IPv4 and IPv6 but IPv6 egress isn't
// actually usable from the current network — the IPv6 attempts fail fast
// (ENETUNREACH) but the aggregate connection still times out instead of
// falling through to the working IPv4 address. Neon (and most managed
// Postgres hosts) resolve to both; disabling auto-select and preferring
// IPv4 avoids the timeout without affecting environments where IPv6 does
// work — it just means IPv4 is tried first instead of raced.
setDefaultAutoSelectFamily(false);
setDefaultResultOrder("ipv4first");

// Singleton, anchored on globalThis for the same reason the old in-memory
// stores were: dev-mode Turbopack can give Route Handlers and Server
// Components separate module graphs, so a plain module-level `const`
// wouldn't necessarily be shared between them. It also avoids exhausting
// the database's connection limit from hot-reload creating a fresh client
// on every edit.
declare global {
  var __prisma: PrismaClient | undefined;
}

function createClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalThis.__prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__prisma = prisma;
}
