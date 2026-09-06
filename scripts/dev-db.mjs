import { existsSync } from "node:fs";
import path from "node:path";
import EmbeddedPostgres from "embedded-postgres";

// Local development database — a real Postgres server, just managed by npm
// instead of a system package, so there's nothing to install/root-access to
// get the app running locally. On Contabo, point DATABASE_URL at a properly
// installed system Postgres instead; this is dev-only.
const databaseDir = path.join(process.cwd(), ".pgdata");
const alreadyInitialised = existsSync(path.join(databaseDir, "PG_VERSION"));

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "outofsight",
  password: "outofsight",
  port: 5433,
  persistent: true,
});

if (!alreadyInitialised) {
  await pg.initialise();
}
await pg.start();
if (!alreadyInitialised) {
  await pg.createDatabase("outofsight");
}

console.log(
  "Local Postgres ready — postgresql://outofsight:outofsight@localhost:5433/outofsight"
);

async function shutdown() {
  await pg.stop();
  process.exit(0);
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
