import { db } from "@/db";
import { settings, members } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GlassCard } from "@/components/ui/GlassCard";
import type { Metadata } from "next";
import { Users, BookOpen, Compass, Award } from "lucide-react";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  let siteName = "LinTree KPM";
  if (isPreviewMode()) {
    siteName = getPreviewData("settings").siteName;
  } else {
    const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    siteName = siteSettings?.siteName || "LinTree KPM";
  }
  return {
    title: `Profil & Anggota Kelompok — ${siteName}`,
    description: `Kenali visi, misi, kata sambutan, dan susunan struktur organisasi anggota kelompok Kuliah Pengabdian Masyarakat (KPM) ${siteName}.`,
  };
}

export default async function ProfilPage() {
  let siteSettings: typeof settings.$inferSelect | null = null;
  let allMembers: (typeof members.$inferSelect)[];

  if (isPreviewMode()) {
    siteSettings = getPreviewData("settings");
    allMembers = getPreviewData("members");
  } else {
    const [currentSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    siteSettings = currentSettings;
    allMembers = await db.select().from(members);
  }

  const siteName = siteSettings?.siteName || "LinTree KPM";
  const siteDescription = siteSettings?.description || "Portal digital resmi Kuliah Pengabdian Masyarakat.";

  return (
    <div className="px-6 max-w-7xl mx-auto space-y-16 relative">
      {/* Background Decorators */}
      <div className="absolute top-[10%] left-[-5%] w-[40%] aspect-square bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-5%] w-[40%] aspect-square bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Banner */}
      <div className="space-y-4 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-primary bg-primary/10 border border-primary/20 dark:text-secondary dark:bg-secondary/10 dark:border-secondary/20 backdrop-blur-md">
          <Users className="w-3.5 h-3.5 text-primary dark:text-secondary" />
          Kenali Kelompok Pengabdi Kami
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
          Profil & Struktur KPM
        </h1>
        <p className="text-slate-600 dark:text-slate-450 max-w-3xl leading-relaxed text-sm sm:text-base">
          Informasi terperinci mengenai visi misi pengabdian, profil kelompok, kata sambutan, dan mahasiswa pengabdi di desa.
        </p>
      </div>

      {/* Tentang & Sambutan Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Tentang KPM */}
        <GlassCard hoverLift={false} className="border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between p-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-primary dark:text-secondary mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tentang KPM {siteName}
            </h2>
            <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed">
              {siteDescription}
            </p>
            <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed">
              Kuliah Pengabdian Masyarakat (KPM) merupakan bentuk nyata kontribusi akademis mahasiswa dalam mempercepat pembangunan desa, menggerakkan ekonomi mikro, menyelaraskan literasi digital, serta mengabdikan ilmu pengetahuan secara aplikatif langsung di tengah-tengah masyarakat.
            </p>
          </div>
        </GlassCard>

        {/* Sambutan */}
        <GlassCard hoverLift={false} className="border border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between p-8">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-accent mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Kata Sambutan
            </h2>
            <p className="text-sm text-slate-655 dark:text-slate-350 leading-relaxed italic">
              {"\"Selamat datang di portal resmi kelompok KPM kami. Melalui platform digital ini, kami berupaya mendokumentasikan, mengomunikasikan, dan mempublikasikan seluruh kegiatan pengabdian masyarakat secara transparan dan akuntabel. Kami berharap portal ini bermanfaat bagi seluruh masyarakat desa, dosen pembimbing, dan mitra pembangunan.\""}
            </p>
            <div className="pt-2">
              <span className="block font-bold text-slate-900 dark:text-white text-sm">
                KPM Kelompok {siteName}
              </span>
              <span className="text-xs text-slate-500">
                Pengabdi Masyarakat
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Visi & Misi */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center sm:text-left">
          Visi & Misi Pengabdian
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Visi */}
          <GlassCard className="border border-slate-200/30 dark:border-slate-800/30 p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-primary dark:text-secondary shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Visi Kelompok</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                Mewujudkan pengabdian masyarakat yang kolaboratif, solutif, dan berkelanjutan demi mempercepat kemandirian serta kemajuan aspek sosial, ekonomi, dan pendidikan di desa binaan.
              </p>
            </div>
          </GlassCard>

          {/* Misi */}
          <GlassCard className="border border-slate-200/30 dark:border-slate-800/30 p-6 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-accent shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Misi Utama</h3>
              <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal pl-4 leading-relaxed">
                <li>Melakukan identifikasi masalah dan memberikan solusi aplikatif berbasis potensi lokal.</li>
                <li>Mendorong partisipasi aktif warga desa dalam setiap program pemberdayaan.</li>
                <li>Membangun kemitraan strategis dengan pemerintah desa dan pelaku usaha lokal.</li>
                <li>Menerapkan digitalisasi informasi untuk memperluas akses promosi potensi desa.</li>
              </ol>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Anggota Kelompok / Struktur Organisasi */}
      <div className="space-y-8 pb-12">
        <div className="text-center sm:text-left space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Struktur & Anggota Kelompok
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl">
            Para mahasiswa pengabdi dan dosen pembimbing yang tergabung dalam kelompok KPM {siteName}.
          </p>
        </div>

        {allMembers.length === 0 ? (
          <GlassCard hoverLift={false} className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-600 border border-slate-200/30 dark:border-slate-800/30">
            <Users className="w-12 h-12 mb-3 opacity-30 animate-pulse" />
            <p className="text-sm font-semibold">Belum ada anggota kelompok yang terdaftar.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allMembers.map((member) => (
              <GlassCard
                key={member.id}
                hoverLift
                className="p-5 flex flex-col items-center text-center border border-slate-200/30 dark:border-slate-800/30 group"
              >
                {/* Photo Thumbnail */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 dark:border-secondary/20 bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-inner">
                  {member.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={member.photoUrl}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                {/* Name, Role & NIM */}
                <h4 className="font-bold text-slate-900 dark:text-white text-base mt-4 line-clamp-1">
                  {member.name}
                </h4>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 dark:text-secondary dark:bg-secondary/10 dark:border-secondary/20 uppercase mt-2">
                  {member.role}
                </span>
                <span className="text-xs text-slate-500 mt-1.5 font-medium">
                  {member.nimNip}
                </span>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
