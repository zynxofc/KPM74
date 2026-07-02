import { db } from "@/db";
import { mapLocations } from "@/db/schema";
import { MapLocationsManager } from "@/components/admin/MapLocationsManager";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manajemen Peta Lokasi — LinTree Admin",
  description: "Kelola marker, deskripsi, dan rute navigasi peta wilayah pengabdi KPM.",
};

export const revalidate = 0;

export default async function AdminMapLocationsPage() {
  // Query all map locations
  const locationsList = await db.select().from(mapLocations);

  return <MapLocationsManager initialLocations={locationsList} />;
}
