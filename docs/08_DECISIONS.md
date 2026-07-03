# 08 — Technical Decisions

> Setiap keputusan teknis yang berdampak pada arsitektur, library, atau pola pengembangan harus dicatat di sini.
>
> Format: `## [ID] — [Judul Keputusan]`

---

## DEC-01 — Maps menggunakan Leaflet (bukan Google Maps)

**Tanggal:** 2026-07-01

**Konteks:** Perlu menampilkan peta interaktif dengan marker di halaman publik dan admin.

**Keputusan:** Gunakan Leaflet + react-leaflet dengan tile dari OpenStreetMap.

**Alasan:**

- Gratis, tidak perlu API Key berbayar.
- Open source, tidak ada rate limit.
- Bundle size lebih kecil dari Google Maps SDK.

**Konsekuensi:**

- Leaflet tidak mendukung SSR (window object) — harus dimuat dengan `next/dynamic` + `ssr: false`.
- Tidak ada fitur Street View atau Places API.

---

## DEC-02 — Single Administrator Policy

**Tanggal:** 2026-07-01

**Konteks:** Perlu sistem autentikasi untuk admin panel.

**Keputusan:** Satu akun admin saja. Tabel `users` hanya menyimpan satu record.

**Alasan:**

- Scope proyek kecil (satu kelompok KPM).
- Menyederhanakan autentikasi dan menghilangkan kebutuhan RBAC/ACL.
- Mengurangi attack surface keamanan.

**Konsekuensi:**

- Tidak bisa multi-admin tanpa refaktor tabel `users` di masa depan.
- Tidak ada fitur "lupa password" (reset manual via seed).

---

## DEC-03 — Storage Service Abstraction

**Tanggal:** 2026-07-01

**Konteks:** Perlu menyimpan file upload (foto anggota, dokumentasi, thumbnail berita, dll).

**Keputusan:** Buat `IStorageService` interface di `src/lib/storage/` dengan `LocalStorageAdapter` untuk dev.

**Alasan:**

- Memungkinkan swap ke Cloudinary/S3 tanpa mengubah komponen atau actions.
- Mengisolasi dependency `fs` ke satu tempat.
- Mudah di-mock saat testing.

**Konsekuensi:**

- Semua upload WAJIB melalui `storageService`, tidak boleh langsung import `fs`.
- Untuk production deployment, perlu membuat adapter baru (S3Adapter/CloudinaryAdapter).

---

## DEC-04 — Route Protection via `src/proxy.ts` (bukan `middleware.ts`)

**Tanggal:** 2026-07-01

**Konteks:** Next.js 16 mengubah API middleware.

**Keputusan:** Gunakan `src/proxy.ts` sebagai route guard untuk semua path `/admin/*`.

**Alasan:**

- Next.js 16 menggunakan konvensi `proxy.ts` sebagai pengganti `middleware.ts` untuk kasus ini.
- Lebih kompatibel dengan versi Next.js yang digunakan (16.2.9).

**Konsekuensi:**

- Jika upgrade Next.js, periksa kembali kompatibilitas `proxy.ts`.

---

## DEC-05 — Reusable Pagination Hook

**Tanggal:** 2026-07-02

**Konteks:** Setiap manager admin memiliki implementasi pagination yang berbeda-beda, menyebabkan bug dan duplikasi kode.

**Keputusan:** Buat `useClientPagination` di `src/hooks/useClientPagination.ts`.

**Alasan:**

- Single source of truth untuk logika pagination.
- Mencegah cascading render warnings dari setState di render phase.
- Mudah digunakan di semua komponen dengan interface yang sama.

**Konsekuensi:**

- Semua pagination client-side WAJIB menggunakan hook ini, tidak boleh custom.

---

## DEC-06 — `<img>` native (bukan `next/image`) untuk upload dinamis

**Tanggal:** 2026-07-02

