# PROJECT CONTEXT

## Nama Project
LinTree KPM

## Tujuan
Portal digital resmi **LinTree KPM** untuk manajemen kegiatan KPM multidisiplin, termasuk:
- Dashboard admin
- CRUD untuk Anggota, Program, Galeri, Berita, FAQ, Maps
- Sistem otentikasi admin tunggal
- Monitoring Posko via peta interaktif
- Publikasi konten (berita, FAQ, galeri)

---

## Tech Stack

- **Framework**: Next.js 16.2.9 (App Router) dengan TypeScript
- **Styling**: TailwindCSS, custom design tokens (Liquid Glass Design System)
- **Database**: SQLite (development & production) via Drizzle ORM
- **Preview Mode**: Mode tanpa database (diaktifkan via environment `PREVIEW_MODE=true`) untuk demo UI murni di Vercel, menggunakan data statis di `src/lib/preview/`
- **Storage**: Abstraksi `storageService` (local storage adapter) untuk upload file
- **Keamanan**: Proxy (`src/proxy.ts`) melindungi semua route `/admin/*`

---

## Progress

✅ Semua fitur utama selesai (Beranda, Profil, Program Kerja, Galeri, Berita, FAQ, Peta Lokasi, Admin Panel CRUD, Activity Log).

✅ Sitemap SQLite dependency fix & pre-build creation script selesai.

✅ Vercel Preview Mode Integration selesai (100% verified, clean build & lint).

---

## Struktur Folder

- `src/app/`: Routing dan view pages (admin group, public group)
- `src/components/`: UI components dan manager components (anggota, program, faq, berita, map, dll)
- `src/db/`: Skema database Drizzle dan seeders
- `src/lib/`: Server actions, validations, auth session, dan storage adapters
- `src/lib/preview/`: Centralized helper dan static preview data
- `docs/`: Dokumentasi project (Single Source of Truth)

---

## Cara Menjalankan

1. `npm install`
2. `npm run db:push`
3. `npm run db:seed`
4. `npm run dev`

---

## Catatan

- SQLite tetap menjadi database utama untuk Local Development dan Jagoan Hosting.
- Platform Vercel digunakan eksklusif sebagai UI Preview menggunakan `PREVIEW_MODE=true`.
- Gunakan TypeScript strict mode.
- Selalu buat komponen yang reusable.
