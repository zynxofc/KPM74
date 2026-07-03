# Changelog

## 2026-07-03 (Vercel Preview Mode Integration)

- Centralized Preview Mode helpers under the new `src/lib/preview/` module containing `isPreviewMode()`, `getPreviewData()`, `getPreviewPostBySlug()`, and `preview-data.ts`.
- Configured database client in `src/db/index.ts` to skip SQLite loading and initialize `db` to `{}` when `PREVIEW_MODE=true` is set.
- Connected all 8 public routes (`/`, `/profil`, `/program-kerja`, `/galeri`, `/berita`, `/berita/[slug]`, `/faq`, `/peta-lokasi`) to dynamically load from static preview data helper instead of the database.
- Added a "Preview Deployment - Database dinonaktifkan" banner to the admin panel header.
- Updated authentication logic in `src/lib/auth/actions.ts` to validate logins against environment variables `ADMIN_USERNAME` and `ADMIN_PASSWORD` in Preview Mode.
- Guarded all 19 database-modifying Server Actions in `src/lib/admin/actions.ts` to reject operations with a friendly warning.
- Updated the health check tool `src/lib/admin/health.ts` to early-return a mock "Preview Mode" status.
- Verified build compiles successfully with 0 linting or TypeScript errors.

## 2026-07-03 (Sitemap SQLite Dependency Removal)

- Completely removed database imports (`db` from `@/db` and `posts` from `@/db/schema`) from `src/app/sitemap.ts` to prevent build-time SQLite initialization.
- Retained sitemap static routes and added environment-based fallback domain.
- Modified `package.json` build command to automatically create an empty `dev.db` file if absent, preventing Next.js concurrent worker thread race condition/heap corruption failures.
- Verified build and lint checks pass 100% in database-less environment.

## 2026-07-02 (Sitemap Build Fix Sprint - Initial)

- Wrapped sitemap database query (`posts`) in `src/app/sitemap.ts` in `try...catch` block to fallback to static routes when tables are not yet generated.
- Verified build and TypeScript strict check pass.

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
