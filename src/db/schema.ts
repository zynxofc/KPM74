import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

// Users table — stores exactly ONE administrator credential.
// No role, no permission, no multi-user support.
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export type User = typeof users.$inferSelect;

// Activity Logs — immutable audit trail of all admin actions.
export const activityLogs = sqliteTable("activity_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action", {
    enum: ["LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE"],
  }).notNull(),
  entity: text("entity").notNull(),        // e.g. "MapLocation", "Settings", "Member", "Program", "Gallery", "Post", "Faq"
  entityId: text("entity_id"),             // null for LOGIN/LOGOUT
  description: text("description"),        // Human-readable summary
  ipAddress: text("ip_address"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;

// Settings table — holds global configuration & hero section data.
export const settings = sqliteTable("settings", {
  id: integer("id").primaryKey().default(1),
  siteName: text("site_name").notNull().default("LinTree KPM"),
  description: text("description").notNull().default("Portal digital resmi KPM"),
  socialInstagram: text("social_instagram").notNull().default(""),
  socialTiktok: text("social_tiktok").notNull().default(""),
  socialWhatsapp: text("social_whatsapp").notNull().default(""),
  socialMaps: text("social_maps").notNull().default(""),
  heroTitle: text("hero_title").notNull().default("Selamat Datang di Portal KPM"),
  heroSubtitle: text("hero_subtitle").notNull().default("Membangun Desa, Mencerdaskan Bangsa"),
  heroBgImage: text("hero_bg_image").notNull().default(""),
  allowPublicRegistrations: integer("allow_public_registrations", { mode: "boolean" }).notNull().default(false),
  maintenanceMode: integer("maintenance_mode", { mode: "boolean" }).notNull().default(false),
  updatedAt: text("updated_at").default(new Date().toISOString()),
});

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

// Members table — stores KPM group members
export const members = sqliteTable("members", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  nimNip: text("nim_nip").notNull(),
  role: text("role").notNull(), // Jabatan anggota kelompok
  photoUrl: text("photo_url").notNull().default(""),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export type Member = typeof members.$inferSelect;
export type NewMember = typeof members.$inferInsert;

// Programs table — stores KPM work programs
export const programs = sqliteTable("programs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status", { enum: ["rencana", "berjalan", "selesai"] }).notNull().default("rencana"),
  documentationUrl: text("documentation_url").notNull().default(""),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;

// Gallery table — KPM activity media (photos/videos)
export const gallery = sqliteTable("gallery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  type: text("type", { enum: ["image", "video"] }).notNull().default("image"),
  fileUrl: text("file_url").notNull(),
  caption: text("caption"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export type GalleryItem = typeof gallery.$inferSelect;
export type NewGalleryItem = typeof gallery.$inferInsert;

// Posts table — articles
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  category: text("category").notNull().default("umum"),
  thumbnailUrl: text("thumbnail_url").notNull().default(""),
  publishedAt: text("published_at").default(new Date().toISOString()),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

// FAQs table — frequently asked questions
export const faqs = sqliteTable("faqs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
});

export type Faq = typeof faqs.$inferSelect;
export type NewFaq = typeof faqs.$inferInsert;

export const mapLocations = sqliteTable("map_locations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  category: text("category", {
    enum: ["posko", "balai_desa", "sekolah", "umkm", "tempat_ibadah", "wisata"],
  }).notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  description: text("description"),
  googleMapsUrl: text("google_maps_url"),
  createdAt: text("created_at").default(new Date().toISOString()),
});

export type MapLocation = typeof mapLocations.$inferSelect;
export type NewMapLocation = typeof mapLocations.$inferInsert;
