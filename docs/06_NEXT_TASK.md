# 06 — Next Task

> Dokumen ini selalu hanya berisi satu atau beberapa task berikutnya yang akan dikerjakan.
>
> Saat task selesai, hapus dari sini dan pindahkan ke `07_CHANGELOG.md`. Tambahkan task baru di bawah.

---

## Task Aktif Saat Ini

Tidak ada task aktif. Project dalam status `PRODUCTION READY`.

---

## Antrian Task Berikutnya

### TASK-01 — Lighthouse Performance Audit

**Prioritas:** Medium
**Estimasi:** 1 sesi

**Deskripsi:**

Jalankan Lighthouse audit (Chrome DevTools / PageSpeed Insights) pada halaman publik utama:

- `/` (Beranda)
- `/berita`
- `/galeri`

**Target:**

| Metric | Target |
| --- | --- |
| Performance | ≥ 90 |
| Accessibility | ≥ 95 |
| Best Practices | ≥ 95 |
| SEO | ≥ 95 |

**Catatan:** Jangan ubah fitur. Hanya optimasi berdasarkan laporan Lighthouse.

---

### TASK-02 — Dark Mode Toggle

**Prioritas:** Low
**Estimasi:** 0.5 sesi

**Deskripsi:**

Tambahkan tombol toggle dark/light mode pada Navbar publik dan Admin Header.
CSS sudah siap (custom property `--background` dan `.dark`).
Hanya perlu implementasi komponen `ThemeToggle` yang sudah ada di `src/components/admin/ThemeToggle.tsx`.

**File yang mungkin berubah:**

- `src/components/ui/Navbar.tsx`
- `src/app/(public)/layout.tsx`

---

### TASK-03 — Maps Realtime Updates

**Prioritas:** Medium
**Estimasi:** 2 sesi

**Deskripsi:**

Implementasikan polling atau Server-Sent Events (SSE) untuk memperbarui marker peta secara otomatis tanpa reload halaman saat admin menambah/mengubah marker.

**Catatan:** Jangan ubah arsitektur database. Cukup gunakan polling `setInterval` pada komponen MapWrapper.

---

### TASK-04 — Deployment

**Prioritas:** High (saat siap)
**Estimasi:** 1 sesi

**Deskripsi:**

Deploy ke platform production (Vercel / Railway / VPS).

**Checklist pre-deploy:**

- [ ] Ganti `JWT_SECRET` dengan nilai kuat (`openssl rand -base64 32`)
- [ ] Set `NEXT_PUBLIC_BASE_URL` ke domain production
- [ ] Set `DATABASE_URL` ke production database
- [ ] Jalankan `npm run build` untuk verifikasi akhir
- [ ] Jalankan Lighthouse audit pasca-deploy

---

## Completed Tasks (dipindahkan ke CHANGELOG)

Lihat `docs/07_CHANGELOG.md` untuk history task yang telah selesai.
