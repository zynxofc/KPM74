# 10 — Architecture

> Dokumen referensi arsitektur sistem **LinTree KPM**. Perbarui jika ada perubahan arsitektural.

---

## Overview

LinTree KPM adalah portal web monolitik berbasis **Next.js 16 App Router** yang menggunakan arsitektur **Server-First** — data di-fetch di Server Components, interaksi client-side dilakukan di Client Components.

Tidak ada REST API terpisah. Semua logika backend menggunakan **Next.js Server Actions** yang berjalan di server.

---

## Tech Stack

| Layer | Teknologi | Versi |
| --- | --- | --- |
| Framework | Next.js (App Router) | 16.2.9 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS v4 | 4.x |
| Animations | Framer Motion | 12.x |
| ORM | Drizzle ORM | 0.45.x |
| Database (dev) | SQLite via better-sqlite3 | 12.x |
| Validation | Zod | 4.x |
| Forms | React Hook Form | 7.x |
| Map | Leaflet + react-leaflet | 1.9.x / 5.x |
| Auth | jose (JWT) + bcryptjs | 6.x / 3.x |
| Icons | Lucide React | 1.x |

---

## Struktur Direktori

```
e:/PROJECT/Landing Page KPM/
├── docs/                          # ← Single Source of Truth dokumentasi
│   ├── 05_PROJECT_STATUS.md
│   ├── 06_NEXT_TASK.md
│   ├── 07_CHANGELOG.md
│   ├── 08_DECISIONS.md
│   ├── 09_BUGS.md
│   ├── 10_ARCHITECTURE.md         # ← ini
│   └── PRODUCTION_CHECKLIST.md
├── src/
│   ├── app/
│   │   ├── (admin)/               # Route group: Admin Panel
│   │   │   └── admin/
│   │   │       ├── page.tsx           # Dashboard
│   │   │       ├── anggota/
│   │   │       ├── berita/
│   │   │       ├── faq/
│   │   │       ├── galeri/
│   │   │       ├── pengaturan/
│   │   │       ├── peta-lokasi/
│   │   │       ├── program-kerja/
│   │   │       └── activity-log/
│   │   ├── (public)/              # Route group: Public Website
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── LandingPageClient.tsx  # Client component hero
│   │   │   ├── profil/
│   │   │   ├── program-kerja/
│   │   │   ├── galeri/
│   │   │   │   ├── page.tsx
│   │   │   │   └── GalleryClient.tsx  # Client: filter + lightbox
│   │   │   ├── berita/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── NewsListClient.tsx # Client: search + pagination
│   │   │   │   └── [slug]/page.tsx    # Dynamic route detail berita
│   │   │   ├── peta-lokasi/
│   │   │   └── faq/
│   │   │       └── FaqListClient.tsx  # Client: accordion
│   │   ├── layout.tsx             # Root layout (fonts, global meta)
│   │   ├── manifest.ts            # Web App Manifest
│   │   ├── robots.ts              # robots.txt
│   │   ├── sitemap.ts             # sitemap.xml (static + dynamic)
│   │   ├── not-found.tsx          # Custom 404 page
│   │   ├── error.tsx              # Global error boundary
│   │   ├── loading.tsx            # Global loading spinner
│   │   ├── globals.css            # Tailwind + design tokens
│   │   └── favicon.ico
│   ├── components/
│   │   ├── admin/                 # Admin manager components
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── MembersManager.tsx
│   │   │   ├── ProgramsManager.tsx
│   │   │   ├── GalleryManager.tsx
│   │   │   ├── NewsManager.tsx
│   │   │   ├── FaqsManager.tsx
│   │   │   ├── MapLocationsManager.tsx
│   │   │   ├── SettingsForm.tsx
│   │   │   ├── Sidebar.tsx / Header.tsx / Breadcrumb.tsx
│   │   │   └── ...
│   │   ├── form/                  # Reusable form inputs
│   │   │   ├── Input.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Toggle.tsx
│   │   │   ├── ImagePicker.tsx
│   │   │   └── ...
│   │   ├── ui/                    # Shared UI components
│   │   │   ├── GlassCard.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Navbar.tsx / Footer.tsx
│   │   │   ├── Modal.tsx / Drawer.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── MapWrapper.tsx     # Leaflet wrapper (dynamic import)
│   │   │   └── ...
│   │   └── icons/
│   ├── db/
│   │   ├── index.ts               # Drizzle client singleton
│   │   ├── schema.ts              # All table definitions + types
│   │   └── seed.ts                # Database seeder
│   ├── hooks/
│   │   └── useClientPagination.ts # Reusable pagination hook
│   ├── lib/
│   │   ├── admin/
│   │   │   └── actions.ts         # ALL server actions (CRUD)
│   │   ├── auth/
│   │   │   └── (jwt, cookie utilities)
│   │   ├── storage/
│   │   │   ├── index.ts           # IStorageService interface
│   │   │   └── local.ts           # LocalStorageAdapter
│   │   ├── config.ts              # Navigation config
│   │   ├── utils.ts               # cn() utility
│   │   └── validations.ts         # Zod schemas
│   └── proxy.ts                   # Route protection (replaces middleware)
├── public/
│   ├── uploads/                   # File upload destination (local dev)
│   └── og-image.png               # Open Graph image
├── scripts/
│   └── create-activity-logs.js    # DB migration script
├── 01_MASTER_PRD.md
├── 02_DESIGN_SYSTEM.md
├── 03_DEVELOPMENT_RULES.md
├── 04_TASK_BREAKDOWN.md
├── 05_VISUAL_STYLE_LIQUID_GLASS.md
├── AGENTS.md
├── .env.local
├── .env.example
└── package.json
```

