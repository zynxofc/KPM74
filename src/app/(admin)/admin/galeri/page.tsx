import { db } from "@/db";
import { gallery } from "@/db/schema";
import { GalleryManager } from "@/components/admin/GalleryManager";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

export const metadata: Metadata = {
  title: "Manajemen Galeri — LinTree Admin",
  description: "Kelola dokumentasi foto dan video aktivitas pengabdi kelompok KPM.",
};

export const revalidate = 0;

export default async function AdminGalleryPage() {
  const galleryItems = isPreviewMode()
    ? getPreviewData("gallery")
    : await db.select().from(gallery);

  return <GalleryManager initialItems={galleryItems} />;
}
