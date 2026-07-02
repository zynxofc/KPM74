import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

const sqlitePath = process.env.DATABASE_URL
  ? process.env.DATABASE_URL.replace(/^file:/, "")
  : "dev.db";

const sqlite = new Database(sqlitePath);
export const db = drizzle(sqlite, { schema });
export type DatabaseInstance = typeof db;
