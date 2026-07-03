/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import * as schema from "./schema";

export let db: any;

if (process.env.PREVIEW_MODE === "true") {
  db = {} as any;
} else {
  const Database = require("better-sqlite3");
  const { drizzle } = require("drizzle-orm/better-sqlite3");

  const sqlitePath = process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/^file:/, "")
    : "dev.db";

  const sqlite = new Database(sqlitePath);
  db = drizzle(sqlite, { schema });
}

export type DatabaseInstance = typeof db;
