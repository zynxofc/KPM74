export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="flex flex-col items-center gap-5">
        {/* Animated spinner ring */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-primary/15 dark:border-secondary/10" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary dark:border-t-secondary animate-spin" />
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}
