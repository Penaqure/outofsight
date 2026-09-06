import { readFileSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { Client } from "pg";

// Next.js reads .env.local automatically; a plain node script does not, so
// load it explicitly here (same reasoning the old prisma.config.ts had).
config({ path: ".env.local" });

const schema = readFileSync(
  path.join(process.cwd(), "db", "schema.sql"),
  "utf-8"
);

const client = new Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  await client.query(schema);
  console.log("Database schema applied.");
} finally {
  await client.end();
}
