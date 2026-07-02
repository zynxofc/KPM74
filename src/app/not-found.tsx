import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Background decorators */}
      <div className="absolute top-[20%] left-[10%] w-[35%] aspect-square bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[15%] right-[10%] w-[35%] aspect-square bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-card p-12 max-w-md w-full flex flex-col items-center text-center gap-6 border border-slate-200/40 dark:border-slate-800/40">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-primary/10 dark:bg-secondary/10 border border-primary/20 dark:border-secondary/20 flex items-center justify-center">
          <AlertTriangle className="w-9 h-9 text-primary dark:text-secondary" />
        </div>

        {/* Status Code */}
        <div>
          <p className="text-7xl font-black text-primary dark:text-secondary leading-none">
            404
          </p>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
            Halaman Tidak Ditemukan
          </h1>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
          Maaf, halaman yang Anda cari tidak tersedia atau mungkin telah
          dipindahkan. Silakan kembali ke beranda utama.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-primary text-white font-semibold text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Home className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
