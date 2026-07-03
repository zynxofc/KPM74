import type { Setting, Member, Program, GalleryItem, Post, Faq, MapLocation } from "@/db/schema";
import {
  PREVIEW_SETTINGS,
  PREVIEW_MEMBERS,
  PREVIEW_PROGRAMS,
  PREVIEW_GALLERY,
  PREVIEW_POSTS,
  PREVIEW_FAQS,
  PREVIEW_LOCATIONS
} from "./preview-data";

export function isPreviewMode(): boolean {
  return process.env["PREVIEW_MODE"] === "true" || process.env["VERCEL"] === "1";
}

// ----------------------------------------------------
// Data Fetching Services (Decoupled dynamically from DB at runtime)
// ----------------------------------------------------

export async function getSiteSettings(): Promise<Setting | null> {
  if (isPreviewMode()) {
    return PREVIEW_SETTINGS;
  }
  const { db } = await import("@/db");
  const { settings } = await import("@/db/schema");
  const { eq } = await import("drizzle-orm");
  const [dbSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  return dbSettings || null;
}

export async function getMembersList(): Promise<Member[]> {
  if (isPreviewMode()) {
    return PREVIEW_MEMBERS;
  }
  const { db } = await import("@/db");
  const { members } = await import("@/db/schema");
  return db.select().from(members);
}

export async function getProgramsList(): Promise<Program[]> {
  if (isPreviewMode()) {
    return PREVIEW_PROGRAMS;
  }
  const { db } = await import("@/db");
  const { programs } = await import("@/db/schema");
  return db.select().from(programs);
}

export async function getGalleryItemsList(): Promise<GalleryItem[]> {
  if (isPreviewMode()) {
    return PREVIEW_GALLERY;
  }
  const { db } = await import("@/db");
  const { gallery } = await import("@/db/schema");
  return db.select().from(gallery);
}

export async function getNewsPostsList(): Promise<Post[]> {
  if (isPreviewMode()) {
    return PREVIEW_POSTS;
  }
  const { db } = await import("@/db");
  const { posts } = await import("@/db/schema");
  const { desc } = await import("drizzle-orm");
  return db.select().from(posts).orderBy(desc(posts.publishedAt));
}

export async function getNewsPostDetail(slug: string): Promise<{ post: Post | null; recommendations: Post[] }> {
  if (isPreviewMode()) {
    const post = PREVIEW_POSTS.find((p) => p.slug === slug) || null;
    const recommendations = PREVIEW_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
    return { post, recommendations };
  }
  const { db } = await import("@/db");
  const { posts } = await import("@/db/schema");
  const { eq, ne, desc } = await import("drizzle-orm");
  const [post] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  if (!post) {
    return { post: null, recommendations: [] };
  }
  const recommendations = await db
    .select()
    .from(posts)
    .where(ne(posts.slug, slug))
    .orderBy(desc(posts.publishedAt))
    .limit(3);
  return { post, recommendations };
}

export async function getFaqList(): Promise<Faq[]> {
  if (isPreviewMode()) {
    return PREVIEW_FAQS;
  }
  const { db } = await import("@/db");
  const { faqs } = await import("@/db/schema");
  return db.select().from(faqs);
}

export async function getLocationsList(): Promise<MapLocation[]> {
  if (isPreviewMode()) {
    return PREVIEW_LOCATIONS;
  }
  const { db } = await import("@/db");
  const { mapLocations } = await import("@/db/schema");
  return db.select().from(mapLocations);
}

export function getPreviewData(type: "settings"): typeof PREVIEW_SETTINGS;
export function getPreviewData(type: "members"): typeof PREVIEW_MEMBERS;
export function getPreviewData(type: "programs"): typeof PREVIEW_PROGRAMS;
export function getPreviewData(type: "gallery"): typeof PREVIEW_GALLERY;
export function getPreviewData(type: "posts"): typeof PREVIEW_POSTS;
export function getPreviewData(type: "faqs"): typeof PREVIEW_FAQS;
export function getPreviewData(type: "locations"): typeof PREVIEW_LOCATIONS;
export function getPreviewData(type: string): unknown {
  switch (type) {
    case "settings":
      return PREVIEW_SETTINGS;
    case "members":
      return PREVIEW_MEMBERS;
    case "programs":
      return PREVIEW_PROGRAMS;
    case "gallery":
      return PREVIEW_GALLERY;
    case "posts":
      return PREVIEW_POSTS;
    case "faqs":
      return PREVIEW_FAQS;
    case "locations":
      return PREVIEW_LOCATIONS;
    default:
      return null;
  }
}

export function getPreviewPostBySlug(slug: string) {
  const post = PREVIEW_POSTS.find((p) => p.slug === slug) || null;
  const recommendations = PREVIEW_POSTS.filter((p) => p.slug !== slug).slice(0, 3);
  return { post, recommendations };
}
