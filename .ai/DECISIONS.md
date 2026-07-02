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

## 2026-07-02 (Vercel Build Sitemap)

- Keputusan: Membungkus query database di `sitemap.ts` menggunakan blok `try...catch` dan mengembalikan static routes jika gagal.
- Alasan: Menghindari kegagalan build (`SqliteError: no such table: posts`) pada platform bersih seperti Vercel sebelum database dimigrasikan.

