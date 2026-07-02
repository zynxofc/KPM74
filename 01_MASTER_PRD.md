# LinTree KPM — Master PRD

## 1. Vision

Membangun portal digital KPM yang berfungsi sebagai pusat informasi, dokumentasi, publikasi, dan branding kelompok KPM. Aplikasi **bukan clone Linktree**, tetapi dashboard modern dengan pengalaman pengguna premium.

## 2. Tujuan

- Menjadi landing page resmi KPM.
- Menampilkan seluruh informasi kelompok.
- Mudah dikelola tanpa mengubah kode.
- Siap dikembangkan bertahun-tahun.

## 3. Target Pengguna

- Pengunjung umum
- Dosen Pembimbing Lapangan
- Mahasiswa KPM
- Pemerintah Desa
- Calon Mitra

## 4. Fitur Utama

### Landing Page

- Hero fullscreen
- Background dapat diganti admin
- CTA Instagram, TikTok, WhatsApp, Maps

### Profil

- Tentang KPM
- Profil Desa
- Visi Misi
- Struktur Organisasi
- Anggota

### Program Kerja

- Timeline
- Status
- Dokumentasi

### Galeri

- Foto
- Video
- Filter
- Lightbox

### Berita

- Kategori
- Pencarian
- SEO

### Maps

Gunakan Leaflet + OpenStreetMap.
Jangan gunakan iframe sebagai solusi utama.

Fitur:

- Marker Posko
- Marker Balai Desa
- Marker Sekolah
- Marker UMKM
- Marker Tempat Ibadah
- Marker Wisata
- Popup Informasi
- Tombol Navigasi Google Maps

### Admin

CRUD:

- Hero
- Anggota
- Program
- Galeri
- Berita
- FAQ
- Marker Peta
- Pengaturan

### Non Functional

- Mobile First
- Responsive
- SEO Friendly
- Accessibility
- Dark Mode
- Performance >90 Lighthouse
- Production Ready

## 5. Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Leaflet
- Framer Motion
- SQLite (dev)
- MySQL/PostgreSQL (production)

## 6. Database Awal

users (hanya menyimpan 1 record kredensial untuk Single Administrator)
members
programs
gallery
posts
faq
settings
social_links
map_locations
activity_logs

## 7. Larangan

- Jangan membuat fitur di luar PRD.
- Jangan membuat API palsu.
- Jangan membuat placeholder berkepanjangan.

## 8. Authentication Policy

Portal LinTree KPM menggunakan sistem Single Administrator.

Project ini TIDAK menggunakan:

- Multi User
- Multi Admin
- Role
- Permission
- RBAC
- ACL
- Team Management
- User Management

Hanya terdapat SATU akun Administrator yang memiliki akses penuh terhadap seluruh fitur Dashboard. Tabel `users` hanya digunakan untuk menyimpan satu-satunya akun administrator tersebut secara terisolasi tanpa ada relasi role/permission atau manajemen pengguna lainnya.

Seluruh halaman Dashboard diasumsikan hanya diakses oleh Administrator tersebut.

Apabila di masa depan dibutuhkan multi-user, arsitektur boleh dikembangkan tanpa mengubah struktur Public Website.

## 9. Storage Policy

Seluruh pengerjaan unggah file/gambar wajib dialirkan melalui **Storage Abstraction Service** (`IStorageService`).

Sistem penyimpanan mendukung:

- **Local Storage**: Digunakan untuk lingkungan development dengan menyimpan berkas langsung ke sub-direktori `public/uploads/`.
- **Cloudinary**: Sebagai opsi penyimpanan cloud di masa depan.
- **AWS S3**: Sebagai opsi penyimpanan cloud di masa depan.

Dilarang memanggil pustaka/modul filesystem (`fs`) secara langsung dari halaman antarmuka (page) atau komponen business logic utama. Pergantian penyedia layanan penyimpanan wajib dilakukan hanya pada file konfigurasi Storage Service tanpa mengubah logika fungsionalitas CRUD.
