import { db } from "@/db";
import { mapLocations } from "@/db/schema";
import { MapLocationsManager } from "@/components/admin/MapLocationsManager";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

export const metadata: Metadata = {
  title: "Manajemen Peta Lokasi — LinTree Admin",
  description: "Kelola marker, deskripsi, dan rute navigasi peta wilayah pengabdi KPM.",
};

export const revalidate = 0;

export default async function AdminMapLocationsPage() {
  const locationsList = isPreviewMode()
    ? getPreviewData("locations")
    : await db.select().from(mapLocations);

  return <MapLocationsManager initialLocations={locationsList} />;
}
