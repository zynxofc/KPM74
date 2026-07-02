// @ts-check
/* eslint-disable @typescript-eslint/no-require-imports */
const Database = require('better-sqlite3');

const db = new Database('dev.db');

// Create activity_logs
db.exec(`
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL CHECK(action IN ('LOGIN','LOGOUT','CREATE','UPDATE','DELETE')),
    entity TEXT NOT NULL,
    entity_id TEXT,
    description TEXT,
    ip_address TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
console.log('activity_logs table verified successfully');

// Create settings
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    site_name TEXT NOT NULL DEFAULT 'LinTree KPM',
    description TEXT NOT NULL DEFAULT 'Portal digital resmi KPM',
    social_instagram TEXT NOT NULL DEFAULT '',
    social_tiktok TEXT NOT NULL DEFAULT '',
    social_whatsapp TEXT NOT NULL DEFAULT '',
    social_maps TEXT NOT NULL DEFAULT '',
    hero_title TEXT NOT NULL DEFAULT 'Selamat Datang di Portal KPM',
    hero_subtitle TEXT NOT NULL DEFAULT 'Membangun Desa, Mencerdaskan Bangsa',
    hero_bg_image TEXT NOT NULL DEFAULT '',
    allow_public_registrations INTEGER NOT NULL DEFAULT 0,
    maintenance_mode INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);
console.log('settings table verified successfully');

// Create members
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    nim_nip TEXT NOT NULL,
    role TEXT NOT NULL,
    photo_url TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
console.log('members table verified successfully');

// Create programs
db.exec(`
  CREATE TABLE IF NOT EXISTS programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'rencana' CHECK(status IN ('rencana', 'berjalan', 'selesai')),
    documentation_url TEXT NOT NULL DEFAULT '',
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
console.log('programs table verified successfully');

// Create gallery
db.exec(`
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'image' CHECK(type IN ('image', 'video')),
    file_url TEXT NOT NULL,
    caption TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
console.log('gallery table verified successfully');

// Create posts
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'umum',
    thumbnail_url TEXT NOT NULL DEFAULT '',
    published_at TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
console.log('posts table verified successfully');

// Create faqs
db.exec(`
  CREATE TABLE IF NOT EXISTS faqs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);
console.log('faqs table verified successfully');

// Seed default settings row if not exists
const row = db.prepare('SELECT id FROM settings WHERE id = 1').get();
if (!row) {
  db.prepare(`
    INSERT INTO settings (id, site_name, description, hero_title, hero_subtitle, hero_bg_image)
    VALUES (1, 'LinTree KPM', 'Portal digital resmi Kuliah Pengabdian Masyarakat', 'Selamat Datang di Portal KPM', 'Membangun Desa, Mencerdaskan Bangsa', '')
  `).run();
  console.log('seeded default settings row');
}

db.close();
