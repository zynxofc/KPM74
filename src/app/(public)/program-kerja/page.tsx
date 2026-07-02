import { db } from "@/db";
import { settings, programs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Metadata } from "next";
import { FolderKanban, Calendar, CheckCircle2, Clock, PlayCircle } from "lucide-react";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  const siteName = siteSettings?.siteName || "LinTree KPM";
  return {
    title: `Program Kerja Kelompok — ${siteName}`,
    description: `Ikuti perkembangan dan status rencana, jalannya program, serta dokumentasi hasil program kerja pengabdian Kuliah Pengabdian Masyarakat (KPM) ${siteName}.`,
  };
}

const statusMeta: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  rencana: {
    label: "Rencana",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-100/80 dark:bg-slate-800/80",
    border: "border-slate-200/50 dark:border-slate-700/50",
    icon: <Clock className="w-3.5 h-3.5" />,
  },
  berjalan: {
    label: "Berjalan",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-100/80 dark:bg-amber-900/20",
    border: "border-amber-200/40 dark:border-amber-900/30",
    icon: <PlayCircle className="w-3.5 h-3.5 animate-pulse" />,
  },
  selesai: {
    label: "Selesai",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-100/80 dark:bg-emerald-900/20",
    border: "border-emerald-200/40 dark:border-emerald-900/30",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
};

function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export default async function ProgramKerjaPage() {
  const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  const allPrograms = await db.select().from(programs);

  const siteName = siteSettings?.siteName || "LinTree KPM";

  return (
    <div className="px-6 max-w-7xl mx-auto space-y-12 relative">
      {/* Background Decorator */}
      <div className="absolute top-[20%] right-[-5%] w-[40%] aspect-square bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-primary bg-primary/10 border border-primary/20 dark:text-secondary dark:bg-secondary/10 dark:border-secondary/20 backdrop-blur-md">
          <FolderKanban className="w-3.5 h-3.5 text-primary dark:text-secondary" />
          Rencana & Agenda Kegiatan KPM
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
          Program Kerja Pengabdian
        </h1>
        <p className="text-slate-600 dark:text-slate-450 max-w-3xl leading-relaxed text-sm sm:text-base">
          Temukan daftar seluruh inisiatif dan program kerja kelompok KPM {siteName} yang dirancang untuk mendorong kontribusi nyata di desa.
        </p>
      </div>

      {/* Grid List Programs */}
      {allPrograms.length === 0 ? (
        <GlassCard hoverLift={false} className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-600 border border-slate-200/30 dark:border-slate-800/30 max-w-4xl mx-auto">
          <FolderKanban className="w-12 h-12 mb-3 opacity-30 animate-pulse" />
          <p className="text-sm font-semibold">Belum ada program kerja yang terdaftar di database.</p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
          {allPrograms.map((program) => {
            const meta = statusMeta[program.status] ?? statusMeta.rencana;
            return (
              <GlassCard
                key={program.id}
                hoverLift
                className="border border-slate-200/30 dark:border-slate-800/30 overflow-hidden flex flex-col justify-between group p-5 h-full"
              >
                <div className="space-y-4">
                  {/* Documentation Image */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950/10 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/40 flex items-center justify-center shrink-0">
                    {program.documentationUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={program.documentationUrl}
                        alt={program.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4">
                        <FolderKanban className="w-8 h-8 opacity-40 text-slate-400 dark:text-slate-500" />
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-550">Belum Ada Media</span>
                      </div>
                    )}

                    {/* Status Badge floating */}
                    <span className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${meta.bg} ${meta.color} ${meta.border} border backdrop-blur-md shadow-sm`}>
                      {meta.icon}
                      {meta.label}
                    </span>
                  </div>

                  {/* Title & Dates */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-snug line-clamp-2">
                      {program.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold pt-1">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {formatDate(program.startDate)} — {formatDate(program.endDate)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed line-clamp-4">
                    {program.description}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
