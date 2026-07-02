"use client";

import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Clock,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  ShieldAlert,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import type { ActivityLog } from "@/db/schema";
import { cn } from "@/lib/utils";

type ActionFilter = "ALL" | "LOGIN" | "LOGOUT" | "CREATE" | "UPDATE" | "DELETE";

interface ActivityLogViewerProps {
  logs: ActivityLog[];
  page: number;
  totalPages: number;
  total: number;
  activeFilter: ActionFilter;
}

const ACTION_FILTERS: ActionFilter[] = [
  "ALL",
  "LOGIN",
  "LOGOUT",
  "CREATE",
  "UPDATE",
  "DELETE",
];

const actionMeta: Record<
  string,
  { label: string; icon: React.ReactNode; color: string; bg: string }
> = {
  LOGIN: {
    label: "Login",
    icon: <LogIn className="w-3.5 h-3.5" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  LOGOUT: {
    label: "Logout",
    icon: <LogOut className="w-3.5 h-3.5" />,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800",
  },
  CREATE: {
    label: "Tambah",
    icon: <Plus className="w-3.5 h-3.5" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  UPDATE: {
    label: "Ubah",
    icon: <Pencil className="w-3.5 h-3.5" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  DELETE: {
    label: "Hapus",
    icon: <Trash2 className="w-3.5 h-3.5" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-900/30",
  },
};

function formatTimestamp(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function ActivityLogViewer({
  logs,
  page,
  totalPages,
  total,
  activeFilter,
}: ActivityLogViewerProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navigate = (params: Record<string, string>) => {
    const sp = new URLSearchParams();
    if (params.action && params.action !== "ALL") sp.set("action", params.action);
    if (params.page && params.page !== "1") sp.set("page", params.page);
    router.push(`${pathname}${sp.toString() ? `?${sp}` : ""}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <ScrollText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Activity Log
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {total} entri tercatat · hanya baca, tidak dapat diubah atau dihapus
          </p>
        </div>
      </div>

      {/* Immutable notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3">
        <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
          Log ini merupakan audit trail yang tidak dapat dimodifikasi oleh administrator.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter berdasarkan aksi">
        {ACTION_FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => navigate({ action: f, page: "1" })}
            className={cn(
              "px-4 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              activeFilter === f
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-secondary"
            )}
          >
            {f === "ALL" ? "Semua" : f}
          </button>
        ))}
      </div>

      {/* Log Table */}
      <GlassCard hoverLift={false} className="p-0 overflow-hidden">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600">
            <ScrollText className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm font-medium">Belum ada log untuk filter ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Tabel activity log">
              <thead>
                <tr className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Waktu
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Aksi
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Entitas
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Keterangan
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                    IP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60">
                {logs.map((log, idx) => {
                  const meta = actionMeta[log.action] ?? actionMeta.UPDATE;
                  return (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          {formatTimestamp(log.createdAt)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold",
                            meta.bg,
                            meta.color
                          )}
                        >
                          {meta.icon}
                          {log.action}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          {log.entity}
                        </span>
                        {log.entityId && (
                          <span className="text-slate-400 text-xs ml-1">
                            #{log.entityId}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell text-xs text-slate-500 dark:text-slate-400 max-w-xs truncate">
                        {log.description ?? "—"}
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell text-xs font-mono text-slate-400 dark:text-slate-500">
                        {log.ipAddress ?? "—"}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() =>
                navigate({ action: activeFilter, page: String(page - 1) })
              }
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() =>
                navigate({ action: activeFilter, page: String(page + 1) })
              }
              aria-label="Halaman berikutnya"
            >
              Berikutnya
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
