import type { MetadataRoute } from "next";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://lintreekpm.vercel.app";

// Static public routes
const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/profil`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/program-kerja`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/galeri`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/berita`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/peta-lokasi`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/faq`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Dynamic news routes from database
  const allPosts = await db
    .select({ slug: posts.slug, publishedAt: posts.publishedAt })
    .from(posts)
    .orderBy(desc(posts.publishedAt));

  const newsRoutes: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: `${BASE_URL}/berita/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...newsRoutes];
}
