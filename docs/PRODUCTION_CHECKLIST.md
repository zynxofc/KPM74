# Production Checklist — LinTree KPM

> Gunakan checklist ini setiap kali hendak deploy ke lingkungan production.
>
> Tandai semua item sebelum melakukan deployment.

---

## Pre-Deployment Checklist

### Environment Variables

- [ ] `JWT_SECRET` diganti dengan nilai kuat (`openssl rand -base64 32`)
- [ ] `NEXT_PUBLIC_BASE_URL` diset ke domain production
- [ ] `DATABASE_URL` diset ke production database (bukan SQLite dev)
- [ ] `STORAGE_PROVIDER` dikonfigurasi (local / s3 / cloudinary)
- [ ] `.env.local` tidak di-commit ke version control

### Build Verification

- [ ] `npm run lint` → 0 errors
- [ ] `npm run build` → 0 errors, 0 TypeScript errors
- [ ] Semua halaman publik dapat diakses (tidak ada 404)
- [ ] Semua CRUD admin berfungsi

### SEO & Discovery

- [ ] `/sitemap.xml` dapat diakses dan berisi semua URL
- [ ] `/robots.txt` dapat diakses
- [ ] `/manifest.webmanifest` dapat diakses
- [ ] Open Graph preview berfungsi (test di: https://www.opengraph.xyz/)
- [ ] Twitter Card preview berfungsi (test di: https://cards-dev.twitter.com/validator)
- [ ] Favicon tampil dengan benar

### Performance

- [ ] Lighthouse Performance ≥ 90 (jalankan di halaman `/`, `/berita`, `/galeri`)
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Gambar menggunakan `loading="lazy"` / `loading="eager"`

### Security

- [ ] Admin panel tidak dapat diakses tanpa login
- [ ] Cookie `auth_token` bersifat HttpOnly
- [ ] File upload divalidasi tipe dan ukuran
- [ ] Tidak ada secret key yang hardcode di source code

### Functionality

- [ ] Login admin berfungsi
- [ ] Logout admin berfungsi
- [ ] CRUD Anggota berfungsi
- [ ] CRUD Program Kerja berfungsi
- [ ] CRUD Galeri (foto + video) berfungsi
- [ ] CRUD Berita berfungsi
- [ ] CRUD FAQ berfungsi
- [ ] CRUD Peta Marker berfungsi
- [ ] CRUD Pengaturan (Hero, Sosial Media) berfungsi
- [ ] Halaman publik menampilkan data dari database
- [ ] Peta interaktif Leaflet berfungsi
- [ ] Lightbox galeri berfungsi
- [ ] FAQ accordion berfungsi

### Responsiveness

- [ ] Mobile (320px - 768px) — semua halaman
- [ ] Tablet (768px - 1024px) — semua halaman
- [ ] Desktop (1024px+) — semua halaman

---

## Post-Deployment Checklist

- [ ] Akses domain production berhasil
- [ ] HTTPS aktif (SSL Certificate valid)
- [ ] Login admin berhasil di environment production
- [ ] Upload file berfungsi (test upload foto anggota)
- [ ] Sitemap terindeks oleh Google Search Console
- [ ] Backup database production pertama dibuat

---

## Rollback Plan

Jika terjadi masalah setelah deploy:

1. Restore dari backup terakhir (`backup_20260702_1901.zip` atau backup terbaru).
2. Downgrade ke build sebelumnya jika menggunakan platform CI/CD.
3. Jalankan `npm run db:seed` jika database corrupt.

---

**Status:** PROJECT READY FOR DEPLOYMENT — per 2026-07-02
