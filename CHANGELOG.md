# Changelog

## 2026-07-02 (Release Preparation Sprint)

- Created `release_notes_v1_0.md` in artifacts directory — Release summaries, feature lists, running instructions, and known limitations.
- Updated root `README.md` to professional guidelines: added badges, screenshot placeholder, features, installation, deployment, and license.

## 2026-07-02 (Deployment Preparation Sprint)

- Created `docs/DEPLOYMENT.md` — Deployment guide for VPS/Cloud environments.
- Verified production configuration variables: JWT_SECRET, DATABASE_URL, STORAGE_PROVIDER.
- Provided folder permissions setups, automated backup script config, and rollback instructions.

## 2026-07-02 (Production Readiness Sprint)

- Created `src/app/manifest.ts` — Web App Manifest (PWA, theme_color #0F766E, short_name).
- Created `src/app/robots.ts` — crawling rules: allow all public routes, disallow /admin /api.
- Created `src/app/sitemap.ts` — static routes + dynamic /berita/[slug] from database.
- Created `src/app/not-found.tsx` — branded 404 page (Liquid Glass design system).
- Created `src/app/error.tsx` — global error boundary with reset + go-home actions.
- Created `src/app/loading.tsx` — branded spinner loading skeleton.
- Updated `src/app/layout.tsx` — added metadataBase, title template, openGraph, twitter card.
- Updated `src/app/(public)/page.tsx` — added full OG + Twitter metadata.
- Updated `src/app/(public)/faq/page.tsx` — added full OG + Twitter + canonical metadata.
- Updated `src/app/(public)/peta-lokasi/page.tsx` — added full OG + Twitter + canonical metadata.
- Added `loading="lazy" decoding="async"` to all dynamic `<img>` tags in public pages.
- Added `loading="eager"` to LCP cover images (news detail, gallery lightbox).
- Created `public/og-image.png` — branded Open Graph social share image.
- Created `.env.example` — deployment configuration template with all required variables.
- Build: ✅ 0 errors. Routes: manifest.webmanifest, robots.txt, sitemap.xml all verified.

- Implemented all 4 missing public pages (`/profil`, `/program-kerja`, `/galeri`, and `/berita` / `/berita/[slug]`) mapping fully to SQLite database settings, members, programs, gallery, and posts tables.
- Implemented client‑side category filtering, search, and dynamic Lightbox popup overlay for `/galeri` and `GalleryClient.tsx`.
- Integrated `useClientPagination` hook inside `/berita` list (6 posts per page) and `/galeri` grid (8 media items per page).
- Verified production build and ESLint runs, resolving escaping quotes issues in `profil/page.tsx`.
- Conducted Final Quality Assurance (QA) audit on all PRD requirements, system modules, responsive layouts, performance, and security.
- Documented findings in `final_qa_report.md` artifact, identifying missing public pages (`/profil`, `/program-kerja`, `/galeri`, `/berita`).
- Implemented and integrated reusable pagination (`useClientPagination`) in `GalleryManager.tsx` to resolve the pagination bug (BUG-02) for the Galeri module.
- Ran comprehensive QA checks, ESLint, and production build to guarantee Release Candidate health (0 errors).
- Created backup archive `backup_20260702_1901.zip` of full project.
- Added comprehensive PROJECT_CONTEXT.md in .ai memory.
- Updated SESSION.md with today’s work, priorities, and next steps.
- Updated TODO.md: marked FAQ & pagination bugs resolved, added Maps realtime and Export PDF tasks.
- Updated DECISIONS.md with backup decision.

## 2026-07-02 (previous)

- Menambahkan Login
- Menambahkan Dashboard
- Menambahkan JWT
