import "server-only";
import { db } from "@/db";
import { activityLogs, type NewActivityLog } from "@/db/schema";
import { isPreviewMode } from "@/lib/preview";

/**
 * Record an admin action in the immutable activity log.
 * Fire-and-forget — errors are caught silently to never block main flow.
 */
export async function logActivity(
  entry: Omit<NewActivityLog, "id" | "createdAt">
): Promise<void> {
  if (isPreviewMode()) return;
  try {
    await db.insert(activityLogs).values(entry);
  } catch {
    // Logging failure must never interrupt business logic
  }
}
