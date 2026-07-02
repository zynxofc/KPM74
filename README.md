# LinTree KPM — Portal Resmi Kuliah Pengabdian Masyarakat

![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![TypeScript Check](https://img.shields.io/badge/typescript-strict-blue.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Portal digital resmi **LinTree KPM** untuk pengelolaan kegiatan, timeline program kerja, publikasi berita, galeri dokumentasi, dan peta interaktif lokasi pengabdian Kuliah Pengabdian Masyarakat (KPM) kelompok mahasiswa. Dirancang dengan pengalaman visual premium menggunakan **Liquid Glass Design System** (Glassmorphism & Micro-animations) serta dilengkapi panel dashboard Content Management System (CMS) mandiri untuk admin.

---

## Screenshot

![LinTree KPM Desktop Screenshot Placeholder](/og-image.png)

> [!NOTE]
> Gambar di atas merupakan representasi default Open Graph visual banner untuk branding portal digital LinTree KPM.

---

## Features

### 🌐 Public Website

- **Animated Hero Section:** Header interaktif visual premium dengan gradient reveal, fade-in animations, dan tautan sosial media dinamis.
- **Profil Kelompok & Desa:** Halaman sambutan resmi, visi, misi, dan daftar struktur organisasi anggota kelompok mahasiswa yang ditarik dari database.
- **Timeline Program Kerja:** Linimasa terstruktur dengan status pelaksanaan (rencana, berjalan, selesai) dan tautan dokumentasi foto.
- **Galeri Masonry Grid:** Tampilan media foto & video terintegrasi dengan filter kategori dan lightbox popup untuk detail media.
- **Berita & Publikasi:** Pencarian teks artikel, filter kategori, ringkasan otomatis, serta pembagian halaman (*client-side pagination*).
- **Peta Lokasi Interaktif:** Marker khusus posko, sekolah, UMKM, tempat ibadah, balai desa, dan tempat wisata menggunakan Leaflet & OpenStreetMap.
- **FAQ Accordion:** Menu tanya-jawab interaktif terkelola.

### 🔐 Admin Dashboard (CMS)

- **Single Admin Autentikasi:** Keamanan akses menggunakan token JWT (jose) dengan status HttpOnly cookie + route guard proxy server-side.
- **Content Managers (CRUD):** Kelola data Hero/Pengaturan, Anggota, Program Kerja, Galeri Media, Berita (dengan automatic slug generation), FAQ, dan Marker Peta Lokasi.
- **Audit Logs:** Audit trail immutable (tidak dapat dihapus) yang mencatat log aktivitas login, logout, create, update, dan delete di admin panel.
- **Reusable DataTable:** Tabel data lengkap dengan fitur pencarian instan, filter, dan pagination dinamis.

---

## Tech Stack

- **Framework:** Next.js 16.2.9 (App Router)
- **Bahasa:** TypeScript 5.x (Strict mode)
- **Styling:** Tailwind CSS 4.x
- **Animasi:** Framer Motion 12.x
- **Database ORM:** Drizzle ORM 0.45.x
- **Database Client:** better-sqlite3 12.x (SQLite lokal)
- **Validasi:** Zod 4.x & React Hook Form 7.x
- **Peta:** Leaflet 1.9.x & react-leaflet 5.x
- **Kredensial Keamanan:** jose (JWT) & bcryptjs (password hashing)
- **Icons:** Lucide React

---

## Environment

Buat berkas `.env.local` di folder root project dan masukkan variabel konfigurasi berikut:

```bash
# SQLite DB file path
DATABASE_URL=dev.db

# JWT Secret (Min. 32 karakter acak)
JWT_SECRET=lintreekpmsecretdevelopmentkey12345!

# Initial Admin Credentials (digunakan hanya saat npm run db:seed)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# File Storage Provider: "local" (menyimpan ke public/uploads/)
STORAGE_PROVIDER=local

# Base URL Domain untuk Sitemap & OG metadata
NEXT_PUBLIC_BASE_URL=https://lintreekpm.vercel.app
```

---

## Installation

Pastikan Anda telah menginstal Node.js versi 20.x atau 22.x (LTS) di sistem lokal Anda.

### 1. Install Dependencies

```bash
npm install
```

### 2. Jalankan Migrasi Schema Database

Perintah ini akan membaca skema Drizzle di `src/db/schema.ts` dan membuat berkas database SQLite `dev.db` beserta tabel-tabelnya:

```bash
npm run db:push
```

### 3. Jalankan Database Seeder

Perintah ini akan memasukkan akun administrator awal ke database serta mengisi data settings awal:

```bash
npm run db:seed
```

---

## Development

Jalankan local server untuk development:

```bash
npm run dev
```

Buka browser Anda dan akses:

- **Halaman Publik:** [http://localhost:3000](http://localhost:3000)
- **Halaman Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) (Gunakan kredensial `admin` / `admin123` untuk login pertama kali)

Untuk memeriksa linting kode:

```bash
npm run lint
```

---

## Build

Untuk melakukan kompilasi dan memaketkan aplikasi Next.js ke production:

```bash
npm run build
```

Ini akan melakukan verifikasi kode TypeScript, menjalankan ESLint, mengoptimasi aset, dan men-generate static assets, robots.txt, sitemap.xml, serta manifest.webmanifest.

---

## Deployment

### VPS (Self-Hosted)

1. Jalankan `npm ci` di server.
2. Buat folder penyimpanan persisten untuk database dan file upload:

   ```bash
   mkdir -p data public/uploads
   chmod -R 775 data public/uploads
   ```

3. Set environment variable `DATABASE_URL` mengarah ke folder tersebut (contoh: `DATABASE_URL=data/prod.db`) dan ganti `JWT_SECRET` dengan string acak yang kuat.
4. Jalankan `npm run db:push` dan `npm run db:seed`.
5. Kompilasi aplikasi: `npm run build`.
6. Jalankan proses dengan PM2:

   ```bash
   pm2 start npm --name "lintree-kpm" -- start
   ```

### Cloud Serverless (Vercel / Railway)

1. Sambungkan repositori GitHub ke platform pilihan Anda.
2. Konfigurasi variabel environment di panel dashboard platform.
3. Next.js secara otomatis mendeteksi konfigurasi build dan start (`npm run build` dan `npm run start`).
4. *Catatan:* SQLite menggunakan penyimpanan lokal disk. Pastikan menggunakan platform penyedia persistent volume (seperti Railway dengan persistent disk mount) atau konfigurasikan file adapter eksternal jika menggunakan serverless murni (seperti Vercel) agar database tidak ter-reset secara berkala.

---

## License

Didistribusikan di bawah Lisensi MIT. Lihat berkas `LICENSE` untuk informasi lebih lanjut.
