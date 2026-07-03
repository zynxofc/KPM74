# 05 — Project Status

> **Single Source of Truth** — dokumen ini adalah referensi utama status project.
>
> Perbarui setiap kali ada perubahan besar pada status atau selesai sprint.

---

## Status Saat Ini

**PRODUCTION READY** — per 2026-07-02

Semua fitur utama selesai, build dan lint bersih, halaman publik dan admin lengkap.

---

## Versi

| Item | Nilai |
| --- | --- |
| App Name | LinTree KPM |
| Next.js | 16.2.9 |
| Node | 20+ |
| Database | SQLite (dev) via Drizzle ORM |
| Status Build | ✅ Clean (0 errors) |
| Status Lint | ✅ Clean (0 errors) |
| Status TypeScript | ✅ Clean (0 errors) |

---

## Fitur Selesai

### Public Website

| Halaman | Route | Status |
| --- | --- | --- |
| Landing Page | `/` | ✅ Selesai |
| Profil & Anggota | `/profil` | ✅ Selesai |
| Program Kerja | `/program-kerja` | ✅ Selesai |
| Galeri + Lightbox | `/galeri` | ✅ Selesai |
| Berita List | `/berita` | ✅ Selesai |
| Detail Berita | `/berita/[slug]` | ✅ Selesai |
| Peta Interaktif | `/peta-lokasi` | ✅ Selesai |
| FAQ Accordion | `/faq` | ✅ Selesai |

### Admin Panel

| Modul | Route | Status |
| --- | --- | --- |
| Login | `/login` | ✅ Selesai |
| Dashboard | `/admin` | ✅ Selesai |
| Kelola Hero/Settings | `/admin/pengaturan` | ✅ Selesai |
| Kelola Anggota | `/admin/anggota` | ✅ Selesai |
| Kelola Program | `/admin/program-kerja` | ✅ Selesai |
| Kelola Galeri | `/admin/galeri` | ✅ Selesai |
| Kelola Berita | `/admin/berita` | ✅ Selesai |
| Kelola Peta | `/admin/peta-lokasi` | ✅ Selesai |
| Kelola FAQ | `/admin/faq` | ✅ Selesai |
| Activity Log | `/admin/activity-log` | ✅ Selesai |

### System & Infrastructure

| Item | Status |
| --- | --- |
| JWT Authentication | ✅ Selesai |
| Route Protection (Proxy) | ✅ Selesai |
| Storage Service Abstraction | ✅ Selesai |
| Reusable Pagination Hook | ✅ Selesai |
| OG / Twitter Metadata | ✅ Selesai |
| Sitemap + robots.txt | ✅ Selesai |
| Web Manifest (PWA) | ✅ Selesai |
| 404 / Error / Loading Pages | ✅ Selesai |
| Image Lazy Loading | ✅ Selesai |

---

## Fitur Belum Selesai / Future Scope

| Fitur | Prioritas | Catatan |
| --- | --- | --- |
| Export PDF Laporan | Low | Belum ada permintaan eksplisit |
| Maps Realtime Updates | Medium | Polling/WebSocket belum diimplementasikan |
| Dark Mode Toggle | Low | CSS sudah siap, toggle UI belum dibuat |
| Lighthouse Audit | Medium | Perlu dijalankan sebelum deploy ke production |

---

## Sprint History

| Sprint | Tanggal | Output |
| --- | --- | --- |
| Phase 1–4 | 2026-07-01 | Setup, Landing Page, Admin Panel, Maps |
| Bug Fix Sprint | 2026-07-02 | FAQ module, Pagination hook |
| Public Website Sprint | 2026-07-02 | 5 halaman publik baru |
| Production Readiness Sprint | 2026-07-02 | manifest, robots, sitemap, OG, error pages |
| Documentation Sprint | 2026-07-02 | Migrasi ke Documentation Driven Development |
| Sitemap Build Fix Sprint | 2026-07-03 | Menghapus dependensi SQLite dari sitemap dan mempre-kreasi dev.db saat build demi perbaikan deployment Vercel |
| Vercel Preview Mode Sprint | 2026-07-03 | Menambahkan Preview Mode terpusat berbasis env PREVIEW_MODE=true untuk deployment demo tanpa SQLite |
