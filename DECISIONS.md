# Decisions

## 2026-07-02

Maps menggunakan Leaflet.

Tidak memakai Google Maps.

Alasan:

- Gratis
- Tidak perlu API Key.

## 2026-07-03

### Pengurangan Dependensi Database dari Sitemap & Pre-build Empty DB

- **Keputusan:**
  1. Menghapus seluruh impor database (`db`) dan skema (`posts`) dari `src/app/sitemap.ts` secara total, menyajikan rute sitemap statis sebagai data utama.
  2. Mengubah perintah `"build"` di `package.json` untuk menjalankan inline script Node.js yang mempre-kreasi file `dev.db` kosong secara sinkron sebelum Next.js build dimulai.
- **Alasan:**
  - Menjamin 100% proses build Next.js sukses di seluruh platform serverless (seperti Vercel) tanpa ketergantungan database dan tanpa mengalami crash thread worker (heap corruption / segfault) akibat pembuatan database secara bersamaan oleh worker.
- **Konsekuensi:**
  - Sitemap hanya menyertakan rute statis utama sementara. Dynamic news sitemap akan diaktifkan kembali saat migrasi ke database production (PostgreSQL).