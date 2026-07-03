import { db } from "@/db";
import { settings, gallery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GalleryClient } from "./GalleryClient";
import type { Metadata } from "next";
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
    title: `Galeri Kegiatan — ${siteName}`,
    description: `Dokumentasi foto dan video seluruh rangkaian kegiatan pengabdian Kuliah Pengabdian Masyarakat (KPM) kelompok ${siteName}.`,
  };
}

export default async function PublicGalleryPage() {
  let siteSettings: typeof settings.$inferSelect | null = null;
  let galleryItems: (typeof gallery.$inferSelect)[];

  if (isPreviewMode()) {
    siteSettings = getPreviewData("settings");
    galleryItems = getPreviewData("gallery");
  } else {
    const [currentSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    siteSettings = currentSettings;
    galleryItems = await db.select().from(gallery);
  }

  const siteName = siteSettings?.siteName || "LinTree KPM";

  return <GalleryClient siteName={siteName} galleryItems={galleryItems} />;
}
