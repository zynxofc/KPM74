# PROJECT CONTEXT

## Tujuan Project

Portal digital resmi **LinTree KPM** untuk manajemen kegiatan KPM multidisiplin, termasuk:

- Dashboard admin
- CRUD untuk Anggota, Program, Galeri, Berita, FAQ, Maps
- Sistem otentikasi admin tunggal
- Monitoring Posko via peta interaktif
- Publikasi konten (berita, FAQ, galeri)

## Arsitektur

- **Frontend**: Next.js 16 (App Router) dengan TypeScript, TailwindCSS, Framer Motion, Liquid Glass design system.
- **Backend API**: Laravel REST API (terpisah, dikonsumsi via fetch di server actions).
- **Database**: SQLite (development) via Drizzle ORM; schema didefinisi di `src/db/schema.ts`.
- **Preview Mode**: Mode tanpa database (diaktifkan via environment `PREVIEW_MODE=true`) untuk demo UI murni di Vercel, menggunakan data statis di `src/lib/preview/`.
- **Storage**: Abstraksi `storageService` (local storage adapter) untuk upload file.
- **Keamanan**: Proxy (`src/proxy.ts`) melindungi semua route `/admin/*`.

## Stack

- **Language**: TypeScript, React
- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS, custom design tokens (Liquid Glass)
- **ORM**: Drizzle ORM (SQLite)
- **Validation**: Zod
- **Animations**: Framer Motion
- **Testing**: Manual QA, lint, TypeScript type‑check

## Struktur Folder Penting

```text
src/
  app/               # Route groups (admin, public)
  components/        # UI components, admin managers, GlassCard, etc.
  db/                # Drizzle schema definitions
  hooks/             # Custom hooks (e.g., useClientPagination)
  lib/               # utilities, storageService, validations, admin actions
  proxy.ts            # route protection
```

## Database (summary)

- `users` – satu admin
- `activity_logs` – audit trail
- `settings` – konfigurasi global & hero
- `members`, `programs`, `gallery`, `posts`, `faqs`, `map_locations`

## API

Frontend berinteraksi dengan Laravel API melalui server actions di `src/lib/admin/actions.ts`. Semua CRUD admin menggunakan endpoint yang dibungkus di server actions, dengan validasi Zod.

## Fitur Selesai

- Otentikasi (login/logout)
- Dashboard admin
- CRUD lengkap untuk **Hero**, **Anggota**, **Program**, **Galeri**, **Berita**, **FAQ**, **Maps** (marker CRUD)
- Reusable client‑side pagination (`useClientPagination`)
- FAQ publik page & admin manager
- Dynamic landing page dengan glass‑morphism dan animated hero
- Backup zip creation

## Fitur Sedang Dikerjakan

- Penyempurnaan fitur **Maps** (realtime marker updates, UI polish)

## Fitur Belum Dibuat

- Export PDF laporan
- Multi‑admin / role‑based access (tidak akan dikerjakan dalam sprint ini)
- Integrasi email notifikasi

## Bug yang Diketahui & Diperbaiki

- **BUG‑01**: FAQ module belum lengkap → ditambahkan tabel, migrasi, CRUD, halaman admin & publik.
- **BUG‑02**: Duplikasi pagination pada DataTable → digantikan dengan reusable hook.
- **BUG-05**: Error build Vercel akibat SQLite dependency di `sitemap.ts` & thread worker crash (heap corruption) → dihapus total dari sitemap dan ditambahkan pre-build database file creation.
- Semua unit test lint & type‑check lolos setelah perbaikan.

## Keputusan Teknis

- **Single admin** – menyederhanakan otentikasi & ACL.
- **Reusable pagination hook** – menghindari copy‑paste, memperbaiki cascading render warnings.
- **storageService abstraction** – memastikan semua upload melalui satu layer, memungkinkan future swap ke cloud storage.
- **Next.js 16 proxy** – menggunakan `src/proxy.ts` alih‑alih `middleware.ts` untuk kompatibilitas versi.
- **Liquid Glass design** – dipilih untuk tampilan premium, glass‑morphism, micro‑animations.

## Alasan Keputusan

- Single admin karena scope proyek kecil & mengurangi kompleksitas keamanan.
- Reusable hook meningkatkan maintainability & mengurangi bug pagination.
- Abstraksi storage memudahkan migrasi ke S3 bila diperlukan.
- Proxy di `src/proxy.ts` diperlukan oleh perubahan API Next.js 16.
- Liquid Glass memberikan UI premium sesuai requirement estetika.

## File Terakhir Diubah

- `src/app/sitemap.ts`
- `package.json`
- `docs/05_PROJECT_STATUS.md`
- `docs/07_CHANGELOG.md`
- `docs/08_DECISIONS.md`
- `docs/09_BUGS.md`

## File Kemungkinan Selanjutnya Diubah

- Penyempurnaan UI & fungsi pada `src/components/admin/MapLocationsManager.tsx`
- Penambahan endpoint realtime untuk Maps (mungkin file socket handler atau API route).
- Dokumentasi & testing tambahan untuk Maps.

## Prioritas Pekerjaan Berikutnya

1. Selesaikan UI & fungsi **Maps** (marker realtime, popup detail, filter).
2. Buat checklist Final QA dan lakukan verifikasi semua fitur.
3. Dokumentasi deployment & backup prosedur.
4. Persiapan export PDF bila diperlukan pada sprint berikutnya.
