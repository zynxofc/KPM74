import { z } from "zod";

// Admin Login validation schema
export const loginSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

// Map Location validation schema
export const mapLocationSchema = z.object({
  name: z.string().min(3, "Nama lokasi minimal 3 karakter"),
  category: z.enum(["posko", "balai_desa", "sekolah", "umkm", "tempat_ibadah", "wisata"]),
  latitude: z.number({ message: "Latitude harus bernilai angka" })
    .min(-90, "Latitude minimal -90")
    .max(90, "Latitude maksimal 90"),
  longitude: z.number({ message: "Longitude harus bernilai angka" })
    .min(-180, "Longitude minimal -180")
    .max(180, "Longitude maksimal 180"),
  description: z.string().optional(),
  googleMapsUrl: z.string().url("Masukkan URL Google Maps yang valid").or(z.literal("")),
});

// Site Settings & Hero validation schema
export const settingsSchema = z.object({
  siteName: z.string().min(3, "Nama portal minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  socialInstagram: z.string().url("Masukkan URL Instagram yang valid").or(z.literal("")),
  socialTiktok: z.string().url("Masukkan URL TikTok yang valid").or(z.literal("")),
  socialWhatsapp: z.string().url("Masukkan URL WhatsApp yang valid").or(z.literal("")),
  socialMaps: z.string().url("Masukkan URL Google Maps yang valid").or(z.literal("")),
  heroTitle: z.string().min(3, "Judul Hero minimal 3 karakter"),
  heroSubtitle: z.string().min(5, "Sub-judul Hero minimal 5 karakter"),
  heroBgImage: z.string().default(""),
  allowPublicRegistrations: z.boolean(),
  maintenanceMode: z.boolean(),
});

// Member validation schema
export const memberSchema = z.object({
  name: z.string().min(3, "Nama anggota minimal 3 karakter"),
  nimNip: z.string().min(5, "NIM/NIP minimal 5 karakter"),
  role: z.string().min(3, "Jabatan minimal 3 karakter"),
  photoUrl: z.string().default(""),
});

// Program validation schema
export const programSchema = z.object({
  name: z.string().min(3, "Nama program kerja minimal 3 karakter"),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  startDate: z.string().min(1, "Tanggal mulai harus diisi"),
  endDate: z.string().min(1, "Tanggal selesai harus diisi"),
  status: z.enum(["rencana", "berjalan", "selesai"]),
  documentationUrl: z.string().default(""),
}).refine((data) => {
  const start = new Date(data.startDate).getTime();
  const end = new Date(data.endDate).getTime();
  return start <= end;
}, {
  message: "Tanggal mulai tidak boleh melebihi tanggal selesai",
  path: ["startDate"],
});

// Gallery validation schema
export const gallerySchema = z.object({
  title: z.string().min(3, "Judul media minimal 3 karakter"),
  type: z.enum(["image", "video"]),
  fileUrl: z.string().default(""),
  caption: z.string().optional(),
});

// Post validation schema
export const postSchema = z.object({
  title: z.string().min(3, "Judul berita minimal 3 karakter"),
  content: z.string().min(10, "Konten berita minimal 10 karakter"),
  category: z.string().min(3, "Kategori berita minimal 3 karakter"),
  thumbnailUrl: z.string().default(""),
});

// FAQ validation schema
export const faqSchema = z.object({
  question: z.string().min(5, "Pertanyaan minimal 5 karakter"),
  answer: z.string().min(10, "Jawaban minimal 10 karakter"),
});
