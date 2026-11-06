import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import net from "node:net";

// `npm run dev`: starts the local database (scripts/dev-db.mjs) and then
// `next dev`, so the site never comes up without its database — forgetting
// `npm run db:dev` after a reboot gave ECONNREFUSED 127.0.0.1:5433 on every
// page. If something is already listening on the database port (e.g. a
// separate `npm run db:dev`), that one is used and left alone. Extra args go
// to next dev: `npm run dev -- -p 3001`. Ctrl+C stops both.
const DB_PORT = 5433;

function portInUse(port) {
  return new Promise((resolve) => {
    const socket = net.connect(port, "127.0.0.1");
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

function startDatabase() {
  return new Promise((resolve, reject) => {
    const db = spawn(process.execPath, ["scripts/dev-db.mjs"], {
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    const onData = (chunk) => {
      output += chunk;
      if (output.includes("Local Postgres ready")) {
        console.log("Local database ready on port", DB_PORT);
        resolve(db);
      }
    };
    db.stdout.on("data", onData);
    db.stderr.on("data", onData);
    db.once("exit", (code) =>
      reject(new Error(`Local database failed to start (exit ${code}):\n${output}`))
    );
  });
}

const db = (await portInUse(DB_PORT)) ? null : await startDatabase();
if (!db) console.log("Using the database already running on port", DB_PORT);

const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
const next = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
});

let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  next.kill("SIGINT");
  if (!db || db.exitCode !== null) process.exit(code);
  // dev-db.mjs shuts Postgres down cleanly on SIGINT, then exits.
  db.once("exit", () => process.exit(code));
  db.kill("SIGINT");
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
next.once("exit", (code) => stop(code ?? 0));
db?.once("exit", (code) => {
  if (!stopping) {
    console.error(`Local database stopped unexpectedly (exit ${code}).`);
    stop(1);
  }
});
