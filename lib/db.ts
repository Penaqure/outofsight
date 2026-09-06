import { setDefaultResultOrder } from "node:dns";
import { setDefaultAutoSelectFamily } from "node:net";
import { Pool } from "pg";

// Kept from the Neon-backed setup: if DATABASE_URL ever points at a host
// that resolves to both IPv4 and IPv6, this avoids Node's dual-stack
// connection racing getting stuck on an unreachable IPv6 candidate.
// Harmless no-op for a local instance on localhost.
setDefaultAutoSelectFamily(false);
setDefaultResultOrder("ipv4first");

// Singleton, anchored on globalThis so dev-mode Turbopack's separate module
// graphs for Route Handlers vs. Server Components share one pool instead of
// each creating their own — and so hot reload doesn't exhaust the
// database's connection limit by spinning up a fresh pool on every edit.
declare global {
  var __pgPool: Pool | undefined;
}

function createPool(): Pool {
  return new Pool({ connectionString: process.env.DATABASE_URL });
}

export const pool = globalThis.__pgPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalThis.__pgPool = pool;
}
