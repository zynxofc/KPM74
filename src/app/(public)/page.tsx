import LandingPageClient from "./LandingPageClient";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/preview";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lintreekpm.vercel.app";

export const metadata: Metadata = {
  title: "Beranda",
  description: "Portal digital resmi Kuliah Pengabdian Masyarakat (KPM) — Pusat informasi, dokumentasi, publikasi, dan branding kelompok.",
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: "LinTree KPM — Portal Resmi KPM",
    description: "Portal digital resmi Kuliah Pengabdian Masyarakat (KPM) — Pusat informasi, dokumentasi, publikasi, dan branding kelompok.",
    url: BASE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "LinTree KPM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "LinTree KPM — Portal Resmi KPM",
    description: "Portal digital resmi Kuliah Pengabdian Masyarakat (KPM) — Pusat informasi, dokumentasi, publikasi, dan branding kelompok.",
    images: ["/og-image.png"],
  },
};

export const revalidate = 0;

export default async function LandingPage() {
  const currentSettings = await getSiteSettings();

  // Fallback settings if not seeded yet
  const fallbackSettings = currentSettings || {
    id: 1,
    siteName: "LinTree KPM",
    description: "Portal digital resmi KPM",
    socialInstagram: "",
    socialTiktok: "",
    socialWhatsapp: "",
    socialMaps: "",
    heroTitle: "Selamat Datang di Portal LinTree KPM",
    heroSubtitle: "Pusat informasi, timeline program kerja, peta interaktif, galeri dokumentasi, dan publikasi resmi pengabdian masyarakat kelompok mahasiswa.",
    heroBgImage: "",
    allowPublicRegistrations: false,
    maintenanceMode: false,
    updatedAt: new Date().toISOString(),
  };

  return <LandingPageClient settings={fallbackSettings} />;
}
