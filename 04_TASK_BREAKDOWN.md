# Task Breakdown — LinTree KPM

> Status per: **2026-07-02**
>
> Untuk task berikutnya, lihat `docs/06_NEXT_TASK.md`.

---

## Phase 1 — Setup & Foundation ✅ SELESAI

- [x] Inisialisasi project Next.js 16 dengan TypeScript
- [x] Design System (Liquid Glass, tokens, globals.css)
- [x] Layout (Navbar, Footer, public layout)
- [x] Landing Page (Hero, CTA, animasi)

## Phase 2 — Core Public Pages ✅ SELESAI

- [x] Profil & Anggota (`/profil`)
- [x] Program Kerja (`/program-kerja`)
- [x] Galeri + Lightbox (`/galeri`)
- [x] Berita List + Detail (`/berita`, `/berita/[slug]`)
- [x] Peta Interaktif Leaflet (`/peta-lokasi`)
- [x] FAQ Accordion (`/faq`)

## Phase 3 — Admin Panel ✅ SELESAI

- [x] Login (Single Admin, JWT)
- [x] Route Protection (`src/proxy.ts`)
- [x] Dashboard
- [x] CRUD Anggota
- [x] CRUD Program Kerja
- [x] CRUD Galeri (foto + video)
- [x] CRUD Berita (slug, kategori, thumbnail)
- [x] CRUD FAQ
- [x] CRUD Marker Peta
- [x] CRUD Pengaturan (Hero, social links)
- [x] Activity Log (audit trail)

## Phase 4 — System & Infrastructure ✅ SELESAI

- [x] Storage Service abstraction
- [x] Zod validation untuk semua form
- [x] Reusable pagination hook (`useClientPagination`)
- [x] DataTable komponen reusable
- [x] Toast notification system
- [x] Modal & Drawer komponen

## Phase 5 — Production Readiness ✅ SELESAI

- [x] Web App Manifest (`/manifest.webmanifest`)
- [x] robots.txt (`/robots.txt`)
- [x] Sitemap + dynamic news URLs (`/sitemap.xml`)
- [x] Open Graph metadata (semua halaman)
- [x] Twitter Card metadata (semua halaman)
- [x] OG Image (`/og-image.png`)
- [x] 404 Not Found page (bermerek)
- [x] Error Boundary (`error.tsx`)
- [x] Loading Spinner (`loading.tsx`)
- [x] Image lazy loading (semua `<img>` publik)
- [x] `.env.example` template

## Phase 6 — Documentation ✅ SELESAI (sprint ini)

- [x] `docs/05_PROJECT_STATUS.md`
- [x] `docs/06_NEXT_TASK.md`
- [x] `docs/07_CHANGELOG.md`
- [x] `docs/08_DECISIONS.md`
- [x] `docs/09_BUGS.md`
- [x] `docs/10_ARCHITECTURE.md`
- [x] `docs/PRODUCTION_CHECKLIST.md`
- [x] Update `AGENTS.md` (workflow baru)
- [x] Update `03_DEVELOPMENT_RULES.md`
- [x] Update `04_TASK_BREAKDOWN.md` (ini)
- [x] Update `README.md`

---

## Future Scope (Belum Dikerjakan)

| Task | Prioritas | Sprint |
| --- | --- | --- |
| Lighthouse Performance Audit | Medium | Segera |
| Dark Mode Toggle (UI) | Low | Optional |
| Maps Realtime Updates | Medium | Optional |
| Export PDF Laporan | Low | Future |
| Deployment ke Production | High | Segera |

---

## Definition of Done (per task)

- [ ] `npm run lint` → 0 errors
- [ ] `npm run build` → 0 errors
- [ ] TypeScript strict → 0 errors
- [ ] Responsive semua breakpoint
- [ ] Tidak ada placeholder
- [ ] Data dari database
- [ ] Dokumentasi diperbarui