---

## Data Flow

### Public Page Request

```
Browser GET /berita
  → Next.js Server Component (page.tsx)
  → Drizzle ORM query (db.select().from(posts))
  → SQLite dev.db
  → Return HTML dengan data
  → Client hydration (NewsListClient.tsx)
  → User interaction: search, filter, pagination (client-side state)
```

### Admin CRUD

```
Admin submit form
  → Client Component (e.g., NewsManager.tsx)
  → Server Action (src/lib/admin/actions.ts)
  → Zod validation
  → Storage Service (jika ada file: storageService.save())
  → Drizzle ORM write
  → revalidatePath() untuk invalidate cache
  → Return { success, error }
  → Toast notification di client
```

### Authentication Flow

```
POST /login
  → Server Action (loginAction)
  → bcryptjs.compare(password, hash)
  → jose.SignJWT → JWT token
  → Set HttpOnly cookie "auth_token"
  → redirect("/admin")

GET /admin/*
  → src/proxy.ts intercepts
  → Read "auth_token" cookie
  → jose.jwtVerify
  → If invalid → redirect("/login")
```

---

## Database Schema (ringkasan)

```
users          → id, username, passwordHash
activity_logs  → id, action, entity, entityId, description, ipAddress, createdAt
settings       → id, siteName, description, social*, hero*, maintenanceMode
members        → id, name, nimNip, role, photoUrl
programs       → id, name, description, startDate, endDate, status, documentationUrl
gallery        → id, title, type (image|video), fileUrl, caption
posts          → id, title, slug (unique), content, category, thumbnailUrl, publishedAt
faqs           → id, question, answer
map_locations  → id, name, category, latitude, longitude, description, googleMapsUrl
```

---

## Security Architecture

| Lapisan | Implementasi |
| --- | --- |
| Route Protection | `src/proxy.ts` — intercept semua `/admin/*` |
| Authentication | JWT (jose) + HttpOnly Cookie |
| Password Hashing | bcryptjs |
| Input Validation | Zod schema di setiap server action |
| File Upload | Storage Service — validasi tipe + ukuran |
| XSS | React otomatis escape, `dangerouslySetInnerHTML` hanya di news content |

---

## Naming Conventions

| Tipe | Konvensi | Contoh |
| --- | --- | --- |
| File Component | PascalCase | `GlassCard.tsx` |
| File Page | lowercase | `page.tsx` |
| File Hook | camelCase | `useClientPagination.ts` |
| DB Table | snake_case | `map_locations` |
| DB Column | snake_case | `site_name` |
| TypeScript Type | PascalCase | `GalleryItem`, `Post` |
| CSS Class | kebab-case | `glass-card` |
| Route | kebab-case | `/program-kerja` |

---

## Constraints & Rules

1. **Jangan import `fs` langsung** di komponen atau page — gunakan `storageService`.
2. **Jangan buat API route** (`src/app/api/`) kecuali ada kebutuhan khusus — gunakan Server Actions.
3. **Semua upload** harus melalui `src/lib/storage/index.ts`.
4. **Semua CRUD** harus melalui `src/lib/admin/actions.ts`.
5. **Pagination** harus menggunakan `useClientPagination` hook.
6. **Leaflet** harus dimuat dengan `next/dynamic` + `{ ssr: false }`.
7. **`<img>` dinamis** harus memiliki `loading="lazy"` atau `loading="eager"` (LCP images).
8. **Jangan ubah schema database** tanpa membuat migration script.
