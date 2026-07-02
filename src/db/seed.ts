import { db } from "./index";
import { mapLocations, users, settings } from "./schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Seeding database...");

  // ─────────────────────────────────────────────────────────────────────────
  // Seed Single Administrator
  // Tabel users hanya menyimpan 1 record. Tidak ada multi-user.
  // ─────────────────────────────────────────────────────────────────────────
  const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.username, adminUsername))
    .limit(1);

  if (existingAdmin.length === 0) {
    const passwordHash = await hash(adminPassword, 12);
    await db.insert(users).values({
      username: adminUsername,
      passwordHash,
    });
    console.log(`✅ Admin user '${adminUsername}' created.`);
  } else {
    console.log(`ℹ️  Admin user '${adminUsername}' already exists — skipped.`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Seed Default Settings
  // ─────────────────────────────────────────────────────────────────────────
  const existingSettings = await db
    .select()
    .from(settings)
    .where(eq(settings.id, 1))
    .limit(1);

  if (existingSettings.length === 0) {
    await db.insert(settings).values({
      id: 1,
      siteName: "LinTree KPM",
      description: "Portal digital resmi Kuliah Pengabdian Masyarakat",
      heroTitle: "Selamat Datang di Portal KPM",
      heroSubtitle: "Membangun Desa, Mencerdaskan Bangsa",
      heroBgImage: "",
    });
    console.log("✅ Default settings seeded.");
  } else {
    console.log("ℹ️  Settings already exist — skipped.");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Seed Map Locations
  // ─────────────────────────────────────────────────────────────────────────
  const existingLocations = await db.select().from(mapLocations).limit(1);
  if (existingLocations.length === 0) {
    const initialLocations = [
      {
        name: "Posko KPM Kelompok 12",
        category: "posko" as const,
        latitude: -7.5361,
        longitude: 110.1234,
        description: "Posko Utama dan tempat berkumpul mahasiswa KPM Kelompok 12.",
        googleMapsUrl: "https://maps.google.com/?q=-7.5361,110.1234",
      },
      {
        name: "Balai Desa Suka Maju",
        category: "balai_desa" as const,
        latitude: -7.5350,
        longitude: 110.1220,
        description: "Pusat Pemerintahan Desa Suka Maju dan tempat koordinasi program kerja desa.",
        googleMapsUrl: "https://maps.google.com/?q=-7.5350,110.1220",
      },
      {
        name: "SD Negeri 1 Suka Maju",
        category: "sekolah" as const,
        latitude: -7.5380,
        longitude: 110.1250,
        description: "Sekolah Dasar Utama di desa, tempat pelaksanaan program bimbingan belajar.",
        googleMapsUrl: "https://maps.google.com/?q=-7.5380,110.1250",
      },
      {
        name: "UMKM Kripik Tempe Barokah",
        category: "umkm" as const,
        latitude: -7.5390,
        longitude: 110.1210,
        description: "Sentra industri kreatif pembuatan kripik tempe khas Desa Suka Maju.",
        googleMapsUrl: "https://maps.google.com/?q=-7.5390,110.1210",
      },
      {
        name: "Masjid Jami' Al-Hidayah",
        category: "tempat_ibadah" as const,
        latitude: -7.5340,
        longitude: 110.1240,
        description: "Masjid utama desa dan pusat kegiatan keagamaan masyarakat.",
        googleMapsUrl: "https://maps.google.com/?q=-7.5340,110.1240",
      },
      {
        name: "Sendang Asri Wisata Air",
        category: "wisata" as const,
        latitude: -7.5310,
        longitude: 110.1280,
        description: "Ekowisata pemandian alam dan kolam pancing bersumber dari mata air alami desa.",
        googleMapsUrl: "https://maps.google.com/?q=-7.5310,110.1280",
      },
    ];

    await db.insert(mapLocations).values(initialLocations);
    console.log(`✅ Seeded ${initialLocations.length} map locations.`);
  } else {
    console.log("ℹ️  Map locations already exist — skipped.");
  }

  console.log("🎉 Seeding complete.");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
