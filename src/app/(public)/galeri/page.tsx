import { GalleryClient } from "./GalleryClient";
import type { Metadata } from "next";
import { getSiteSettings, getGalleryItemsList } from "@/lib/preview";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const siteName = siteSettings?.siteName || "LinTree KPM";
  return {
    title: `Galeri Kegiatan — ${siteName}`,
    description: `Dokumentasi foto dan video seluruh rangkaian kegiatan pengabdian Kuliah Pengabdian Masyarakat (KPM) kelompok ${siteName}.`,
  };
}

export default async function PublicGalleryPage() {
  const siteSettings = await getSiteSettings();
  const galleryItems = await getGalleryItemsList();

  const siteName = siteSettings?.siteName || "LinTree KPM";

  return <GalleryClient siteName={siteName} galleryItems={galleryItems} />;
}
