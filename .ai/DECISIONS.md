# Decisions

## 2026-07-02

- Maps menggunakan Leaflet.
- Tidak memakai Google Maps.
  - Alasan:
    - Gratis
    - Tidak perlu API Key.

## 2026-07-02 (Backup)

- Keputusan: Membuat backup lengkap project menggunakan `Compress-Archive` sebelum mengakhiri sesi.
- Alasan: Memastikan semua artefak, kode, dan konfigurasi dapat dipulihkan; mendukung kontinuitas kerja AI selanjutnya.

## 2026-07-03 (Vercel Build Sitemap & Pre-build Empty DB)

- Keputusan:
  1. Menghapus seluruh impor database (`db`) dan skema (`posts`) dari `src/app/sitemap.ts` secara total, menyajikan rute sitemap statis sebagai data utama.
  2. Mengubah perintah `"build"` di `package.json` untuk menjalankan inline script Node.js yang mempre-kreasi file `dev.db` kosong secara sinkron sebelum Next.js build dimulai.
- Alasan: Menghindari kegagalan build (`SqliteError: no such table: posts`) dan crash thread worker akibat pembuatan database secara bersamaan oleh worker pada platform bersih seperti Vercel.

## 2026-07-03 (Vercel Preview Mode via PREVIEW_MODE=true)

- Keputusan:
  1. Implementasi environment variable `PREVIEW_MODE=true` untuk memicu mode preview.
  2. Memusatkan seluruh logika deteksi dan data statis di dalam modul `src/lib/preview/` (`isPreviewMode()`, `getPreviewData()`, `getPreviewPostBySlug()`, `preview-data.ts`).
  3. Pada `src/db/index.ts`, jika `PREVIEW_MODE === "true"`, `db` dialokasikan sebagai `{}` kosong tanpa inisialisasi SQLite/better-sqlite3.
  4. Semua halaman publik dan admin memanggil `isPreviewMode()` untuk early-return atau menggunakan data preview statis.
  5. Autentikasi Preview memvalidasi kredensial login langsung terhadap env `ADMIN_USERNAME` & `ADMIN_PASSWORD` (gagal jika env tidak didefinisikan).
  6. Seluruh 19 database-modifying Server Actions di-guard untuk menolak operasi dengan error "Fitur dinonaktifkan pada Preview Deployment."
  7. Menambahkan banner "Preview Deployment - Database dinonaktifkan" di Admin layout.
- Alasan: Memungkinkan Vercel build dan runtime berjalan 100% tanpa SQLite, menghindari technical debt proxy database kompleks dengan memisahkan logic data preview secara eksplisit, dan menjaga local development serta hosting production (Jagoan Hosting) tetap menggunakan SQLite secara transparan tanpa modifikasi fungsionalitas.
