# 09 — Bug Register

> Semua bug yang ditemukan dicatat di sini beserta statusnya.
>
> Format: `## [ID] — [Deskripsi Singkat]`

---

## Bug Aktif

Tidak ada bug aktif yang diketahui. Status: **PROJECT READY FOR PRODUCTION**.

---

## Bug Selesai

### BUG-01 — FAQ Module Belum Lengkap

**Ditemukan:** 2026-07-02
**Diselesaikan:** 2026-07-02
**Severity:** High

**Deskripsi:**

Modul FAQ tidak memiliki tabel database, server actions, halaman admin, maupun halaman publik. Menu FAQ di navbar mengarah ke 404.

**Root Cause:**

Sprint awal tidak mengimplementasikan FAQ karena fokus pada halaman utama.

**Solusi:**

- Dibuat tabel `faqs` di `src/db/schema.ts`.
- Dibuat CRUD actions di `src/lib/admin/actions.ts`.
- Dibuat `FaqsManager.tsx` untuk admin panel.
- Dibuat `/admin/faq/page.tsx` untuk halaman admin.
- Dibuat `FaqListClient.tsx` dan `/faq/page.tsx` untuk halaman publik.

**File yang berubah:**

- `src/db/schema.ts`
- `src/lib/admin/actions.ts`
- `src/components/admin/FaqsManager.tsx`
- `src/app/(admin)/admin/faq/page.tsx`
- `src/app/(public)/faq/page.tsx`
- `src/app/(public)/faq/FaqListClient.tsx`

---

### BUG-02 — Pagination Tidak Reusable

**Ditemukan:** 2026-07-02
**Diselesaikan:** 2026-07-02
**Severity:** Medium

**Deskripsi:**

Setiap komponen admin memiliki implementasi pagination tersendiri yang saling tidak konsisten, menyebabkan peringatan React tentang setState di render phase dan duplikasi kode.

**Root Cause:**

Tidak ada abstraksi pagination sejak awal. Setiap developer mengimplementasikan sendiri.

**Solusi:**

Dibuat hook reusable `useClientPagination` di `src/hooks/useClientPagination.ts` yang menangani:

- Reset halaman otomatis saat data berubah (dilakukan di render phase dengan ref tracking).
- Kalkulasi `totalPages` dan `paginatedItems`.
- Callback `onPageChange`.

**File yang berubah:**

- `src/hooks/useClientPagination.ts` (baru)
- `src/components/admin/GalleryManager.tsx`
- `src/components/admin/MembersManager.tsx`
- `src/components/admin/NewsManager.tsx`
- `src/components/admin/ProgramsManager.tsx`
- `src/app/(public)/berita/NewsListClient.tsx`

---

### BUG-03 — Halaman Publik 404 (Profil, Program Kerja, Galeri, Berita)

**Ditemukan:** 2026-07-02
**Diselesaikan:** 2026-07-02
**Severity:** Critical

**Deskripsi:**

Tautan navigasi utama untuk `/profil`, `/program-kerja`, `/galeri`, dan `/berita` semua menghasilkan 404 karena file `page.tsx` belum dibuat di `src/app/(public)/`.

**Root Cause:**

Sprint awal berfokus pada admin panel dan infrastruktur. Halaman publik belum diimplementasikan.

**Solusi:**

Dibuat seluruh halaman publik yang hilang (lihat Public Website Integration Sprint di changelog).

---

### BUG-04 — Unescaped Quotes di profil/page.tsx

**Ditemukan:** 2026-07-02
**Diselesaikan:** 2026-07-02
**Severity:** Low

**Deskripsi:**

ESLint error `react/no-unescaped-entities` pada teks sambutan yang menggunakan tanda kutip ganda (`"`) langsung dalam JSX.

**Solusi:**

Bungkus string dalam expression `{"..."}` untuk menghindari JSX entity parsing.

---

## Known Limitations (Bukan Bug)

| Item | Catatan |
| --- | --- |
| Dark Mode Toggle | CSS sudah siap, UI toggle belum dibuat |
| Maps Realtime | Marker tidak update real-time tanpa reload |
| Export PDF | Fitur belum diimplementasikan |
| Image WebP Optimization | Menggunakan `<img>` native, bukan `next/image` |
