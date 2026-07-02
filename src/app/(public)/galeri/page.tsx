import { db } from "@/db";
import { settings, gallery } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GalleryClient } from "./GalleryClient";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  const siteName = siteSettings?.siteName || "LinTree KPM";
  return {
    title: `Galeri Kegiatan — ${siteName}`,
    description: `Dokumentasi foto dan video seluruh rangkaian kegiatan pengabdian Kuliah Pengabdian Masyarakat (KPM) kelompok ${siteName}.`,
  };
}

export default async function PublicGalleryPage() {
  const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  const galleryItems = await db.select().from(gallery);

  const siteName = siteSettings?.siteName || "LinTree KPM";

  return <GalleryClient siteName={siteName} galleryItems={galleryItems} />;
}