**Konteks:** Gambar berasal dari URL dinamis hasil upload admin (disimpan di `public/uploads/`).

**Keputusan:** Tetap gunakan `<img>` native dengan `loading="lazy"` + `decoding="async"`.

**Alasan:**

- `next/image` memerlukan konfigurasi `remotePatterns` yang berbeda per environment.
- URL upload berasal dari domain yang sama (tidak perlu optimasi cross-origin).
- Menghindari kompleksitas konfigurasi `next.config.ts` yang berbeda di dev vs production.

**Konsekuensi:**

- Tidak mendapat optimasi WebP/AVIF otomatis dari Next.js Image.
- Harus ditambahkan `loading="lazy"` secara manual di setiap `<img>`.

---

## DEC-07 — SQLite untuk Development

**Tanggal:** 2026-07-01

**Konteks:** Perlu database yang mudah disetup untuk development lokal.

**Keputusan:** SQLite via `better-sqlite3` dengan Drizzle ORM.

**Alasan:**

- Zero-config, tidak perlu server database terpisah.
- Drizzle ORM menyediakan type-safe query.
- Mudah di-commit sebagai `dev.db` untuk testing.

**Konsekuensi:**

- Untuk production, harus migrasi ke PostgreSQL/MySQL dan update `drizzle.config.ts`.
- `DATABASE_URL` di `.env.local` harus diubah saat deploy.

---

## DEC-08 — `NEXT_PUBLIC_BASE_URL` untuk metadata & sitemap

**Tanggal:** 2026-07-02

**Konteks:** URL base domain perlu bisa dikonfigurasi per environment untuk sitemap, OG, dan canonical URL.

**Keputusan:** Gunakan `process.env.NEXT_PUBLIC_BASE_URL` dengan fallback ke `https://lintreekpm.vercel.app`.

**Alasan:**

- Tidak hardcode domain production di source code.
- Mudah diubah saat deploy ke domain custom tanpa mengubah kode.

**Konsekuensi:**

- Jika `NEXT_PUBLIC_BASE_URL` tidak di-set di `.env.local`, sitemap dan OG menggunakan URL Vercel.
- Wajib di-set saat deploy ke domain custom.

---

## DEC-09 — Pengurangan Dependensi Database dari Sitemap & Pre-build Empty DB

**Tanggal:** 2026-07-03

**Konteks:** Next.js melakukan pra-render sitemap (`/sitemap.xml`) pada saat kompilasi (*build-time*). Karena SQLite bersifat file-based lokal, server Vercel yang tidak memiliki database termigrasi memicu `SqliteError: no such table: posts` jika `sitemap.ts` mengimpor `db`. Selain itu, jika file database `dev.db` sama sekali absen pada server build, Next.js worker threads yang memproses static tracing akan mencoba membuat file secara bersamaan, sehingga memicu heap corruption crash (exit code `3221226505`).

**Keputusan:**

1. Menghapus seluruh impor database (`db`) dan skema (`posts`) dari `src/app/sitemap.ts` secara total, serta menyajikan rute sitemap statis sebagai data keluaran utama sitemap.
2. Mengubah perintah `"build"` di `package.json` untuk menjalankan inline script Node.js yang mempre-kreasi file `dev.db` kosong secara sinkron sebelum Next.js build dimulai.

**Alasan:**

- Menjamin 100% proses build Next.js sukses di seluruh platform serverless (seperti Vercel) tanpa ketergantungan database dan tanpa mengalami crash thread worker.
- Menghindari inisialisasi query dan pembacaan disk SQLite yang tidak perlu saat build metadata.
- Mengurangi kompleksitas penanganan database lokal di lingkungan build.

**Konsekuensi:**

- Sitemap hanya akan menyertakan rute statis utama. Sitemap berita dinamis dinonaktifkan sementara dan akan diaktifkan kembali saat migrasi ke database production berbasis cloud (PostgreSQL).
