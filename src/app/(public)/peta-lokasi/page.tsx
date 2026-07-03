import { db } from "@/db";
import { mapLocations } from "@/db/schema";
import { GlassCard } from "@/components/ui/GlassCard";
import MapWrapper from "@/components/ui/MapWrapper";
import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lintreekpm.vercel.app";

export const metadata: Metadata = {
  title: "Peta Lokasi KPM",
  description: "Temukan marker posko utama, instansi pendidikan, pusat pemerintahan desa, sentra UMKM binaan, sarana ibadah, serta destinasi wisata di wilayah pengabdian KPM.",
  alternates: { canonical: `${BASE_URL}/peta-lokasi` },
  openGraph: {
    title: "Peta Lokasi KPM — LinTree KPM",
    description: "Temukan marker posko utama, instansi pendidikan, pusat pemerintahan desa, sentra UMKM binaan, sarana ibadah, serta destinasi wisata di wilayah pengabdian KPM.",
    url: `${BASE_URL}/peta-lokasi`,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Peta Lokasi LinTree KPM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Peta Lokasi KPM — LinTree KPM",
    description: "Temukan marker posko utama, instansi pendidikan, pusat pemerintahan desa, sentra UMKM binaan, sarana ibadah, serta destinasi wisata di wilayah pengabdian KPM.",
    images: ["/og-image.png"],
  },
};

export const revalidate = 0; // Ensure data is fetched fresh from SQLite database

export default async function PetaLokasiPage() {
  const locations = isPreviewMode() ? getPreviewData("locations") : await db.select().from(mapLocations);

  const legends = [
    { label: "Posko KPM", bg: "bg-teal-500" },
    { label: "Balai Desa", bg: "bg-emerald-500" },
    { label: "Sekolah", bg: "bg-blue-500" },
    { label: "Sentra UMKM", bg: "bg-amber-500" },
    { label: "Tempat Ibadah", bg: "bg-violet-500" },
    { label: "Wisata Desa", bg: "bg-red-500" },
  ];

  return (
    <div className="px-6 max-w-7xl mx-auto space-y-8 relative">
      {/* Background Decorator */}
      <div className="absolute top-[20%] left-[-5%] w-[40%] aspect-square bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Section */}
      <div className="space-y-3 text-center md:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Peta Lokasi KPM
        </h1>
        <p className="text-slate-600 dark:text-slate-450 max-w-3xl leading-relaxed">
          Temukan penanda posko utama, instansi pendidikan, pusat pemerintahan desa, sentra ekonomi UMKM binaan, sarana ibadah, serta destinasi wisata yang ada di wilayah pengabdian KPM kami.
        </p>
      </div>

      {/* Main Grid: Map & Legend */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Map Container / Empty State */}
        <div className="lg:col-span-3 h-[550px]">
          {locations.length > 0 ? (
            <MapWrapper locations={locations} />
          ) : (
            <GlassCard hoverLift={false} className="w-full h-full border border-slate-200/50 dark:border-slate-800/50 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center text-slate-450">
                <MapPin className="w-8 h-8 animate-pulse text-slate-400 dark:text-slate-500" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Peta Lokasi Belum Tersedia</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                  Belum ada koordinat lokasi yang ditandai untuk kelompok KPM ini di database. Silakan masuk ke panel admin untuk melakukan input koordinat marker.
                </p>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Legend / Category Filter List */}
        <div className="space-y-6">
          <GlassCard hoverLift={false} className="p-6 border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200/50 dark:border-slate-850 pb-2">
                Keterangan Peta
              </h3>
              
              <div className="space-y-3.5">
                {legends.map((legend, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${legend.bg}`} />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {legend.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-850">
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-450">
                Tip: Klik pada marker lingkaran di peta untuk melihat detail informasi lokasi dan mendapatkan rute navigasi instan via Google Maps.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
