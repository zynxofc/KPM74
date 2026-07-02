# Panduan Deployment — LinTree KPM

Dokumen ini menjelaskan langkah-langkah, kebutuhan sistem, konfigurasi, dan prosedur rollback untuk menyebarkan aplikasi **LinTree KPM** ke lingkungan production.

---

## Kebutuhan Server

### Perangkat Keras (Minimal)

- **CPU:** 1 vCPU
- **RAM:** 1 GB RAM (2 GB direkomendasikan untuk kelancaran proses `next build`)
- **Penyimpanan:** HDD/SSD 10 GB (untuk kode program, pustaka node, log, dan file upload lokal)

### Perangkat Lunak

- **Sistem Operasi:** Linux (Ubuntu 20.04 LTS atau lebih baru direkomendasikan), macOS, atau Windows Server
- **Node.js:** Versi 20.x atau 22.x (LTS)
- **Package Manager:** npm (bawaan Node.js)
- **Process Manager:** PM2 (untuk server mandiri/VPS) atau runtime platform serverless (Vercel, Railway)

---

## Environment Variables

Salin file `.env.example` menjadi `.env.local` di server production dan isi nilai-nilainya:

| Variabel | Deskripsi | Rekomendasi Production |
| --- | --- | --- |
| `DATABASE_URL` | Path ke berkas database SQLite | `file:./data/prod.db` (letakkan di luar folder build agar aman) |
| `JWT_SECRET` | Kunci enkripsi sesi JWT admin | Jalankan perintah `openssl rand -base64 32` di server untuk membuatnya |
| `ADMIN_USERNAME` | Username administrator default | Ubah ke username yang aman (hanya dibaca saat seed pertama) |
| `ADMIN_PASSWORD` | Password administrator default | Ubah ke password yang panjang & unik (hanya dibaca saat seed) |
| `STORAGE_PROVIDER` | Driver penyimpanan berkas | `local` (untuk VPS) atau s3/cloudinary jika didefinisikan adapter barunya |
| `NEXT_PUBLIC_BASE_URL` | Domain publik website | Contoh: `https://lintreekpm.com` |

---

## Hak Akses Folder (Folder Permission)

Jika dideploy di VPS Linux (Self-hosted), pastikan permission folder diatur agar proses Node.js dapat menulis berkas database dan menerima file upload:

```bash
# Pastikan proses node berjalan di bawah user non-root (misal: node)
# Buat folder khusus penyimpanan data persisten
mkdir -p /var/www/lintree/data
mkdir -p /var/www/lintree/public/uploads

# Ubah kepemilikan folder ke user yang menjalankan aplikasi
chown -R node:node /var/www/lintree/data
chown -R node:node /var/www/lintree/public/uploads

# Set permission agar user bisa menulis/membaca berkas
chmod -R 775 /var/www/lintree/data
chmod -R 775 /var/www/lintree/public/uploads
```

---

## Langkah-langkah Deployment

### Opsi A — VPS Linux / VM (Self-Hosted)

#### 1. Persiapan Kode & Environment

Kloning repositori ke server, buat direktori data persisten, dan konfigurasi environment:

```bash
git clone <repository_url> /var/www/lintree
cd /var/www/lintree
cp .env.example .env.local
nano .env.local  # Isi seluruh konfigurasi penting (terutama JWT_SECRET)
```

#### 2. Install Dependency & Build

Jalankan instalasi bersih dan kompilasi Next.js:

```bash
npm ci  # Clean install dependencies berdasarkan package-lock.json
npm run build
```

#### 3. Inisialisasi Database

Jalankan migrasi schema dan seeding akun admin utama:

```bash
# Salin skrip inisialisasi tabel (jika db belum ada)
npm run db:push

# Jalankan seeder admin utama
npm run db:seed
```

#### 4. Jalankan Aplikasi dengan PM2

Gunakan PM2 untuk menjaga aplikasi tetap berjalan di background dan otomatis restart bila crash:

```bash
# Daftarkan proses Next.js ke PM2
pm2 start npm --name "lintree-kpm" -- start

# Simpan konfigurasi PM2 agar otomatis jalan saat server reboot
pm2 save
pm2 startup
```

---

### Opsi B — Platform Cloud (Vercel / Railway / Render)

Aplikasi **LinTree KPM** siap dideploy di platform serverless/cloud.

#### 1. Hubungkan Repositori

Hubungkan repositori GitHub ke akun Vercel atau Railway Anda.

#### 2. Konfigurasi Environment Variables

Tambahkan variabel berikut pada panel konfigurasi dashboard cloud (bukan di berkas `.env`):

- `DATABASE_URL`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `STORAGE_PROVIDER` (set ke `local` untukRailway dengan persistent volume, atau siapkan adapter cloud)
- `NEXT_PUBLIC_BASE_URL`

#### 3. Build & Start Commands

Platform akan mendeteksi project Next.js dan menjalankan perintah bawaan secara otomatis:

- **Build Command:** `npm run build`
- **Start Command:** `npm run start`

---

## Prosedur Rollback

Jika ditemukan bug kritis di production setelah rilis baru, lakukan rollback secepatnya:

### VPS / VM

```bash
# 1. Masuk ke direktori aplikasi
cd /var/www/lintree

# 2. Kembalikan ke commit/tag versi sebelumnya di Git
git checkout tags/v1.0.0  # Ganti dengan tag versi stabil sebelumnya

# 3. Instal dependency dan build ulang
npm ci
npm run build

# 4. Restart aplikasi via PM2
pm2 restart lintree-kpm
```

### Vercel / Railway

1. Buka dashboard platform cloud.
2. Cari rilis/deployment yang sukses sebelum rilis saat ini.
3. Klik tombol **Rollback** atau **Redeploy** pada rilis tersebut untuk langsung mengaktifkannya sebagai rilis aktif.

---

## Strategi Backup Data

SQLite dan file upload lokal (`public/uploads/`) disimpan secara lokal di filesystem. Sangat penting untuk mencadangkan data ini secara rutin.

### Skrip Backup Otomatis (Cron Job)

Buat shell script sederhana di server VPS untuk mencadangkan database dan file upload setiap hari pukul 02.00 dini hari:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/lintree"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
mkdir -p "$BACKUP_DIR"

# Backup database SQLite
cp /var/www/lintree/data/prod.db "$BACKUP_DIR/db_$TIMESTAMP.db"

# Backup file upload
tar -czf "$BACKUP_DIR/uploads_$TIMESTAMP.tar.gz" -C /var/www/lintree/public uploads

# Hapus backup yang lebih tua dari 30 hari
find "$BACKUP_DIR" -type f -mtime +30 -delete
```

Daftarkan skrip tersebut di cron job Linux (`crontab -e`):

```text
0 2 * * * /bin/bash /var/www/lintree/scripts/backup.sh
```
