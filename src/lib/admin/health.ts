import "server-only";
import { db } from "@/db";
import { mapLocations } from "@/db/schema";
import { count } from "drizzle-orm";
import fs from "fs";
import path from "path";
import { isPreviewMode } from "@/lib/preview";

export interface HealthData {
  dbStatus: "connected" | "error" | "Preview Mode";
  dbSizeKb: number;
  storageProvider: string;
  markersCount: number;
  buildTime: string;
}

export async function getHealthData(): Promise<HealthData> {
  if (isPreviewMode()) {
    return {
      dbStatus: "Preview Mode",
      dbSizeKb: 0,
      storageProvider: process.env.STORAGE_PROVIDER ?? "local",
      markersCount: 1,
      buildTime: new Date().toISOString(),
    };
  }

  // --- Database status & size ---
  let dbStatus: "connected" | "error" | "Preview Mode" = "error";
  let dbSizeKb = 0;
  let markersCount = 0;

  try {
    const [result] = await db.select({ value: count() }).from(mapLocations);
    markersCount = result?.value ?? 0;
    dbStatus = "connected";

    // Get SQLite file size
    const dbPath = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "dev.db";
    const resolvedPath = path.isAbsolute(dbPath)
      ? dbPath
      : path.join(process.cwd(), dbPath);
    if (fs.existsSync(resolvedPath)) {
      const stat = fs.statSync(resolvedPath);
      dbSizeKb = Math.round(stat.size / 1024);
    }
  } catch {
    dbStatus = "error";
  }

  return {
    dbStatus,
    dbSizeKb,
    storageProvider: process.env.STORAGE_PROVIDER ?? "local",
    markersCount,
    buildTime: new Date().toISOString(),
  };
}
