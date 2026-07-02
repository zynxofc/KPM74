import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { ActivityLogViewer } from "@/components/admin/ActivityLogViewer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity Log — LinTree Admin",
  description: "Riwayat seluruh aksi administrator sistem.",
};

export const revalidate = 0;

const PAGE_SIZE = 20;

type ActionFilter = "ALL" | "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";

interface PageProps {
  searchParams: Promise<{ page?: string; action?: string }>;
}

export default async function ActivityLogPage({ searchParams }: PageProps) {
  const { page: pageStr, action: actionStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));
  const action = (actionStr?.toUpperCase() ?? "ALL") as ActionFilter;
  const offset = (page - 1) * PAGE_SIZE;

  // Build query with optional action filter
  const baseFilter =
    action !== "ALL"
      ? eq(
          activityLogs.action,
          action as "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE"
        )
      : undefined;

  const [logs, countResult] = await Promise.all([
    db
      .select()
      .from(activityLogs)
      .where(baseFilter)
      .orderBy(desc(activityLogs.createdAt))
      .limit(PAGE_SIZE)
      .offset(offset),
    db
      .select({ total: sql<number>`count(*)` })
      .from(activityLogs)
      .where(baseFilter),
  ]);

  const total = countResult[0]?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <ActivityLogViewer
      logs={logs}
      page={page}
      totalPages={totalPages}
      total={total}
      activeFilter={action}
    />
  );
}
