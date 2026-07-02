import { db } from "@/db";
import { gallery } from "@/db/schema";
import { GalleryManager } from "@/components/admin/GalleryManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Galeri — LinTree Admin",
  description: "Kelola dokumentasi foto dan video aktivitas pengabdi kelompok KPM.",
};

export const revalidate = 0;

export default async function AdminGalleryPage() {
  // Query all gallery items sorted by id descending
  const galleryItems = await db.select().from(gallery);

  return <GalleryManager initialItems={galleryItems} />;
}
