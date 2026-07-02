import { db } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "@/components/admin/SettingsForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan Portal — LinTree Admin",
  description: "Kelola informasi umum landing page, CTA sosial media, dan Hero section.",
};

export const revalidate = 0;

export default async function SettingsPage() {
  // Fetch current settings row
  const [currentSettings] = await db
    .select()
    .from(settings)
    .where(eq(settings.id, 1))
    .limit(1);

  // If settings not seeded, provide fallback to match signature
  const fallbackSettings = currentSettings || {
    id: 1,
    siteName: "LinTree KPM",
    description: "Portal digital resmi KPM",
    socialInstagram: "",
    socialTiktok: "",
    socialWhatsapp: "",
    socialMaps: "",
    heroTitle: "Selamat Datang di Portal KPM",
    heroSubtitle: "Membangun Desa, Mencerdaskan Bangsa",
    heroBgImage: "",
    allowPublicRegistrations: false,
    maintenanceMode: false,
    updatedAt: new Date().toISOString(),
  };

  return <SettingsForm initialSettings={fallbackSettings} />;
}
