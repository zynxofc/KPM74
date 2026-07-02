"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Database,
  HardDrive,
  RefreshCw,
  CheckCircle2,
  XCircle,
  CloudUpload,
  Map,
  Clock,
  Activity,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import type { HealthData } from "@/lib/admin/health";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  health: HealthData;
}

const storageLabel: Record<string, string> = {
  local: "Local Filesystem",
  cloudinary: "Cloudinary",
  s3: "AWS S3",
};

const AUTO_REFRESH_SECONDS = 60;

export function DashboardShell({ health: initialHealth }: DashboardShellProps) {
  const health = initialHealth;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_SECONDS);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Reload page data via router refresh pattern
      const res = await fetch(window.location.href, {
        cache: "no-store",
        headers: { "x-refresh": "1" },
      });
      if (res.ok) {
        setCountdown(AUTO_REFRESH_SECONDS);
      }
    } finally {
      // For now, just toggle loading state — full revalidation via page refresh
      setIsRefreshing(false);
      window.location.reload();
    }
  }, []);

  // Countdown ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refresh();
          return AUTO_REFRESH_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [refresh]);

  const cards = [
    {
      id: "db-status",
      label: "Status Database",
      value: health.dbStatus === "connected" ? "Terhubung" : "Error",
      icon: Database,
      iconColor:
        health.dbStatus === "connected"
          ? "text-emerald-500"
          : "text-red-500",
      badge:
        health.dbStatus === "connected" ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500" />
        ),
      sub: "SQLite (dev.db)",
      highlight: health.dbStatus === "connected",
    },
    {
      id: "storage",
      label: "Storage Provider",
      value: storageLabel[health.storageProvider] ?? health.storageProvider,
      icon: CloudUpload,
      iconColor: "text-primary dark:text-secondary",
      badge: <CheckCircle2 className="w-5 h-5 text-primary dark:text-secondary" />,
      sub: `STORAGE_PROVIDER=${health.storageProvider}`,
      highlight: true,
    },
    {
      id: "db-size",
      label: "Ukuran Database",
      value: `${health.dbSizeKb} KB`,
      icon: HardDrive,
      iconColor: "text-violet-500",
      badge: null,
      sub: "Ukuran berkas dev.db",
      highlight: false,
    },
    {
      id: "markers",
      label: "Marker Peta",
      value: health.markersCount.toString(),
      icon: Map,
      iconColor: "text-amber-500",
      badge: null,
      sub: "Total lokasi terdaftar",
      highlight: false,
    },
  ];

  const buildDate = new Date(health.buildTime);
  const formattedBuild = buildDate.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Selamat datang kembali, Administrator.
          </p>
        </div>

        {/* Refresh */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
            Refresh otomatis dalam{" "}
            <span className="font-semibold text-primary dark:text-secondary">
              {countdown}s
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isRefreshing}
            aria-label="Refresh data sekarang"
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Health Check Cards */}
      <section aria-labelledby="health-heading">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-primary dark:text-secondary" />
          <h2
            id="health-heading"
            className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest"
          >
            Health Check
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.3, ease: "easeOut" }}
              >
                <GlassCard
                  hoverLift={false}
                  className="p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800",
                        card.iconColor
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {card.badge}
                  </div>

                  <div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
                      {card.value}
                    </p>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                      {card.label}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                      {card.sub}
                    </p>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Server Info */}
      <section aria-labelledby="server-info-heading">
        <GlassCard hoverLift={false} className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-slate-400" />
            <h2
              id="server-info-heading"
              className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest"
            >
              Informasi Server
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-medium">Timestamp Data</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {formattedBuild}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Environment</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {process.env.NODE_ENV ?? "development"}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Framework</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                Next.js 16 (App Router)
              </p>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* Quick Links */}
      <section aria-labelledby="quicklinks-heading">
        <h2
          id="quicklinks-heading"
          className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4"
        >
          Akses Cepat
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Activity Log", href: "/admin/activity-log", color: "bg-violet-500/10 text-violet-600 dark:text-violet-400" },
            { label: "Peta Lokasi", href: "/admin/peta-lokasi", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
            { label: "Pengaturan", href: "/admin/pengaturan", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center justify-center rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-transparent hover:border-slate-200 dark:hover:border-slate-700",
                link.color
              )}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
