# SESSION

## Last Update

2026-07-02 — Sitemap Build Fix Sprint

## Status

PROJECT READY FOR RELEASE v1.0 & DEPLOYMENT.

## Pekerjaan Sesi Ini

Sitemap Build Fix Sprint:

1. Modifikasi `src/app/sitemap.ts` untuk membungkus pemanggilan database query berita (`posts`) dalam blok `try...catch` demi mencegah kegagalan build (`SqliteError: no such table: posts`) ketika database belum termigrasi (seperti di Vercel build time).
2. Verifikasi lokal `npm run build` sukses 100%.
3. Diperbarui dokumen keputusan teknis (`docs/08_DECISIONS.md` dan `.ai/DECISIONS.md`) dengan menambahkan entri `DEC-09`.
4. Diperbarui berkas log perubahan (`docs/07_CHANGELOG.md` dan `CHANGELOG.md`).

## Catatan Penting

- Saat Next.js di-deploy ke Vercel, database SQLite (`dev.db`) biasanya kosong atau belum bermigrasi. Membungkus query sitemap dengan penanganan error memastikan build pipeline Vercel tidak terhenti, dan sitemap akan mengembalikan URL statis utama sebagai fallback dasar.
- Setelah proses deploy selesai dan database termigrasi secara dinamis, sitemap akan otomatis menyertakan link berita begitu database terisi data tanpa perlu merubah kode kembali.

## Next Step

Push repositori ke GitHub dan deploy ke Vercel/Railway.
