import { db } from "@/db";
import { settings, posts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NewsListClient } from "./NewsListClient";
import type { Metadata } from "next";
import { isPreviewMode, getPreviewData } from "@/lib/preview";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  let siteName = "LinTree KPM";
  if (isPreviewMode()) {
    siteName = getPreviewData("settings").siteName;
  } else {
    const [siteSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    siteName = siteSettings?.siteName || "LinTree KPM";
  }
  return {
    title: `Kabar Berita — ${siteName}`,
    description: `Dapatkan informasi, rilis pers, artikel, dan rilis publikasi kegiatan KPM kelompok ${siteName} di desa.`,
  };
}

export default async function PublicNewsPage() {
  let siteSettings: typeof settings.$inferSelect | null = null;
  let allPosts: (typeof posts.$inferSelect)[];

  if (isPreviewMode()) {
    siteSettings = getPreviewData("settings");
    allPosts = getPreviewData("posts");
  } else {
    const [currentSettings] = await db.select().from(settings).where(eq(settings.id, 1)).limit(1);
    siteSettings = currentSettings;
    allPosts = await db.select().from(posts).orderBy(desc(posts.publishedAt));
  }

  const siteName = siteSettings?.siteName || "LinTree KPM";

  return <NewsListClient siteName={siteName} posts={allPosts} />;
}
