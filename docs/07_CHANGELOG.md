# 07 — Changelog

> Seluruh perubahan signifikan project dicatat di sini secara kronologis terbalik (terbaru di atas).
>
> Format: `## [Tanggal] — [Nama Sprint/Task]`

---

## 2026-07-02 — Sitemap Build Fix Sprint

**Perubahan:**

- Membungkus pemanggilan query database berita (`posts`) pada `src/app/sitemap.ts` dalam blok `try...catch` untuk mengembalikan static routes jika terjadi kegagalan (misalnya database belum terbentuk pada lingkungan bersih Vercel).
- Verifikasi hasil `npm run build` berhasil 100%.

## 2026-07-02 — Release Preparation Sprint

**Perubahan:**

- Membuat file `release_notes_v1_0.md` di artifacts directory — Ringkasan v1.0, fungsionalitas utama, cara menjalankan, dan batasan rilis.
- Memperbarui berkas root `README.md` dengan deskripsi, screenshot placeholder, detail fitur, tech stack, installation, environment, build, deployment, dan license sections.

## 2026-07-02 — Deployment Preparation Sprint

**Perubahan:**

- Membuat file `docs/DEPLOYMENT.md` — panduan deployment VPS & Cloud Platform.
- Memverifikasi konfigurasi production: env variables, JWT_SECRET, NEXT_PUBLIC_BASE_URL, upload dir, database connection (SQLite).
- Menyusun panduan hak akses folder, skrip backup otomatis database & upload lokal, dan prosedur rollback.

## 2026-07-02 — Documentation Sprint

**Perubahan:**

- Migrasi ke Documentation Driven Development (DDD).
- Dibuat folder `docs/` sebagai Single Source of Truth repository.
- Dibuat `docs/05_PROJECT_STATUS.md` — status project lengkap.
- Dibuat `docs/06_NEXT_TASK.md` — antrian task berikutnya.
- Dibuat `docs/07_CHANGELOG.md` — ini.
- Dibuat `docs/08_DECISIONS.md` — keputusan teknis terkonsolidasi.
- Dibuat `docs/09_BUGS.md` — register bug aktif dan selesai.
- Dibuat `docs/10_ARCHITECTURE.md` — arsitektur sistem lengkap.
- Diperbarui `AGENTS.md` — workflow Documentation First + Definition of Done.
- Diperbarui `03_DEVELOPMENT_RULES.md` — tambah Project Sync Procedure.
- Diperbarui `04_TASK_BREAKDOWN.md` — tandai semua task selesai.
- Diperbarui `README.md` — konten project-specific (bukan boilerplate).

---

## 2026-07-02 — Production Readiness Sprint

**Perubahan:**

- `src/app/manifest.ts` dibuat — Web App Manifest (PWA, theme_color #0F766E).
- `src/app/robots.ts` dibuat — allow public, disallow admin/api.
- `src/app/sitemap.ts` dibuat — static + dynamic /berita/[slug] dari DB.
- `src/app/not-found.tsx` dibuat — halaman 404 bermerek Liquid Glass.
- `src/app/error.tsx` dibuat — global error boundary.
- `src/app/loading.tsx` dibuat — branded spinner loading.
- `src/app/layout.tsx` diperbarui — OG, Twitter Card, metadataBase.
- `src/app/(public)/page.tsx` diperbarui — OG + Twitter + canonical.
- `src/app/(public)/faq/page.tsx` diperbarui — OG + Twitter + canonical.
- `src/app/(public)/peta-lokasi/page.tsx` diperbarui — OG + Twitter + canonical.
- Semua `<img>` publik ditambahkan `loading="lazy"` / `loading="eager"`.
- `public/og-image.png` dibuat — branded Open Graph image.
- `.env.example` dibuat — template konfigurasi deployment.
- Build: ✅ 0 errors. Routes manifest, robots, sitemap terverifikasi.

---

## 2026-07-02 — Public Website Integration Sprint

**Perubahan:**

- `src/app/(public)/profil/page.tsx` dibuat — Profil, Visi Misi, Anggota dari DB.
- `src/app/(public)/program-kerja/page.tsx` dibuat — Program Kerja dari DB.
- `src/app/(public)/galeri/page.tsx` + `GalleryClient.tsx` dibuat — galeri + lightbox.
- `src/app/(public)/berita/page.tsx` + `NewsListClient.tsx` dibuat — daftar berita + filter.
- `src/app/(public)/berita/[slug]/page.tsx` dibuat — detail berita + rekomendasi.
- Build: ✅ 0 errors.

---

## 2026-07-02 — Bug Fix Sprint

**Bug yang diperbaiki:**

- **BUG-01**: FAQ module belum lengkap → Tabel `faqs`, migrasi, CRUD admin, halaman publik dibuat.
- **BUG-02**: Pagination tidak reusable → `useClientPagination` hook dibuat dan diterapkan di semua modul.
- **BUG-03**: Lint errors pada beberapa komponen admin → diperbaiki.
- Backup `backup_20260702_1901.zip` dibuat.

---

## 2026-07-01 — Phase 1–4 (Initial Build)

**Perubahan:**

- Inisialisasi project Next.js 16 dengan TypeScript, Tailwind CSS, Drizzle ORM.
- Implementasi Landing Page dengan Liquid Glass design system.
- Implementasi Admin Panel lengkap (Login, Dashboard, semua CRUD).
- Implementasi Maps interaktif menggunakan Leaflet + OpenStreetMap.
- Implementasi JWT authentication dengan Single Admin policy.
- Implementasi Storage Service abstraction.
- Implementasi Route Protection via `src/proxy.ts`.
