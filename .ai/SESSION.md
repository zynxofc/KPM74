# SESSION

## Last Update

2026-07-03 — Vercel Preview Mode Integration

## Status

PROJECT READY FOR RELEASE v1.1. (Vercel Preview Mode 100% verified with clean build & lint)

## Pekerjaan Sesi Ini

Vercel Preview Mode Integration:

1. Membuat modul helper `src/lib/preview/` berisi `isPreviewMode()`, `getPreviewData()`, `getPreviewPostBySlug()`, dan data preview statis `preview-data.ts`.
2. Mengubah `src/db/index.ts` agar inisialisasi SQLite database dilewati dan diset ke `{}` kosong saat `PREVIEW_MODE=true` aktif.
3. Menghubungkan seluruh 8 halaman publik (`/`, `/profil`, `/program-kerja`, `/galeri`, `/berita`, `/berita/[slug]`, `/faq`, `/peta-lokasi`) untuk merender data statis dari modul preview secara transparan dan bebas dari database queries.
4. Memasang banner warning "Preview Deployment - Database dinonaktifkan" di layout dashboard admin (`src/app/(admin)/admin/layout.tsx`).
5. Menambahkan logic pengaman pada login panel (`src/lib/auth/actions.ts`) yang memvalidasi username dan password langsung terhadap env `ADMIN_USERNAME` dan `ADMIN_PASSWORD` tanpa ketergantungan database saat Preview Mode.
6. Mengamankan seluruh 19 database-modifying Server Actions di `src/lib/admin/actions.ts` agar mengembalikan pesan "Fitur dinonaktifkan pada Preview Deployment." ketika diakses di Preview Mode.
7. Memperbarui utility health check (`src/lib/admin/health.ts`) agar early-return status "Preview Mode" tanpa membaca database atau filesystem.
8. Memverifikasi build dan linter 100% bersih tanpa error (0 errors).

## Catatan Penting

- Preview Mode diaktifkan menggunakan environment variable `PREVIEW_MODE=true`.
- Pada Preview Mode, SQLite database tidak dibuka/diakses sama sekali, dan better-sqlite3/drizzle tidak diinisialisasi.
- Seluruh CRUD di admin dinonaktifkan dengan pesan error "Fitur dinonaktifkan pada Preview Deployment."
- Login ke panel admin di Vercel menggunakan `ADMIN_USERNAME` dan `ADMIN_PASSWORD` yang didapat dari environment variables (gagal jika env tidak diset).

## Next Step

Deploy repositori ke Vercel dengan menyertakan `PREVIEW_MODE=true`, `ADMIN_USERNAME`, dan `ADMIN_PASSWORD` di panel environment variables Vercel.
