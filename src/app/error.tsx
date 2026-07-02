"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to the console for debugging
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background decorators */}
      <div className="absolute top-[20%] right-[10%] w-[35%] aspect-square bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] left-[10%] w-[35%] aspect-square bg-slate-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-card p-12 max-w-md w-full flex flex-col items-center text-center gap-6 border border-red-200/40 dark:border-red-900/30">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-200/40 dark:border-red-900/30 flex items-center justify-center">
          <AlertCircle className="w-9 h-9 text-red-500" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Terjadi Kesalahan
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-600 mt-1 font-mono">
            {error.digest ? `Error ID: ${error.digest}` : "Unknown error"}
          </p>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami sedang
          memantau permasalahan ini. Silakan coba lagi atau kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={reset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[14px] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Home className="w-4 h-4" />
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
