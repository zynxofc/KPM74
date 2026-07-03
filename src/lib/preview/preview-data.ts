export const PREVIEW_SETTINGS = {
  id: 1,
  siteName: "LinTree KPM (Preview)",
  description: "Portal digital resmi Kuliah Pengabdian Masyarakat (KPM) — Preview Mode.",
  socialInstagram: "https://instagram.com",
  socialTiktok: "https://tiktok.com",
  socialWhatsapp: "https://wa.me",
  socialMaps: "",
  heroTitle: "Selamat Datang di Portal LinTree KPM",
  heroSubtitle: "Preview Mode: Database dinonaktifkan. Seluruh data di bawah ini adalah data preview/simulasi untuk demonstrasi UI.",
  heroBgImage: "",
  allowPublicRegistrations: false,
  maintenanceMode: false,
  updatedAt: new Date().toISOString(),
};

export const PREVIEW_MEMBERS = [
  { id: 1, name: "Budi Santoso", nimNip: "123456789", role: "Ketua Kelompok", photoUrl: "" },
  { id: 2, name: "Siti Rahma", nimNip: "123456790", role: "Sekretaris", photoUrl: "" },
  { id: 3, name: "Dewi Lestari", nimNip: "123456791", role: "Bendahara", photoUrl: "" },
  { id: 4, name: "Ahmad Fauzi", nimNip: "123456792", role: "Divisi Humas", photoUrl: "" },
];

export const PREVIEW_PROGRAMS = [
  {
    id: 1,
    name: "Pemberdayaan UMKM Digital",
    description: "Pelatihan digital marketing dan pembuatan toko online untuk pelaku UMKM di desa binaan.",
    startDate: "2026-07-05",
    endDate: "2026-07-10",
    status: "selesai",
    documentationUrl: "",
  },
  {
    id: 2,
    name: "Pencegahan Stunting Anak",
    description: "Penyuluhan gizi seimbang dan pembagian PMT (Pemberian Makanan Tambahan) di Posyandu.",
    startDate: "2026-07-12",
    endDate: "2026-07-15",
    status: "berjalan",
    documentationUrl: "",
  },
];

export const PREVIEW_GALLERY = [
  { id: 1, title: "Sosialisasi UMKM", type: "image" as const, fileUrl: "", caption: "Foto bersama pelaku UMKM" },
  { id: 2, title: "Penyuluhan Stunting", type: "image" as const, fileUrl: "", caption: "Penyuluhan di Balai Desa" },
];

export const PREVIEW_POSTS = [
  {
    id: 1,
    title: "KPM LinTree KPM Resmi Diterjunkan di Desa",
    slug: "kpm-lintree-resmi-diterjunkan",
    content: "<p>Kelompok mahasiswa KPM LinTree KPM resmi diterjunkan untuk mengabdi selama satu bulan. Upacara pelepasan dihadiri oleh Kepala Desa.</p>",
    category: "Kegiatan",
    thumbnailUrl: "",
    publishedAt: "2026-07-02T12:00:00.000Z",
  },
  {
    id: 2,
    title: "UMKM Desa Go Digital Melalui Pelatihan E-Commerce",
    slug: "umkm-desa-go-digital",
    content: "<p>Mahasiswa KPM mengadakan pelatihan digital branding dan optimalisasi Shopee untuk meningkatkan penjualan keripik lokal.</p>",
    category: "Artikel",
    thumbnailUrl: "",
    publishedAt: "2026-07-03T09:00:00.000Z",
  },
];

export const PREVIEW_FAQS = [
  { id: 1, question: "Berapa lama kegiatan KPM berlangsung?", answer: "Kegiatan KPM berlangsung selama 30 hari penuh di lokasi posko desa binaan." },
  { id: 2, question: "Siapa saja sasaran program kerja KPM?", answer: "Sasaran utama program kerja meliputi pelaku UMKM, anak usia balita, serta perangkat desa setempat." },
];

export const PREVIEW_LOCATIONS = [
  {
    id: 1,
    name: "Posko Utama KPM",
    category: "Posko KPM",
    latitude: -7.5,
    longitude: 110.4,
    description: "Tempat tinggal dan pusat koordinasi mahasiswa KPM.",
    googleMapsUrl: "https://maps.google.com",
  },
];
