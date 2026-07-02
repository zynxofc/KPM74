import { db } from "@/db";
import { settings, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NewsListClient } from "./NewsListClient";
import type { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  const siteName = siteSettings?.siteName || "LinTree KPM";
  return {
    title: `Kabar Berita — ${siteName}`,
    description: `Dapatkan informasi, rilis pers, artikel, dan rilis publikasi kegiatan KPM kelompok ${siteName} di desa.`,
  };
}

export default async function PublicNewsPage() {
  const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
  const allPosts = await db.select().from(posts).orderBy(desc(posts.publishedAt));

  const siteName = siteSettings?.siteName || "LinTree KPM";

  return <NewsListClient siteName={siteName} posts={allPosts} />;
}
