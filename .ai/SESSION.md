# SESSION

## Last Update

2026-07-03 — SQLite Decoupling on Vercel Runtime

## Status

PROJECT READY FOR RELEASE v1.2. (Vercel Preview Mode 100% dynamic import decoupled and verified)

## Pekerjaan Sesi Ini

SQLite Decoupling on Vercel Runtime:

1. Membuat dynamic service helpers di `src/lib/preview/index.ts` (seperti `getSiteSettings`, `getMembersList`, `getNewsPostDetail`, dll) yang menggunakan `await import()` secara dinamis.
2. Memodifikasi seluruh 8 halaman publik untuk menghapus static import ke `@/db` dan `@/db/schema` secara total.
3. Halaman publik sekarang memanggil dynamic service helpers tersebut. Di bawah Preview Mode, baris dynamic import database tidak pernah dieksekusi, sehingga SQLite native drivers tidak pernah dievaluasi atau dimuat di Vercel.
4. Menambahkan `createdAt` ke mock data dan mengubah location category enum di `src/lib/preview/preview-data.ts` agar conform 100% dengan tipe data skema Drizzle, menghilangkan warnings dan TypeScript errors.
5. Memverifikasi hasil build Next.js sukses 100% dengan type checking.
6. Memverifikasi bundle `.next` output dan memastikan tidak ada referensi ke `better-sqlite3`, `new Database`, `drizzle`, maupun `src/db/index` pada bundle halaman publik.

## Catatan Penting

- Preview Mode diaktifkan menggunakan environment variable `PREVIEW_MODE=true` atau secara otomatis terdeteksi jika `VERCEL=1`.
- Halaman publik 100% steril dari import SQLite baik secara static maupun dynamic runtime evaluation di Preview Mode.

## Next Step

Deploy repositori ke Vercel dengan menyertakan `PREVIEW_MODE=true`, `ADMIN_USERNAME`, dan `ADMIN_PASSWORD`.
