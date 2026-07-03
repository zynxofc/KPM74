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
