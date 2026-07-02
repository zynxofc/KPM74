# Development Rules — LinTree KPM

---

## Wajib

- TypeScript strict — tidak ada `any` tanpa alasan kuat.
- Reusable components — jangan copy-paste komponen.
- Mobile-first — selalu desain untuk layar kecil dulu.
- Validasi semua input menggunakan Zod.
- Struktur folder konsisten (lihat `docs/10_ARCHITECTURE.md`).
- Penamaan jelas sesuai konvensi (lihat `docs/10_ARCHITECTURE.md`).
- Semua upload file melalui `storageService` (`src/lib/storage/`).
- Semua CRUD melalui Server Actions (`src/lib/admin/actions.ts`).
- Semua pagination client-side menggunakan `useClientPagination`.

---

## Dilarang

- `any` tanpa komentar penjelasan.
- TODO permanen di kode production.
- `console.log` di kode production (kecuali `error.tsx`).
- Duplicate code atau copy-paste logika.
- Hardcode konfigurasi (URL, secret, credential).
- Import `fs` langsung di luar modul `src/lib/storage/`.
- Membuat API route (`/api/`) tanpa kebutuhan yang jelas.
- Mengubah schema database tanpa migration script.
- Membuat fitur di luar scope PRD tanpa persetujuan eksplisit.

---

## AI Rules

Sebelum menulis kode:

1. Baca dokumentasi (lihat `AGENTS.md` Step 1–3).
2. Analisis source code yang relevan.
3. Buat rencana implementasi.
4. Implementasi.
5. Verifikasi (lint, build, typecheck).
6. Perbarui dokumentasi.

Jika requirement tidak jelas, **berhenti dan minta klarifikasi**.

Jangan berasumsi.

---

## Project Sync Procedure

Lakukan **Project Sync** sebelum memulai task baru atau saat melanjutkan setelah jeda:

### 1. Baca Dokumentasi Terkini

```text
docs/05_PROJECT_STATUS.md
docs/06_NEXT_TASK.md
docs/08_DECISIONS.md
docs/09_BUGS.md
docs/10_ARCHITECTURE.md
```

### 2. Verifikasi Konsistensi

Bandingkan dokumentasi dengan kode aktual:

- Apakah semua fitur yang tercatat sebagai "selesai" benar-benar ada di kode?
- Apakah ada perubahan kode yang belum tercatat di changelog?
- Apakah ada bug baru yang belum tercatat?

### 3. Update Inkonsistensi

Jika ditemukan inkonsistensi:

- Perbarui `docs/05_PROJECT_STATUS.md` sesuai kondisi aktual.
- Catat bug baru di `docs/09_BUGS.md`.
- Perbarui `docs/07_CHANGELOG.md` jika ada perubahan yang belum tercatat.

### 4. Lanjutkan Task

Setelah dokumentasi sinkron, baru lanjutkan implementasi.

---

## Definition of Done

Sebuah task selesai hanya jika:

- [ ] `npm run lint` → 0 errors
- [ ] `npm run build` → 0 errors
- [ ] TypeScript strict → 0 errors
- [ ] Semua halaman yang berubah responsive
- [ ] Tidak ada placeholder atau TODO permanen
- [ ] Data berasal dari database (tidak hardcode)
- [ ] Semua file dokumentasi diperbarui
